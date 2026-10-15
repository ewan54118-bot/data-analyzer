/**
 * dataManager.js - Data Management Module
 * Implements pandas-like operations on client-side data
 */

function DataManager() {
    this.data = [];
    this.workingData = [];
    this.columns = [];
    this.dtypes = {};
    this.fileName = '';
}

/**
 * Load data from array of objects
 */
DataManager.prototype.loadData = function(dataArray, fileName) {
    if (!fileName) fileName = 'untitled';
    if (!dataArray || dataArray.length === 0) {
        throw Object.assign(new Error('Empty dataset'), {i18nKey: 'error_empty_dataset'});
    }

    this.data = Utils.deepClone(dataArray);
    this.workingData = Utils.deepClone(dataArray);
    this.columns = Object.keys(dataArray[0]);
    this.originalColumns = this.columns.slice();
    this.fileName = fileName;
    this._detectTypes();

    return {
        rows: this.data.length,
        cols: this.columns.length,
        columns: this.columns
    };
};

/**
 * Parse CSV string to data array using PapaParse
 */
DataManager.parseCSV = function(csvString) {
    var result = Papa.parse(csvString.trim(), {
        header: true,
        dynamicTyping: false,
        skipEmptyLines: true
    });

    if (result.errors.length > 0) {
        var error = result.errors[0];
        var keys = {Quotes: 'error_csv_quotes', Delimiter: 'error_csv_delimiter', FieldMismatch: 'error_csv_fields'};
        throw Object.assign(new Error(error.message), {i18nKey: keys[error.type] || 'error_csv'});
    }

    if (result.data.length > 0) {
        var columns = Object.keys(result.data[0]);
        columns.forEach(function(col) {
            var values = result.data.map(function(row) { return row[col]; });
            var type = Utils.detectType(values);
            if (type === 'number') {
                result.data.forEach(function(row) {
                    var val = row[col];
                    if (val !== null && val !== undefined && val !== '' && !isNaN(Number(val))) {
                        row[col] = Number(val);
                    }
                });
            }
        });
    }

    return result.data;
};

/**
 * Parse JSON string to data array
 */
DataManager.parseJSON = function(jsonString) {
    var parsed = JSON.parse(jsonString.trim());
    var data;
    if (parsed === null || typeof parsed !== 'object') {
        throw Object.assign(new Error('Invalid JSON format'), {i18nKey:'error_invalid_json'});
    }

    if (Array.isArray(parsed)) {
        data = parsed;
    } else if (parsed.data && Array.isArray(parsed.data)) {
        data = parsed.data;
    } else {
        data = [parsed];
    }

    if (data.length === 0 || data.some(function(row) { return row === null || typeof row !== 'object' || Array.isArray(row); })) {
        throw Object.assign(new Error('Invalid JSON format'), {i18nKey: 'error_invalid_json'});
    }

    return data;
};

/**
 * Detect column types
 */
DataManager.prototype._detectTypes = function() {
    var self = this;
    this.dtypes = {};
    this.columns.forEach(function(col) {
        var values = self.workingData.map(function(row) { return row[col]; });
        self.dtypes[col] = Utils.detectType(values);
    });
};

/**
 * head(n) - First n rows
 */
DataManager.prototype.head = function(n) {
    if (!n) n = 5;
    return this.workingData.slice(0, n);
};

/**
 * tail(n) - Last n rows
 */
DataManager.prototype.tail = function(n) {
    if (!n) n = 5;
    return this.workingData.slice(-n);
};

/**
 * sample(n) - Random sample
 */
DataManager.prototype.sample = function(n) {
    if (!n) n = 5;
    var shuffled = Utils.shuffle(this.workingData);
    return shuffled.slice(0, Math.min(n, shuffled.length));
};

/**
 * info() - Dataset info
 */
DataManager.prototype.info = function() {
    return {
        rows: this.workingData.length,
        cols: this.columns.length,
        columns: this.columns,
        dtypes: this.dtypes,
        memory: Utils.estimateMemory(this.workingData),
        missing: this._countMissing()
    };
};

/**
 * Count missing values per column
 */
DataManager.prototype._countMissing = function() {
    var result = {};
    var columns = this.columns;
    var data = this.workingData;

    columns.forEach(function(col) {
        var count = 0;
        data.forEach(function(row) {
            var val = row[col];
            if (val === null || val === undefined || val === '' ||
                (typeof val === 'string' && val.toLowerCase() === 'nan') ||
                (typeof val === 'number' && isNaN(val))) {
                count++;
            }
        });
        result[col] = count;
    });
    return result;
};

