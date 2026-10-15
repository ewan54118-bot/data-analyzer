/**
 * advanced.js - Advanced Data Analysis Features
 * Pivot tables, outlier detection, normalization, binning, rolling stats, crosstab
 */

function AdvancedAnalyzer(dataManager) {
    this.dataManager = dataManager;
}

/**
 * Pivot Table - similar to pandas pivot_table()
 */
AdvancedAnalyzer.prototype.pivotTable = function(index, columns, values, aggFunc) {
    if (!aggFunc) aggFunc = 'mean';
    var data = this.dataManager.workingData;
    var pivot = {};

    data.forEach(function(row) {
        var indexVal = String(row[index]);
        var colVal = String(row[columns]);

        if (!pivot[indexVal]) pivot[indexVal] = {};
        if (!pivot[indexVal][colVal]) pivot[indexVal][colVal] = [];

        if (row[values] !== null && row[values] !== undefined) {
            pivot[indexVal][colVal].push(Number(row[values]));
        }
    });

    var result = [];
    var allColsSet = {};
    data.forEach(function(r) { allColsSet[String(r[columns])] = true; });
    var allColumns = Object.keys(allColsSet);

    Object.entries(pivot).forEach(function(entry) {
        var indexVal = entry[0];
        var cols = entry[1];
        var row = {};
        row[index] = indexVal;

        allColumns.forEach(function(col) {
            var values = cols[col] || [];
            if (values.length > 0) {
                var sum, mean;
                switch (aggFunc) {
                    case 'mean':
                        row[col] = values.reduce(function(a, b) { return a + b; }, 0) / values.length;
                        break;
                    case 'sum':
                        row[col] = values.reduce(function(a, b) { return a + b; }, 0);
                        break;
                    case 'count':
                        row[col] = values.length;
                        break;
                    case 'min':
                        row[col] = Math.min.apply(null, values);
                        break;
                    case 'max':
                        row[col] = Math.max.apply(null, values);
                        break;
                }
            } else {
                row[col] = null;
            }
        });
        result.push(row);
    });

    return result;
};

/**
 * Outlier Detection using IQR method
 */
AdvancedAnalyzer.prototype.detectOutliers = function(column) {
    var values = this.dataManager.workingData
        .map(function(r) { return Number(r[column]); })
        .filter(function(v) { return !isNaN(v); })
        .sort(function(a, b) { return a - b; });

    var stats = Utils.statistics(values);
    if (!stats) return { outliers: [], bounds: {}, stats: null };

    var iqr = stats.q3 - stats.q1;
    var lowerBound = stats.q1 - 1.5 * iqr;
    var upperBound = stats.q3 + 1.5 * iqr;

    var outliers = values.filter(function(v) { return v < lowerBound || v > upperBound; });

    return {
        outliers: outliers,
        bounds: { lower: lowerBound, upper: upperBound },
        stats: stats
    };
};

/**
 * Data Normalization - Min-Max scaling and Z-score
 */
AdvancedAnalyzer.prototype.normalize = function(column, method) {
    if (!method) method = 'minmax';
    var data = this.dataManager.workingData;
    var values = data.map(function(r) { return Number(r[column]); });
    var nums = values.filter(function(v) { return !isNaN(v); });

    if (method === 'minmax') {
        var min = Math.min.apply(null, nums);
        var max = Math.max.apply(null, nums);
        var range = max - min;

        return data.map(function(row) {
            var newRow = {};
            for (var k in row) newRow[k] = row[k];
            var val = Number(row[column]);
            newRow[column + '_normalized'] = isNaN(val) ? null : (range === 0 ? 0 : (val - min) / range);
            return newRow;
        });
    } else if (method === 'zscore') {
        var stats = Utils.statistics(nums);

        return data.map(function(row) {
            var newRow = {};
            for (var k in row) newRow[k] = row[k];
            var val = Number(row[column]);
            newRow[column + '_zscore'] = isNaN(val) ? null : (stats.std === 0 ? 0 : (val - stats.mean) / stats.std);
            return newRow;
        });
    }

    return data;
};

/**
 * Binning - Equal-width and equal-frequency
 */
