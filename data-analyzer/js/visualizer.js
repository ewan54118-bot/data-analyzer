/**
 * visualizer.js - Data Visualization Module
 * Uses ECharts for rendering interactive charts
 */

function Visualizer(containerId, i18n) {
    this.i18n = i18n || new I18nManager();
    this.container = document.getElementById(containerId);
    this.chart = null;
    this.colorThemes = {
        'default': ['#5470c6','#91cc75','#fac858','#ee6666','#73c0de','#3ba272','#fc8452','#9a60b4','#ea7ccc'],
        'vintage': ['#d87c7c','#919e8b','#d7ab82','#6e7074','#61a0a8','#efa18d','#787464','#cc7e63','#724e58','#4b565b'],
        'dark': ['#dd6b66','#759aa0','#e69d87','#8dc1a9','#ea7e53','#eedd78','#73a373','#73b9bc','#7289ab','#91ca8c','#f49f42'],
        'westeros': ['#516b91','#59c4e6','#edafda','#93b7e3','#a5e7f0','#cbb0e3'],
        'ocean': ['#c1232b','#27727b','#fcce10','#e87c25','#b5c334','#fe8463','#9bca63','#fad860','#f3a43b','#60c0dd','#d7504b','#c6e579','#f4e001','#f0805a','#26c0c0'],
        'forest': ['#5470c6','#91cc75','#fac858','#ee6666','#73c0de','#3ba272','#fc8452','#9a60b4','#ea7ccc']
    };
}

Visualizer.prototype.init = function() {
    if (this.chart) {
        this.chart.dispose();
    }
    this.chart = echarts.init(this.container);

    var self = this;
    window.addEventListener('resize', function() {
        if (self.chart) {
            self.chart.resize();
        }
    });
};

Visualizer.prototype.getColors = function(theme) {
    return this.colorThemes[theme] || this.colorThemes['default'];
};

Visualizer.prototype.createChart = function(type, dataManager, options) {
    if (!options.refreshLanguage) {
        var snapshot = Object.assign(Object.create(Object.getPrototypeOf(dataManager)), dataManager);
        snapshot.workingData = Utils.deepClone(dataManager.workingData);
        snapshot.originalColumns = (dataManager.originalColumns || []).slice();
        snapshot.columns = dataManager.columns.slice();
        snapshot.dtypes = Object.assign({}, dataManager.dtypes);
        this.lastChart = {type:type, dataManager:snapshot, options:Object.assign({}, options)};
        this.init();
    }
    dataManager = this._displayData(dataManager);
    options = Object.assign({}, options);
    ['xCol', 'yCol', 'colorCol'].forEach(function(key) {
        options[key] = dataManager.displayColumn(options[key]);
    });

    var xCol = options.xCol;
    var yCol = options.yCol;
    var colorCol = options.colorCol;
    var title = options.title;
    var theme = options.theme;
    var data = dataManager.workingData;
    var colors = this.getColors(theme);

    var chartOption;

    switch (type) {
        case 'bar':
            chartOption = this._createBarChart(data, xCol, yCol, colorCol, title, colors);
            break;
        case 'line':
            chartOption = this._createLineChart(data, xCol, yCol, colorCol, title, colors);
            break;
        case 'scatter':
            chartOption = this._createScatterChart(data, xCol, yCol, colorCol, title, colors);
            break;
        case 'pie':
            chartOption = this._createPieChart(data, xCol, yCol, title, colors);
            break;
        case 'histogram':
            chartOption = this._createHistogram(data, xCol, title, colors);
            break;
        case 'box':
            chartOption = this._createBoxChart(data, xCol, yCol, title, colors);
            break;
        case 'heatmap':
            chartOption = this._createHeatmap(dataManager, title, colors);
            break;
        case 'radar':
            chartOption = this._createRadarChart(data, xCol, yCol, colorCol, title, colors, dataManager);
            break;
        case 'funnel':
            chartOption = this._createFunnelChart(data, xCol, yCol, title, colors);
            break;
        default:
            chartOption = this._createBarChart(data, xCol, yCol, colorCol, title, colors);
    }

    if (options.refreshLanguage && chartOption.legend) {
        var previousLegend = this.chart.getOption().legend;
        var selected = previousLegend && previousLegend[0] ? previousLegend[0].selected : {};
        var manager = this.lastChart.dataManager, i18n = this.i18n;
        chartOption.legend.selected = {};
        Object.keys(selected || {}).forEach(function(name) {
            var raw = manager.isDefaultDataset ? (Object.keys(DEFAULT_VALUE_LABELS).find(function(k) { return DEFAULT_VALUE_LABELS[k] === name; }) || name) : name;
            chartOption.legend.selected[i18n.value(raw, manager)] = selected[name];
        });
    }
    this.chart.setOption(chartOption, options.refreshLanguage ? {replaceMerge:['series']} : undefined);
};