/**
 * describe() - Statistical summary for numeric columns
 */
DataManager.prototype.describe = function() {
    var result = {};
    var self = this;
    this.columns.forEach(function(col) {
        if (self.dtypes[col] === 'number') {
            var values = self.workingData.map(function(row) { return row[col]; });
            result[col] = Utils.statistics(values);
        }
    });
    return result;
};

/**
 * value_counts(column) - Count unique values
 */
DataManager.prototype.valueCounts = function(column) {
    var counts = {};
    this.workingData.forEach(function(row) {
        var val = row[column];
        var key = (val === null || val === undefined) ? 'NaN' : String(val);
        counts[key] = (counts[key] || 0) + 1;
    });

    var total = this.workingData.length;
    return Object.entries(counts)
        .sort(function(a, b) { return b[1] - a[1]; })
        .map(function(entry) {
            return {
                value: entry[0],
                count: entry[1],
                percentage: ((entry[1] / total) * 100).toFixed(1) + '%'
            };
        });
};

/**
 * sort_values(by, ascending)
 */
DataManager.prototype.sortValues = function(column, ascending) {
    if (ascending === undefined) ascending = true;
    var sorted = this.workingData.slice().sort(function(a, b) {
        var va = a[column];
        var vb = b[column];

        if (va === null || va === undefined) return 1;
        if (vb === null || vb === undefined) return -1;

        if (typeof va === 'number' && typeof vb === 'number') {
            return ascending ? va - vb : vb - va;
        }

        va = String(va).toLowerCase();
        vb = String(vb).toLowerCase();
        return ascending ? va.localeCompare(vb) : vb.localeCompare(va);
    });

    return sorted;
};

/**
 * query(column, operator, value)
 */
DataManager.prototype.query = function(column, operator, value) {
    return this.workingData.filter(function(row) {
        var cellVal = row[column];

        switch (operator) {
            case '==': return String(cellVal) === String(value);
            case '!=': return String(cellVal) !== String(value);
            case '>': return Number(cellVal) > Number(value);
            case '<': return Number(cellVal) < Number(value);
            case '>=': return Number(cellVal) >= Number(value);
            case '<=': return Number(cellVal) <= Number(value);
            case 'contains': return String(cellVal).toLowerCase().indexOf(String(value).toLowerCase()) !== -1;
            case 'not_contains': return String(cellVal).toLowerCase().indexOf(String(value).toLowerCase()) === -1;
            default: return true;
        }
    });
};

/**
 * groupby(column).agg(functions)
 */
DataManager.prototype.groupBy = function(groupCol, valueCol, aggFunctions) {
    var groups = {};

    this.workingData.forEach(function(row) {
        var key = (row[groupCol] !== null && row[groupCol] !== undefined)
            ? String(row[groupCol]) : 'NaN';
        if (!groups[key]) groups[key] = [];
        if (valueCol && row[valueCol] !== null && row[valueCol] !== undefined) {
            groups[key].push(row[valueCol]);
        } else if (!valueCol) {
            groups[key].push(row);
        }
    });

    var results = [];
    Object.entries(groups).forEach(function(entry) {
        var key = entry[0];
        var values = entry[1];
        var row = {};
        row[groupCol] = key;

        aggFunctions.forEach(function(fn) {
            if (fn === 'count') {
                row['count'] = values.length;
            } else {
                var nums = values.map(Number).filter(function(v) { return !isNaN(v); });
                if (nums.length > 0) {
                    var i, mean, sorted, mid;
                    switch (fn) {
                        case 'sum':
                            row['sum'] = nums.reduce(function(a, b) { return a + b; }, 0);
                            break;
                        case 'mean':
                            row['mean'] = nums.reduce(function(a, b) { return a + b; }, 0) / nums.length;
                            break;
                        case 'min':
                            row['min'] = Math.min.apply(null, nums);
                            break;
                        case 'max':
                            row['max'] = Math.max.apply(null, nums);
                            break;
                        case 'std':
                            mean = nums.reduce(function(a, b) { return a + b; }, 0) / nums.length;
                            var variance = nums.reduce(function(acc, val) {
                                return acc + Math.pow(val - mean, 2);
                            }, 0) / nums.length;
                            row['std'] = Math.sqrt(variance);
                            break;
                        case 'median':
                            sorted = nums.slice().sort(function(a, b) { return a - b; });
                            mid = Math.floor(sorted.length / 2);
                            row['median'] = sorted.length % 2 === 0
                                ? (sorted[mid - 1] + sorted[mid]) / 2
                                : sorted[mid];
                            break;
                    }
                }
            }
        });

        results.push(row);
    });

    return results;
};