AdvancedAnalyzer.prototype.binning = function(column, bins, method) {
    if (!bins) bins = 5;
    if (!method) method = 'width';

    var data = this.dataManager.workingData;
    var values = data.map(function(r) { return Number(r[column]); })
        .filter(function(v) { return !isNaN(v); })
        .sort(function(a, b) { return a - b; });

    var edges = [];

    if (method === 'width') {
        var min = values[0];
        var max = values[values.length - 1];
        var width = (max - min) / bins;

        for (var i = 0; i <= bins; i++) {
            edges.push(min + i * width);
        }
    } else if (method === 'frequency') {
        var binSize = Math.ceil(values.length / bins);
        for (var i = 0; i <= bins; i++) {
            var idx = Math.min(i * binSize, values.length - 1);
            edges.push(values[idx]);
        }
    }

    return data.map(function(row) {
        var newRow = {};
        for (var k in row) newRow[k] = row[k];
        var val = Number(row[column]);
        if (isNaN(val)) {
            newRow[column + '_bin'] = null;
            return newRow;
        }

        for (var i = 0; i < edges.length - 1; i++) {
            var isLast = (i === edges.length - 2);
            if (val >= edges[i] && (isLast ? val <= edges[i + 1] : val < edges[i + 1])) {
                newRow[column + '_bin'] = '[' + edges[i].toFixed(1) + ', ' + edges[i + 1].toFixed(1) + (isLast ? ']' : ')');
                return newRow;
            }
        }
        newRow[column + '_bin'] = null;
        return newRow;
    });
};

/**
 * Rolling Statistics
 */
AdvancedAnalyzer.prototype.rollingStats = function(column, window, stat) {
    if (!window) window = 3;
    if (!stat) stat = 'mean';

    var data = this.dataManager.workingData;
    var values = data.map(function(r) { return Number(r[column]); });
    var newColName = column + '_rolling_' + stat;

    return data.map(function(row, idx) {
        var newRow = {};
        for (var k in row) newRow[k] = row[k];

        if (idx < window - 1) {
            newRow[newColName] = null;
            return newRow;
        }

        var windowValues = values.slice(idx - window + 1, idx + 1).filter(function(v) { return !isNaN(v); });
        var result = null;

        if (windowValues.length > 0) {
            var mean, variance;
            switch (stat) {
                case 'mean':
                    result = windowValues.reduce(function(a, b) { return a + b; }, 0) / windowValues.length;
                    break;
                case 'sum':
                    result = windowValues.reduce(function(a, b) { return a + b; }, 0);
                    break;
                case 'std':
                    mean = windowValues.reduce(function(a, b) { return a + b; }, 0) / windowValues.length;
                    variance = windowValues.reduce(function(acc, val) {
                        return acc + Math.pow(val - mean, 2);
                    }, 0) / windowValues.length;
                    result = Math.sqrt(variance);
                    break;
            }
        }

        newRow[newColName] = result;
        return newRow;
    });
};

/**
 * Crosstab - Cross-tabulation
 */
AdvancedAnalyzer.prototype.crosstab = function(rowCol, colCol) {
    var data = this.dataManager.workingData;
    var table = {};

    data.forEach(function(d) {
        var rowVal = String(d[rowCol]);
        var colVal = String(d[colCol]);

        if (!table[rowVal]) table[rowVal] = {};
        table[rowVal][colVal] = (table[rowVal][colCol] || 0) + 1;
    });

    // Fix: recalculate properly
    table = {};
    data.forEach(function(d) {
        var rowVal = String(d[rowCol]);
        var colVal = String(d[colCol]);

        if (!table[rowVal]) table[rowVal] = {};
        if (!table[rowVal][colVal]) table[rowVal][colVal] = 0;
        table[rowVal][colVal]++;
    });

    var allColsSet = {};
    data.forEach(function(d) { allColsSet[String(d[colCol])] = true; });
    var allCols = Object.keys(allColsSet);

    var result = [];
    Object.entries(table).forEach(function(entry) {
        var rowVal = entry[0];
        var cols = entry[1];
        var newRow = {};
        newRow[rowCol] = rowVal;
        allCols.forEach(function(colVal) {
            newRow[colVal] = cols[colVal] || 0;
        });
        result.push(newRow);
    });

    return result;
};