Visualizer.prototype._createBarChart = function(data, xCol, yCol, colorCol, title, colors) {
    if (colorCol && colorCol !== '') {
        var groups = {};
        data.forEach(function(row) {
            var group = String(row[colorCol]);
            if (!groups[group]) groups[group] = {};
            groups[group][row[xCol]] = row[yCol];
        });

        var xValues = [];
        var seen = {};
        data.forEach(function(r) {
            if (!seen[r[xCol]]) {
                xValues.push(r[xCol]);
                seen[r[xCol]] = true;
            }
        });

        var series = Object.entries(groups).map(function(entry, i) {
            var name = entry[0];
            var vals = entry[1];
            return {
                name: name,
                type: 'bar',
                data: xValues.map(function(x) { return vals[x] || 0; }),
                itemStyle: { color: colors[i % colors.length] }
            };
        });

        return {
            title: { text: title || this.i18n.t('chart_bar'), left: 'center' },
            tooltip: { trigger: 'axis' },
            legend: { top: 30, type: 'scroll' },
            grid: { top: 80, bottom: 80, left: 60, right: 30 },
            xAxis: { type: 'category', data: xValues, axisLabel: { rotate: 30 } },
            yAxis: { type: 'value', name: yCol },
            dataZoom: [{ type: 'inside' }, { type: 'slider' }],
            series: series
        };
    } else {
        var xValues = data.map(function(r) { return r[xCol]; });
        var yValues = yCol ? data.map(function(r) { return Number(r[yCol]) || 0; }) : data.map(function() { return 1; });

        return {
            title: { text: title || this.i18n.t('chart_bar'), left: 'center' },
            tooltip: { trigger: 'axis' },
            grid: { top: 50, bottom: 80, left: 60, right: 30 },
            xAxis: { type: 'category', data: xValues, axisLabel: { rotate: 30, interval: 0 } },
            yAxis: { type: 'value', name: yCol || '' },
            dataZoom: [{ type: 'inside' }, { type: 'slider' }],
            series: [{
                type: 'bar',
                data: yValues,
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: colors[0] },
                        { offset: 1, color: colors[1] || colors[0] }
                    ])
                },
                barMaxWidth: 50
            }]
        };
    }
};

Visualizer.prototype._createLineChart = function(data, xCol, yCol, colorCol, title, colors) {
    var xValues = data.map(function(r) { return r[xCol]; });
    var yValues = yCol ? data.map(function(r) { return Number(r[yCol]) || 0; }) : [];

    return {
        title: { text: title || this.i18n.t('chart_line'), left: 'center' },
        tooltip: { trigger: 'axis' },
        grid: { top: 50, bottom: 80, left: 60, right: 30 },
        xAxis: { type: 'category', data: xValues, axisLabel: { rotate: 30 } },
        yAxis: { type: 'value', name: yCol || '' },
        dataZoom: [{ type: 'inside' }, { type: 'slider' }],
        series: [{
            type: 'line',
            data: yValues,
            smooth: true,
            lineStyle: { width: 3, color: colors[0] },
            areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: colors[0] + '40' },
                    { offset: 1, color: colors[0] + '05' }
                ])
            },
            itemStyle: { color: colors[0] },
            symbol: 'circle',
            symbolSize: 8
        }]
    };
};