/**
 * handleMissing(column, method, fillValue)
 */
DataManager.prototype.handleMissing = function(column, method, fillValue) {
    var result = this.workingData.slice();

    var isMissing = function(val) {
        return val === null || val === undefined || val === '' ||
            (typeof val === 'number' && isNaN(val));
    };

    switch (method) {
        case 'dropna':
            result = result.filter(function(row) {
                return !isMissing(row[column]);
            });
            break;

        case 'fill_mean':
            var nums1 = result.map(function(r) { return r[column]; }).filter(function(v) { return !isNaN(v) && v !== null && v !== undefined && v !== ''; });
            var mean = nums1.reduce(function(a, b) { return a + Number(b); }, 0) / nums1.length;
            result = result.map(function(row) {
                if (isMissing(row[column])) {
                    var newRow = {};
                    for (var k in row) newRow[k] = row[k];
                    newRow[column] = mean;
                    return newRow;
                }
                return row;
            });
            break;

        case 'fill_median':
            var nums2 = result.map(function(r) { return Number(r[column]); })
                .filter(function(v) { return !isNaN(v); })
                .sort(function(a, b) { return a - b; });
            var mid = Math.floor(nums2.length / 2);
            var median = nums2.length % 2 === 0 ? (nums2[mid - 1] + nums2[mid]) / 2 : nums2[mid];
            result = result.map(function(row) {
                if (isMissing(row[column])) {
                    var newRow = {};
                    for (var k in row) newRow[k] = row[k];
                    newRow[column] = median;
                    return newRow;
                }
                return row;
            });
            break;

        case 'fill_mode':
            var modeCounts = {};
            result.forEach(function(row) {
                var val = row[column];
                if (!isMissing(val)) {
                    modeCounts[val] = (modeCounts[val] || 0) + 1;
                }
            });
            var modeEntries = Object.entries(modeCounts).sort(function(a, b) { return b[1] - a[1]; });
            var mode = modeEntries.length > 0 ? modeEntries[0][0] : null;
            result = result.map(function(row) {
                if (isMissing(row[column])) {
                    var newRow = {};
                    for (var k in row) newRow[k] = row[k];
                    newRow[column] = mode;
                    return newRow;
                }
                return row;
            });
            break;

        case 'fill_value':
            result = result.map(function(row) {
                if (isMissing(row[column])) {
                    var newRow = {};
                    for (var k in row) newRow[k] = row[k];
                    newRow[column] = fillValue;
                    return newRow;
                }
                return row;
            });
            break;

        case 'fill_ffill':
            var lastVal = null;
            result = result.map(function(row) {
                if (!isMissing(row[column])) {
                    lastVal = row[column];
                } else if (lastVal !== null) {
                    var newRow = {};
                    for (var k in row) newRow[k] = row[k];
                    newRow[column] = lastVal;
                    return newRow;
                }
                return row;
            });
            break;

        case 'fill_bfill':
            var nextVal = null;
            var reversed = result.slice().reverse();
            reversed = reversed.map(function(row) {
                if (!isMissing(row[column])) {
                    nextVal = row[column];
                } else if (nextVal !== null) {
                    var newRow = {};
                    for (var k in row) newRow[k] = row[k];
                    newRow[column] = nextVal;
                    return newRow;
                }
                return row;
            });
            result = reversed.reverse();
            break;
    }

    return result;
};

/**
 * drop column
 */
DataManager.prototype.dropColumn = function(column) {
    return this.workingData.map(function(row) {
        var newRow = {};
        for (var k in row) {
            if (k !== column) newRow[k] = row[k];
        }
        return newRow;
    });
};

/**
 * rename column
 */
DataManager.prototype.renameColumn = function(oldName, newName) {
    return this.workingData.map(function(row) {
        var newRow = {};
        Object.keys(row).forEach(function(key) {
            newRow[key === oldName ? newName : key] = row[key];
        });
        return newRow;
    });
};

/**
 * convert column type
 */
DataManager.prototype.convertType = function(column, newType) {
    return this.workingData.map(function(row) {
        var newRow = {};
        for (var k in row) newRow[k] = row[k];
        if (newType === 'number') {
            newRow[column] = Number(newRow[column]);
        } else {
            newRow[column] = String(newRow[column]);
        }
        return newRow;
    });
};

