/**
 * utils.js - Utility Functions
 * Provides mathematical, formatting, and helper functions
 */

var Utils = {
    /**
     * Calculate basic statistics for an array of numbers
     */
    statistics: function(arr) {
        var nums = arr.filter(function(v) {
            return v !== null && v !== undefined && !isNaN(v);
        }).map(Number);
        if (nums.length === 0) return null;

        var sorted = nums.slice().sort(function(a, b) { return a - b; });
        var n = sorted.length;
        var sum = nums.reduce(function(a, b) { return a + b; }, 0);
        var mean = sum / n;

        // Median
        var median;
        if (n % 2 === 0) {
            median = (sorted[n / 2 - 1] + sorted[n / 2]) / 2;
        } else {
            median = sorted[Math.floor(n / 2)];
        }

        // Standard deviation
        var variance = nums.reduce(function(acc, val) {
            return acc + Math.pow(val - mean, 2);
        }, 0) / n;
        var std = Math.sqrt(variance);

        // Quartiles
        var q1 = Utils.percentile(sorted, 25);
        var q3 = Utils.percentile(sorted, 75);

        return {
            count: n,
            sum: sum,
            mean: mean,
            std: std,
            min: sorted[0],
            q1: q1,
            median: median,
            q3: q3,
            max: sorted[n - 1]
        };
    },

    /**
     * Calculate percentile from a sorted array
     */
    percentile: function(sortedArr, p) {
        var index = (p / 100) * (sortedArr.length - 1);
        var lower = Math.floor(index);
        var upper = Math.ceil(index);
        if (lower === upper) return sortedArr[lower];
        return sortedArr[lower] * (upper - index) + sortedArr[upper] * (index - lower);
    },

    /**
     * Detect data type of a column based on its values
     */
    detectType: function(values) {
        var numCount = 0;
        var nullCount = 0;

        values.forEach(function(v) {
            if (v === null || v === undefined || v === '' || v === 'NaN' || v === 'null') {
                nullCount++;
            } else if (!isNaN(Number(v))) {
                numCount++;
            }
        });

        var nonNull = values.length - nullCount;
        if (nonNull === 0) return 'object';
        if (numCount / nonNull > 0.8) return 'number';
        return 'string';
    },

    /**
     * Format number with locale-specific separators
     */
    formatNumber: function(num) {
        if (num === null || num === undefined) return '-';
        if (typeof num === 'number') {
            if (Number.isInteger(num)) return num.toLocaleString();
            return num.toLocaleString(undefined, { maximumFractionDigits: 4 });
        }
        return String(num);
    },

    /**
     * Estimate memory usage in bytes for a dataset
     */
    estimateMemory: function(data) {
        var bytes = 0;
        data.forEach(function(row) {
            Object.values(row).forEach(function(val) {
                if (val === null || val === undefined) {
                    bytes += 8;
                } else if (typeof val === 'number' || !isNaN(Number(val))) {
                    bytes += 8;
                } else {
                    bytes += String(val).length * 2;
                }
            });
        });
        return bytes;
    },

    /**
     * Format bytes to human-readable string
     */
    formatBytes: function(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    },

    /**
     * Calculate Pearson correlation coefficient between two arrays
     */
    correlation: function(x, y) {
        var n = Math.min(x.length, y.length);
        if (n < 2) return 0;

        var pairs = [];
        for (var i = 0; i < n; i++) {
            if (!isNaN(x[i]) && !isNaN(y[i]) && x[i] !== null && y[i] !== null && x[i] !== undefined && y[i] !== undefined) {
                pairs.push([Number(x[i]), Number(y[i])]);
            }
        }

        if (pairs.length < 2) return 0;

        var xs = pairs.map(function(p) { return p[0]; });
        var ys = pairs.map(function(p) { return p[1]; });
        var nValid = pairs.length;

        var meanX = xs.reduce(function(a, b) { return a + b; }, 0) / nValid;
        var meanY = ys.reduce(function(a, b) { return a + b; }, 0) / nValid;

        var num = 0, denX = 0, denY = 0;
        for (var i = 0; i < nValid; i++) {
            var dx = xs[i] - meanX;
            var dy = ys[i] - meanY;
            num += dx * dy;
            denX += dx * dx;
            denY += dy * dy;
        }

        var den = Math.sqrt(denX * denY);
        return den === 0 ? 0 : num / den;
    },

    /**
     * Show toast notification
     */
    showToast: function(message, type) {
        if (!type) type = 'info';
        var container = document.getElementById('toast-container');
        if (!container) return;
        var toast = document.createElement('div');
        toast.className = 'toast ' + type;
        toast.textContent = message;
        var translation = window.app && window.app.i18n.lastMessage;
        if (translation && translation.text === message) toast.translation = translation;
        container.appendChild(toast);

        setTimeout(function() {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(function() { toast.remove(); }, 300);
        }, 3000);
    },

    /**
     * Deep clone an object using JSON serialization
     */
    deepClone: function(obj) {
        return JSON.parse(JSON.stringify(obj));
    },

    /**
     * Shuffle array using Fisher-Yates algorithm
     */
    shuffle: function(arr) {
        var a = arr.slice();
        for (var i = a.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = a[i];
            a[i] = a[j];
            a[j] = temp;
        }
        return a;
    },

    /**
     * Download a file from string content
     */
    downloadFile: function(content, filename, mimeType) {
        var blob = new Blob([content], { type: mimeType });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
};