Visualizer.prototype._createScatterChart = function(data, xCol, yCol, colorCol, title, colors) {
    if (colorCol && colorCol !== '') {
        var groups = {};
        data.forEach(function(row) {
            var group = String(row[colorCol]);
            if (!groups[group]) groups[group] = [];
            groups[group].push([Number(row[xCol]) || 0, Number(row[yCol]) || 0]);
        });

        var series = Object.entries(groups).map(function(entry, i) {
            return {
                name: entry[0],
                type: 'scatter',
                data: entry[1],
                symbolSize: 12,
                itemStyle: { color: colors[i % colors.length] }
            };
        });

        return {
            title: { text: title || this.i18n.t('chart_scatter'), left: 'center' },
            tooltip: {
                trigger: 'item',
                formatter: function(params) {
                    return params.seriesName + '<br/>' + xCol + ': ' + params.value[0] + '<br/>' + yCol + ': ' + params.value[1];
                }
            },
            legend: { top: 30, type: 'scroll' },
            grid: { top: 80, bottom: 50, left: 60, right: 30 },
            xAxis: { type: 'value', name: xCol, nameLocation: 'center', nameGap: 30 },
            yAxis: { type: 'value', name: yCol },
            series: series
        };
    }

    var points = data.map(function(row) { return [Number(row[xCol]) || 0, Number(row[yCol]) || 0]; });

    return {
        title: { text: title || this.i18n.t('chart_scatter'), left: 'center' },
        tooltip: {
            trigger: 'item',
            formatter: function(params) {
                return xCol + ': ' + params.value[0] + '<br/>' + yCol + ': ' + params.value[1];
            }
        },
        grid: { top: 50, bottom: 50, left: 60, right: 30 },
        xAxis: { type: 'value', name: xCol, nameLocation: 'center', nameGap: 30 },
        yAxis: { type: 'value', name: yCol },
        series: [{
            type: 'scatter',
            data: points,
            symbolSize: 12,
            itemStyle: { color: colors[0], opacity: 0.8 }
        }]
    };
};

Visualizer.prototype._createPieChart = function(data, xCol, yCol, title, colors) {
    var pieData = data.map(function(row) {
        return {
            name: String(row[xCol]),
            value: yCol ? (Number(row[yCol]) || 0) : 1
        };
    }).sort(function(a, b) { return b.value - a.value; }).slice(0, 15);

    return {
        title: { text: title || this.i18n.t('chart_pie'), left: 'center' },
        tooltip: {
            trigger: 'item',
            formatter: '{b}: {c} ({d}%)'
        },
        legend: {
            type: 'scroll',
            orient: 'vertical',
            right: 10,
            top: 50,
            bottom: 20
        },
        color: colors,
        series: [{
            type: 'pie',
            radius: ['30%', '65%'],
            center: ['40%', '55%'],
            avoidLabelOverlap: true,
            itemStyle: {
                borderRadius: 8,
                borderColor: '#fff',
                borderWidth: 2
            },
            label: { show: true, formatter: '{b}: {d}%' },
            emphasis: {
                label: { show: true, fontSize: 16, fontWeight: 'bold' }
            },
            data: pieData
        }]
    };
};

Visualizer.prototype._createHistogram = function(data, xCol, title, colors) {
    var values = data.map(function(r) { return Number(r[xCol]); }).filter(function(v) { return !isNaN(v); });
    var stats = Utils.statistics(values);

    if (!stats) return { title: { text: this.i18n.t('chart_no_data') } };

    var binCount = Math.min(20, Math.max(5, Math.ceil(Math.sqrt(values.length))));
    var binWidth = (stats.max - stats.min) / binCount;
    var bins = new Array(binCount).fill(0);
    var labels = [];

    for (var i = 0; i < binCount; i++) {
        var start = stats.min + i * binWidth;
        var end = start + binWidth;
        labels.push(start.toFixed(1) + '-' + end.toFixed(1));
        values.forEach(function(v) {
            if (v >= start && (i === binCount - 1 ? v <= end : v < end)) {
                bins[i]++;
            }
        });
    }

    return {
        title: { text: title || this.i18n.t('chart_histogram', {column:xCol}), left: 'center' },
        tooltip: { trigger: 'axis' },
        grid: { top: 50, bottom: 80, left: 60, right: 30 },
        xAxis: { type: 'category', data: labels, axisLabel: { rotate: 30 } },
        yAxis: { type: 'value', name: this.i18n.t('chart_frequency') },
        series: [{
            type: 'bar',
            data: bins,
            itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: colors[0] },
                    { offset: 1, color: colors[2] || colors[0] }
                ])
            },
            barWidth: '90%'
        }]
    };
};