/**
 * add computed column using expression
 */
DataManager.prototype.addComputedColumn = function(name, expression) {
    var columns = this.columns;
    return this.workingData.map(function(row) {
        var newRow = {};
        for (var k in row) newRow[k] = row[k];
        try {
            var expr = expression;
            columns.forEach(function(col) {
                var regex = new RegExp('\\b' + col.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'g');
                var val = row[col];
                if (typeof val === 'number') {
                    expr = expr.replace(regex, val);
                } else if (val !== null && val !== undefined) {
                    expr = expr.replace(regex, '"' + String(val).replace(/"/g, '\\"') + '"');
                }
            });
            newRow[name] = eval(expr);
        } catch (e) {
            newRow[name] = null;
        }
        return newRow;
    });
};

/**
 * drop_duplicates
 */
DataManager.prototype.dropDuplicates = function(columns) {
    var seen = {};
    return this.workingData.filter(function(row) {
        var key = columns.map(function(col) { return JSON.stringify(row[col]); }).join('|');
        if (seen[key]) return false;
        seen[key] = true;
        return true;
    });
};

/**
 * correlation matrix for all numeric columns
 */
DataManager.prototype.correlationMatrix = function() {
    var self = this;
    var numCols = this.columns.filter(function(col) { return self.dtypes[col] === 'number'; });
    var matrix = [];

    for (var i = 0; i < numCols.length; i++) {
        var row = [];
        var xValues = this.workingData.map(function(r) { return r[numCols[i]]; });
        for (var j = 0; j < numCols.length; j++) {
            var yValues = this.workingData.map(function(r) { return r[numCols[j]]; });
            row.push(Utils.correlation(xValues, yValues));
        }
        matrix.push(row);
    }

    return { columns: numCols, matrix: matrix };
};

/**
 * Apply working data as main data
 */
DataManager.prototype.applyWorkingData = function(newData) {
    if (!newData || newData.length === 0) return;
    this.workingData = Utils.deepClone(newData);
    this.columns = Object.keys(newData[0]);
    this._detectTypes();
};

/**
 * Set working data directly (without cloning)
 */
DataManager.prototype.setWorkingData = function(newData) {
    this.workingData = newData;
    if (newData.length > 0) {
        this.columns = Object.keys(newData[0]);
        this._detectTypes();
    }
};

/**
 * Reset to original data
 */
DataManager.prototype.resetData = function() {
    this.workingData = Utils.deepClone(this.data);
    if (this.data.length > 0) {
        this.columns = Object.keys(this.data[0]);
        this._detectTypes();
    }
};

/**
 * Export as CSV string
 */
DataManager.prototype.toCSV = function(data) {
    var d = data || this.workingData;
    return Papa.unparse(d);
};

/**
 * Export as JSON string
 */
DataManager.prototype.toJSON = function(data) {
    var d = data || this.workingData;
    return JSON.stringify(d, null, 2);
};

/**
 * Export as TSV (for clipboard)
 */
DataManager.prototype.toTSV = function(data) {
    var d = data || this.workingData;
    var cols = this.columns;
    var headers = cols.join('\t');
    var rows = d.map(function(row) {
        return cols.map(function(col) {
            return row[col] !== null && row[col] !== undefined ? row[col] : '';
        }).join('\t');
    });
    return [headers].concat(rows).join('\n');
};

/**
 * Export as HTML table
 */
DataManager.prototype.toHTML = function(data) {
    var d = data || this.workingData;
    var cols = this.columns;
    var html = '<table border="1" style="border-collapse:collapse;">\n<thead>\n<tr>\n';
    cols.forEach(function(col) {
        html += '  <th>' + col + '</th>\n';
    });
    html += '</tr>\n</thead>\n<tbody>\n';
    d.forEach(function(row) {
        html += '<tr>\n';
        cols.forEach(function(col) {
            html += '  <td>' + (row[col] !== null && row[col] !== undefined ? row[col] : '') + '</td>\n';
        });
        html += '</tr>\n';
    });
    html += '</tbody>\n</table>';
    return html;
};

/**
 * Get numeric columns
 */
DataManager.prototype.getNumericColumns = function() {
    var self = this;
    return this.columns.filter(function(col) { return self.dtypes[col] === 'number'; });
};

/**
 * Get string columns
 */
DataManager.prototype.getStringColumns = function() {
    var self = this;
    return this.columns.filter(function(col) { return self.dtypes[col] === 'string'; });
};