Visualizer.prototype._createBoxChart = function(data, xCol, yCol, title, colors) {
    var i18n = this.i18n;
    var numCols;
    if (yCol) {
        numCols = [yCol];
    } else if (data[0]) {
        numCols = Object.keys(data[0]).filter(function(k) {
            return typeof data[0][k] === 'number';
        }).slice(0, 8);
    } else {
        numCols = [];
    }

    var boxData = numCols.map(function(col) {
        var vals = data.map(function(r) { return Number(r[col]); })
            .filter(function(v) { return !isNaN(v); })
            .sort(function(a, b) { return a - b; });
        var stats = Utils.statistics(vals);
        if (!stats) return [0, 0, 0, 0, 0];
        return [stats.min, stats.q1, stats.median, stats.q3, stats.max];
    });

    return {
        title: { text: title || this.i18n.t('chart_box'), left: 'center' },
        tooltip: { trigger: 'item', formatter: function(p) {
            var labels = ['stat_min', 'stat_q1', 'stat_median', 'stat_q3', 'stat_max'];
            var values = p.value.slice(-5);
            return p.name + '<br/>' + labels.map(function(key, i) { return i18n.t(key) + ': ' + values[i]; }).join('<br/>');
        } },
        grid: { top: 50, bottom: 50, left: 80, right: 30 },
        xAxis: { type: 'category', data: numCols },
        yAxis: { type: 'value' },
        series: [{
            type: 'boxplot',
            data: boxData,
            itemStyle: { color: colors[0] + '30', borderColor: colors[0] }
        }]
    };
};

Visualizer.prototype._createHeatmap = function(dataManager, title, colors) {
    var i18n = this.i18n;
    var corrData = dataManager.correlationMatrix();
    var heatData = [];

    for (var i = 0; i < corrData.matrix.length; i++) {
        for (var j = 0; j < corrData.matrix[i].length; j++) {
            heatData.push([j, i, Number(corrData.matrix[i][j].toFixed(2))]);
        }
    }

    return {
        title: { text: title || this.i18n.t('chart_heatmap'), left: 'center' },
        tooltip: {
            position: 'top',
            formatter: function(p) {
                return corrData.columns[p.value[1]] + ' × ' + corrData.columns[p.value[0]] + '<br/>' + i18n.t('chart_correlation') + ' = ' + p.value[2];
            }
        },
        grid: { top: 50, bottom: 100, left: 120, right: 60 },
        xAxis: { type: 'category', data: corrData.columns, axisLabel: { rotate: 45 } },
        yAxis: { type: 'category', data: corrData.columns },
        visualMap: {
            min: -1, max: 1,
            calculable: true,
            orient: 'horizontal',
            left: 'center',
            bottom: 10,
            inRange: {
                color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
            }
        },
        series: [{
            type: 'heatmap',
            data: heatData,
            label: { show: true, fontSize: 10 },
            emphasis: {
                itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.5)' }
            }
        }]
    };
};

Visualizer.prototype._createRadarChart = function(data, xCol, yCol, colorCol, title, colors, dataManager) {
    var numCols = dataManager.getNumericColumns().slice(0, 8);

    var maxValues = {};
    numCols.forEach(function(col) {
        maxValues[col] = Math.max.apply(null, data.map(function(r) { return Number(r[col]) || 0; }));
    });

    var items = data.slice(0, 5);
    var indicators = numCols.map(function(col) {
        return { name: col, max: maxValues[col] * 1.1 };
    });

    var seriesData = items.map(function(row, i) {
        return {
            name: String(row[xCol]),
            value: numCols.map(function(col) { return Number(row[col]) || 0; }),
            lineStyle: { color: colors[i % colors.length] },
            itemStyle: { color: colors[i % colors.length] },
            areaStyle: { color: colors[i % colors.length] + '30' }
        };
    });

    return {
        title: { text: title || this.i18n.t('chart_radar'), left: 'center' },
        tooltip: {},
        legend: { top: 30, type: 'scroll', data: seriesData.map(function(s) { return s.name; }) },
        radar: { indicator: indicators, radius: '60%', center: ['50%', '55%'] },
        series: [{
            type: 'radar',
            data: seriesData
        }]
    };
};

Visualizer.prototype._createFunnelChart = function(data, xCol, yCol, title, colors) {
    var funnelData = data.map(function(row) {
        return {
            name: String(row[xCol]),
            value: yCol ? (Number(row[yCol]) || 0) : 1
        };
    }).sort(function(a, b) { return b.value - a.value; }).slice(0, 10);

    return {
        title: { text: title || this.i18n.t('chart_funnel'), left: 'center' },
        tooltip: { trigger: 'item', formatter: '{b}: {c}' },
        legend: { top: 30, type: 'scroll' },
        color: colors,
        series: [{
            type: 'funnel',
            left: '10%',
            width: '80%',
            top: 60,
            bottom: 30,
            sort: 'descending',
            gap: 2,
            label: { show: true, position: 'inside' },
            data: funnelData
        }]
    };
};

/**
 * Create correlation heatmap for overview tab
 */
Visualizer.prototype.createCorrelationHeatmap = function(containerId, dataManager) {
    var container = document.getElementById(containerId);
    if (!container) return;

    this.correlationSource = {containerId:containerId, dataManager:dataManager};
    dataManager = this._displayData(dataManager);
    var chart = echarts.getInstanceByDom(container) || echarts.init(container);
    var i18n = this.i18n;
    var corrData = dataManager.correlationMatrix();
    var heatData = [];

    for (var i = 0; i < corrData.matrix.length; i++) {
        for (var j = 0; j < corrData.matrix[i].length; j++) {
            heatData.push([j, i, Number(corrData.matrix[i][j].toFixed(2))]);
        }
    }

    chart.setOption({
        tooltip: {
            position: 'top',
            formatter: function(p) {
                return corrData.columns[p.value[1]] + ' × ' + corrData.columns[p.value[0]] + '<br/>' + i18n.t('chart_correlation') + ' = ' + p.value[2];
            }
        },
        grid: { top: 20, bottom: 80, left: 100, right: 60 },
        xAxis: { type: 'category', data: corrData.columns, axisLabel: { rotate: 45, fontSize: 10 } },
        yAxis: { type: 'category', data: corrData.columns, axisLabel: { fontSize: 10 } },
        visualMap: {
            min: -1, max: 1,
            calculable: true,
            orient: 'horizontal',
            left: 'center',
            bottom: 0,
            inRange: {
                color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
            }
        },
        series: [{
            type: 'heatmap',
            data: heatData,
            label: { show: true, fontSize: 9 },
            emphasis: {
                itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.5)' }
            }
        }]
    });

    window.addEventListener('resize', function() { chart.resize(); });
};
Visualizer.prototype._displayData = function(manager) {
    var i18n = this.i18n;
    function column(c) { return i18n.column(c, manager); }
    return {
        displayColumn: column,
        workingData: manager.workingData.map(function(row) {
            var display = {};
            Object.keys(row).forEach(function(key) { display[column(key)] = row[key] == null ? row[key] : i18n.value(row[key], manager); });
            return display;
        }),
        getNumericColumns: function() { return manager.getNumericColumns().map(column); },
        correlationMatrix: function() {
            var result = manager.correlationMatrix();
            return {columns:result.columns.map(column), matrix:result.matrix};
        }
    };
};
Visualizer.prototype.refreshLanguage = function() {
    if (this.lastChart && this.chart) {
        var last = this.lastChart;
        this.createChart(last.type, last.dataManager, Object.assign({}, last.options, {refreshLanguage:true}));
    }
    if (this.correlationSource) this.createCorrelationHeatmap(this.correlationSource.containerId, this.correlationSource.dataManager);
};
