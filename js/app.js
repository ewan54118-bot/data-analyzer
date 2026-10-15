function App() {
    this.i18n = new I18nManager();
    this.dataManager = new DataManager();
    this.visualizer = new Visualizer('chart-container', this.i18n);
    this.advanced = null;
    this.currentView = 'home';
    this.transformResult = null;
    this.advancedResult = null;
    this.init();
}

App.prototype.init = function() {
    var self = this;
    this.i18n.applyTranslations();
    this._setupNavigation();
    this._setupThemeToggle();
    this._setupLangToggle();
    this._setupMobileMenu();
    this._setupScrollEffects();
    this._setupSectionTabs();
    this._setupDataLoading();
    this._setupOverview();
    this._setupTransform();
    this._setupVisualize();
    this._setupAdvanced();
    this._setupExport();

    setTimeout(function() {
        document.getElementById('loading-screen').classList.add('hidden');
    }, 600);

    this._updateTime();
    setInterval(function() { self._updateTime(); }, 1000);

    var hash = window.location.hash.replace('#', '');
    var valid = ['home','data','overview','transform','visualize','advanced','export'];
    if (hash && valid.includes(hash)) { navigateTo(hash, false); }
    else { navigateTo('home', false); }
};

// ============ 页面路由 ============
window.navigateTo = function(viewId, updateHash) {
    if (updateHash === undefined) updateHash = true;
    document.querySelectorAll('.page-view').forEach(function(v) { v.classList.remove('active'); });
    var target = document.getElementById('view-' + viewId);
    if (target) target.classList.add('active');

    document.querySelectorAll('.nav-group-home .nav-link').forEach(function(link) {
        link.classList.remove('active');
        var onclick = link.getAttribute('onclick') || '';
        if (onclick.includes("'" + viewId + "'")) link.classList.add('active');
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (updateHash) history.pushState(null, '', '#' + viewId);

    var nav = document.getElementById('mainNav');
    var btn = document.getElementById('mobileMenuBtn');
    if (nav) nav.classList.remove('open');
    if (btn) btn.classList.remove('active');

    if (window.app && window.app.dataManager.workingData.length > 0) {
        setTimeout(function() {
            if (viewId === 'overview') window.app._refreshOverview();
            if (viewId === 'visualize') window.app._refreshVizSelects();
            if (viewId === 'export') window.app._refreshExportPreview();
            if (viewId === 'advanced') window.app._refreshAdvancedSelects();
        }, 100);
    }
};
window.addEventListener('popstate', function() {
    var hash = window.location.hash.replace('#', '') || 'home';
    navigateTo(hash, false);
});

// ============ 导航 ============
App.prototype._setupNavigation = function() {};

App.prototype._setupThemeToggle = function() {
    var toggle = document.getElementById('themeToggle');
    var saved = localStorage.getItem('datalens-theme');
    if (saved === 'dark') { document.documentElement.setAttribute('data-theme', 'dark'); toggle.innerHTML = '<i class="fas fa-sun"></i>'; }
    toggle.addEventListener('click', function() {
        var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        if (isDark) { document.documentElement.removeAttribute('data-theme'); toggle.innerHTML = '<i class="fas fa-moon"></i>'; localStorage.setItem('datalens-theme','light'); }
        else { document.documentElement.setAttribute('data-theme', 'dark'); toggle.innerHTML = '<i class="fas fa-sun"></i>'; localStorage.setItem('datalens-theme','dark'); }
    });
};

App.prototype._setupLangToggle = function() {
    var self = this;
    document.getElementById('langToggle').addEventListener('click', function() {
        self.i18n.toggle();
        self._refreshLanguage();
    });
};

App.prototype._setupMobileMenu = function() {
    var btn = document.getElementById('mobileMenuBtn');
    var nav = document.getElementById('mainNav');
    btn.addEventListener('click', function() { nav.classList.toggle('open'); btn.classList.toggle('active'); });
};

App.prototype._setupScrollEffects = function() {
    var header = document.getElementById('siteHeader');
    var backToTop = document.getElementById('backToTop');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) header.classList.add('scrolled'); else header.classList.remove('scrolled');
        if (window.scrollY > 500) backToTop.classList.add('visible'); else backToTop.classList.remove('visible');
    });
    backToTop.addEventListener('click', function() { window.scrollTo({ top: 0, behavior: 'smooth' }); });
};

App.prototype._setupSectionTabs = function() {
    document.body.addEventListener('click', function(e) {
        var btn = e.target.closest('.tab-btn');
        if (!btn) return;
        var section = btn.closest('.module-section');
        if (!section) return;
        var targetTab = btn.getAttribute('data-tab');
        section.querySelectorAll('.tab-btn').forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        section.querySelectorAll('.tab-panel').forEach(function(p) { p.classList.remove('active'); });
        var panel = section.querySelector('.tab-panel[data-panel="' + targetTab + '"]');
        if (panel) panel.classList.add('active');
    });
};

// ============ 数据加载 ============
App.prototype._setupDataLoading = function() {
    var self = this;
    var csvZone = document.getElementById('csv-upload-zone');
    var csvFile = document.getElementById('csv-file');
    csvZone.addEventListener('click', function() { csvFile.click(); });
    csvZone.addEventListener('dragover', function(e) { e.preventDefault(); csvZone.style.borderColor = 'var(--primary)'; });
    csvZone.addEventListener('dragleave', function() { csvZone.style.borderColor = ''; });
    csvZone.addEventListener('drop', function(e) { e.preventDefault(); csvZone.style.borderColor = ''; if (e.dataTransfer.files.length) self._loadCSVFile(e.dataTransfer.files[0]); });
    csvFile.addEventListener('change', function(e) { if (e.target.files.length) self._loadCSVFile(e.target.files[0]); });

    var jsonZone = document.getElementById('json-upload-zone');
    var jsonFile = document.getElementById('json-file');
    jsonZone.addEventListener('click', function() { jsonFile.click(); });
    jsonZone.addEventListener('dragover', function(e) { e.preventDefault(); jsonZone.style.borderColor = 'var(--primary)'; });
    jsonZone.addEventListener('dragleave', function() { jsonZone.style.borderColor = ''; });
    jsonZone.addEventListener('drop', function(e) { e.preventDefault(); jsonZone.style.borderColor = ''; if (e.dataTransfer.files.length) self._loadJSONFile(e.dataTransfer.files[0]); });
    jsonFile.addEventListener('change', function(e) { if (e.target.files.length) self._loadJSONFile(e.target.files[0]); });

    document.getElementById('btn-paste-load').addEventListener('click', function() {
        var text = document.getElementById('paste-data-input').value.trim();
        if (!text) { Utils.showToast(self.i18n.t('toast_no_parse'), 'warning'); return; }
        try {
            var data = (text.charAt(0)==='['||text.charAt(0)==='{') ? DataManager.parseJSON(text) : DataManager.parseCSV(text);
            self._onDataLoaded(data, 'pasted-data');
        } catch(e) { Utils.showToast(self.i18n.t('toast_error_load',{msg:self.i18n.error(e)}),'error'); }
    });

    document.getElementById('btn-load-default').addEventListener('click', function() { self._loadDefaultData(); });
    document.getElementById('btn-refresh-preview').addEventListener('click', function() { self._refreshPreview(); });
    document.getElementById('preview-rows').addEventListener('change', function() { self._refreshPreview(); });
    document.getElementById('preview-mode').addEventListener('change', function() { self._refreshPreview(); });
};

App.prototype._loadCSVFile = function(file) {
    var self = this; var reader = new FileReader();
    reader.onload = function(e) { try { self._onDataLoaded(DataManager.parseCSV(e.target.result), file.name); } catch(err) { Utils.showToast(self.i18n.t('toast_error_load',{msg:self.i18n.error(err)}),'error'); } };
    reader.readAsText(file);
};
App.prototype._loadJSONFile = function(file) {
    var self = this; var reader = new FileReader();
    reader.onload = function(e) { try { self._onDataLoaded(DataManager.parseJSON(e.target.result), file.name); } catch(err) { Utils.showToast(self.i18n.t('toast_error_load',{msg:self.i18n.error(err)}),'error'); } };
    reader.readAsText(file);
};
App.prototype._loadDefaultData = function() {
    var self = this;
    fetch('data/default.csv').then(function(r) { if (!r.ok) throw new Error('Not found'); return r.text(); })
    .then(function(csv) { self._onDataLoaded(DataManager.parseCSV(csv), 'default_cities.csv', true); })
    .catch(function(e) { Utils.showToast(self.i18n.t('toast_error_load',{msg:self.i18n.t('error_default_load')}),'error'); });
};

App.prototype._onDataLoaded = function(data, fileName, isDefault) {
    try {
        var info = this.dataManager.loadData(data, fileName);
        this.dataManager.isDefaultDataset = !!isDefault;
        this.tableRenders = {};
        this.outlierResult = null;
        this.advanced = new AdvancedAnalyzer(this.dataManager);
        Utils.showToast(this.i18n.t('toast_data_loaded',{rows:info.rows,cols:info.cols}),'success');
        document.getElementById('dataset-info').textContent = fileName + ' (' + info.rows + '×' + info.cols + ')';
        this._refreshPreview();
        this._updateAllSelects();
    } catch(e) { Utils.showToast(this.i18n.t('toast_error_load',{msg:this.i18n.error(e)}),'error'); }
};

// ============ 数据预览 ============
App.prototype._refreshPreview = function() {
    if (this.dataManager.workingData.length === 0) return;
    var rows = document.getElementById('preview-rows').value;
    var mode = document.getElementById('preview-mode').value;
    var n = rows === 'all' ? this.dataManager.workingData.length : parseInt(rows);
    var data;
    switch(mode) { case 'head': data=this.dataManager.head(n); break; case 'tail': data=this.dataManager.tail(n); break; case 'sample': data=this.dataManager.sample(n); break; default: data=this.dataManager.head(n); }
    this._renderTable('data-table-head','data-table-body',data,this.dataManager.columns);
    document.getElementById('table-footer').textContent = this.i18n.t('preview_summary', {shown:data.length, total:this.dataManager.workingData.length});
};

App.prototype._renderTable = function(headId, bodyId, data, columns) {
    var self = this;
    this.tableRenders = this.tableRenders || {};
    this.tableRenders[headId] = {bodyId:bodyId, data:data, columns:columns};
    var head = document.getElementById(headId); var body = document.getElementById(bodyId);
    head.innerHTML = '<tr>' + columns.map(function(c){return '<th>'+self.i18n.column(c, self.dataManager)+'</th>';}).join('') + '</tr>';
    body.innerHTML = data.map(function(row) {
        return '<tr>' + columns.map(function(col) {
            var val = row[col];
            var display = (val===null||val===undefined||val==='') ? '<span style="color:var(--text-muted);font-style:italic;">'+self.i18n.t('missing_value')+'</span>' : Utils.formatNumber(self.i18n.value(val, self.dataManager));
            return '<td title="'+(val!=null?String(self.i18n.value(val, self.dataManager)).replace(/"/g,'&quot;'):'')+'">'+display+'</td>';
        }).join('') + '</tr>';
    }).join('');
};

// ============ 概览 ============
App.prototype._setupOverview = function() {
    var self = this;
    document.getElementById('vc-column').addEventListener('change', function() { self._refreshValueCounts(); });
};

App.prototype._refreshOverview = function(languageOnly) {
    if (this.dataManager.workingData.length === 0) return;
    var info = this.dataManager.info(); var describe = this.dataManager.describe(); var self = this;
    document.getElementById('stat-rows').textContent = info.rows.toLocaleString();
    document.getElementById('stat-cols').textContent = info.cols;
    document.getElementById('stat-memory').textContent = Utils.formatBytes(info.memory);

    document.getElementById('dtypes-content').innerHTML = this.dataManager.columns.map(function(col) {
        var type = self.dataManager.dtypes[col]; var cls = type==='number'?'number':'string';
        return '<div class="dtype-item"><span>'+self.i18n.column(col, self.dataManager)+'</span><span class="dtype-badge '+cls+'">'+self.i18n.t('dtype_'+type)+'</span></div>';
    }).join('');

    var totalMissing = 0; Object.values(info.missing).forEach(function(v){totalMissing+=v;});
    var missingEl = document.getElementById('missing-content');
    if (totalMissing===0) { missingEl.innerHTML = '<p style="color:var(--sage);padding:0 var(--space-xl) var(--space-xl);">'+this.i18n.t('overview_no_missing')+'</p>'; }
    else { missingEl.innerHTML = this.dataManager.columns.filter(function(c){return info.missing[c]>0;}).map(function(col) {
        var pct = (info.missing[col]/info.rows*100).toFixed(1);
        return '<div class="missing-item"><span style="min-width:80px;">'+self.i18n.column(col, self.dataManager)+'</span><div class="missing-bar"><div class="missing-bar-fill" style="width:'+pct+'%"></div></div><span>'+info.missing[col]+' ('+pct+'%)</span></div>';
    }).join(''); }

    var descCols = Object.keys(describe);
    if (descCols.length>0) {
        var stats = ['count','mean','std','min','q1','median','q3','max'];
        var labels = stats.map(function(stat) { return self.i18n.t('stat_' + stat); });
        document.getElementById('describe-table-head').innerHTML = '<tr><th>'+this.i18n.t('statistic')+'</th>'+descCols.map(function(c){return '<th>'+self.i18n.column(c, self.dataManager)+'</th>';}).join('')+'</tr>';
        document.getElementById('describe-table-body').innerHTML = stats.map(function(s,i) {
            return '<tr><td><strong>'+labels[i]+'</strong></td>'+descCols.map(function(c){var v=describe[c]?describe[c][s]:undefined;return '<td>'+(v!==undefined?(typeof v==='number'?v.toFixed(2):v):'-')+'</td>';}).join('')+'</tr>';
        }).join('');
    }

    var vcColumn = document.getElementById('vc-column').value;
    this._populateSelect('vc-column', this.dataManager.columns);
    if (languageOnly) document.getElementById('vc-column').value = vcColumn;
    this._refreshValueCounts();
    if (!languageOnly && this.dataManager.getNumericColumns().length >= 2) this.visualizer.createCorrelationHeatmap('correlation-chart', this.dataManager);
};

App.prototype._refreshValueCounts = function() {
    var col = document.getElementById('vc-column').value; if (!col) return;
    var counts = this.dataManager.valueCounts(col); var self = this;
    document.getElementById('vc-table-body').innerHTML = counts.map(function(item) {
        return '<tr><td>'+self.i18n.value(item.value, self.dataManager)+'</td><td>'+item.count+'</td><td>'+item.percentage+'</td></tr>';
    }).join('');
};

// ============ 转换 ============
App.prototype._setupTransform = function() {
    var self = this;
    document.getElementById('btn-sort').addEventListener('click', function() {
        var col=document.getElementById('sort-column').value, order=document.getElementById('sort-order').value;
        if(!col) return;
        var r=self.dataManager.sortValues(col,order==='asc');
        self.dataManager.setWorkingData(r); self._refreshPreview(); self.transformResult=r; self._showTransformResult(r);
        Utils.showToast(self.i18n.t('toast_sort_applied'),'success');
    });
    document.getElementById('btn-filter').addEventListener('click', function() {
        var col=document.getElementById('filter-column').value, op=document.getElementById('filter-op').value, val=document.getElementById('filter-value').value;
        if(!col) return;
        var r=self.dataManager.query(col,op,val); self.transformResult=r; self._showTransformResult(r);
        Utils.showToast(self.i18n.t('toast_filter_applied',{count:r.length}),'success');
    });
    document.getElementById('btn-reset-filter').addEventListener('click', function() {
        self.dataManager.resetData(); self._refreshPreview(); self._updateAllSelects();
        document.getElementById('transform-results').style.display='none';
        Utils.showToast(self.i18n.t('toast_filter_reset'),'info');
    });
    document.getElementById('btn-groupby').addEventListener('click', function() {
        var gc=document.getElementById('groupby-column').value, vc=document.getElementById('groupby-value-column').value;
        var aggs=[]; document.querySelectorAll('#groupby-agg-group input:checked').forEach(function(cb){aggs.push(cb.value);});
        if(!gc||aggs.length===0) return;
        var r=self.dataManager.groupBy(gc,vc||null,aggs); self.transformResult=r; self._showTransformResult(r);
        Utils.showToast(self.i18n.t('toast_groupby_done'),'success');
    });
    document.getElementById('missing-method').addEventListener('change', function(e) {
        document.getElementById('fill-value-group').style.display = e.target.value==='fill_value'?'block':'none';
    });
    document.getElementById('btn-handle-missing').addEventListener('click', function() {
        var col=document.getElementById('missing-column').value, method=document.getElementById('missing-method').value, fv=document.getElementById('missing-fill-value').value;
        if(!col) return;
        var r=self.dataManager.handleMissing(col,method,fv);
        self.dataManager.setWorkingData(r); self._refreshPreview(); self._updateAllSelects();
        self.transformResult=r; self._showTransformResult(r);
        Utils.showToast(self.i18n.t('toast_missing_handled'),'success');
    });
    document.getElementById('col-action').addEventListener('change', function(e) {
        var a=e.target.value, g=document.getElementById('col-extra-group'), l=document.getElementById('col-extra-label');
        if(a==='rename'){g.style.display='block';l.textContent=self.i18n.t('transform_new_name');}
        else if(a==='convert'){g.style.display='block';l.textContent=self.i18n.t('transform_new_type');}
        else if(a==='add'){g.style.display='block';l.textContent=self.i18n.t('transform_expression');}
        else{g.style.display='none';}
    });
    document.getElementById('btn-col-op').addEventListener('click', function() {
        var action=document.getElementById('col-action').value, target=document.getElementById('col-target').value, extra=document.getElementById('col-extra-value').value;
        var r;
        switch(action){
            case 'drop': if(!target)return; r=self.dataManager.dropColumn(target); break;
            case 'rename': if(!target||!extra)return; r=self.dataManager.renameColumn(target,extra); break;
            case 'convert': if(!target||!extra)return; r=self.dataManager.convertType(target,extra); break;
            case 'add': if(!extra)return; r=self.dataManager.addComputedColumn(target||'new_col',extra); break;
        }
        if(r){self.dataManager.applyWorkingData(r);self._refreshPreview();self._updateAllSelects();self.transformResult=r;self._showTransformResult(r);Utils.showToast(self.i18n.t('toast_col_op_done'),'success');}
    });
    document.getElementById('btn-dedup').addEventListener('click', function() {
        var cols=[]; document.querySelectorAll('#dedup-columns input:checked').forEach(function(cb){cols.push(cb.value);});
        var c=cols.length>0?cols:self.dataManager.columns;
        var ol=self.dataManager.workingData.length, r=self.dataManager.dropDuplicates(c), rm=ol-r.length;
        self.dataManager.setWorkingData(r); self._refreshPreview(); self._updateAllSelects();
        self.transformResult=r; self._showTransformResult(r);
        Utils.showToast(self.i18n.t('toast_dedup_done',{count:rm}),'success');
    });
    document.getElementById('btn-apply-transform').addEventListener('click', function() {
        if(self.transformResult){self.dataManager.applyWorkingData(self.transformResult);self._refreshPreview();self._updateAllSelects();document.getElementById('transform-results').style.display='none';Utils.showToast(self.i18n.t('toast_applied'),'success');}
    });
};

App.prototype._showTransformResult = function(data) {
    document.getElementById('transform-results').style.display='block';
    var cols = data.length>0 ? Object.keys(data[0]) : [];
    this._renderTable('transform-table-head','transform-table-body',data.slice(0,20),cols);
};

// ============ 可视化 ============
App.prototype._setupVisualize = function() {
    var self = this;
    document.getElementById('btn-create-chart').addEventListener('click', function() {
        if(self.dataManager.workingData.length===0){Utils.showToast(self.i18n.t('toast_no_data'),'warning');return;}
        var xCol=document.getElementById('viz-x-col').value;
        if(!xCol){Utils.showToast(self.i18n.t('toast_select_x'),'warning');return;}
        self.visualizer.createChart(document.getElementById('chart-type').value, self.dataManager, {
            xCol:xCol, yCol:document.getElementById('viz-y-col').value,
            colorCol:document.getElementById('viz-color-col').value,
            title:document.getElementById('viz-title').value, theme:document.getElementById('viz-theme').value
        });
        Utils.showToast(self.i18n.t('toast_chart_created'),'success');
    });
};

App.prototype._refreshVizSelects = function() {
    this._populateSelect('viz-x-col',this.dataManager.columns,false);
    this._populateSelect('viz-y-col',this.dataManager.columns,true);
    this._populateSelect('viz-color-col',this.dataManager.columns,true);
};

// ============ 高级分析 ============
App.prototype._setupAdvanced = function() {
    var self = this;
    document.getElementById('btn-pivot').addEventListener('click', function() {
        if(!self.advanced) return;
        var i=document.getElementById('pivot-index').value, c=document.getElementById('pivot-columns').value, v=document.getElementById('pivot-values').value, a=document.getElementById('pivot-agg').value;
        if(!i||!c||!v){Utils.showToast(self.i18n.t('toast_select_fields'),'warning');return;}
        var r=self.advanced.pivotTable(i,c,v,a); self.advancedResult=r; self._showAdvancedResult(r);
        Utils.showToast(self.i18n.t('toast_pivot_done'),'success');
    });
    document.getElementById('btn-detect-outliers').addEventListener('click', function() {
        if(!self.advanced) return;
        var col=document.getElementById('outlier-column').value; if(!col) return;
        var r=self.advanced.detectOutliers(col);
        self.outlierResult = r;
        self._renderOutliers();
        Utils.showToast(self.i18n.t('toast_outlier_found',{count:r.outliers.length}),'info');
    });
    document.getElementById('btn-normalize').addEventListener('click', function() {
        if(!self.advanced) return;
        var col=document.getElementById('norm-column').value, m=document.getElementById('norm-method').value;
        if(!col) return;
        var r=self.advanced.normalize(col,m); self.dataManager.applyWorkingData(r); self._refreshPreview(); self._updateAllSelects();
        self.advancedResult=r; self._showAdvancedResult(r); Utils.showToast(self.i18n.t('toast_norm_done'),'success');
    });
    document.getElementById('btn-binning').addEventListener('click', function() {
        if(!self.advanced) return;
        var col=document.getElementById('bin-column').value, bins=parseInt(document.getElementById('bin-count').value), m=document.getElementById('bin-method').value;
        if(!col) return;
        var r=self.advanced.binning(col,bins,m); self.dataManager.applyWorkingData(r); self._refreshPreview(); self._updateAllSelects();
        self.advancedResult=r; self._showAdvancedResult(r); Utils.showToast(self.i18n.t('toast_bin_done'),'success');
    });
    document.getElementById('btn-rolling').addEventListener('click', function() {
        if(!self.advanced) return;
        var col=document.getElementById('rolling-column').value, w=parseInt(document.getElementById('rolling-window').value), s=document.getElementById('rolling-stat').value;
        if(!col) return;
        var r=self.advanced.rollingStats(col,w,s); self.dataManager.applyWorkingData(r); self._refreshPreview(); self._updateAllSelects();
        self.advancedResult=r; self._showAdvancedResult(r); Utils.showToast(self.i18n.t('toast_rolling_done'),'success');
    });
    document.getElementById('btn-crosstab').addEventListener('click', function() {
        if(!self.advanced) return;
        var rc=document.getElementById('crosstab-row').value, cc=document.getElementById('crosstab-col').value;
        if(!rc||!cc) return;
        var r=self.advanced.crosstab(rc,cc); self.advancedResult=r; self._showAdvancedResult(r);
        Utils.showToast(self.i18n.t('toast_crosstab_done'),'success');
    });
    document.getElementById('btn-apply-advanced').addEventListener('click', function() {
        if(self.advancedResult){self.dataManager.applyWorkingData(self.advancedResult);self._refreshPreview();self._updateAllSelects();document.getElementById('advanced-results').style.display='none';Utils.showToast(self.i18n.t('toast_applied'),'success');}
    });
};

App.prototype._showAdvancedResult = function(data) {
    document.getElementById('advanced-results').style.display='block';
    var cols = data.length>0 ? Object.keys(data[0]) : [];
    this._renderTable('advanced-table-head','advanced-table-body',data.slice(0,30),cols);
};

App.prototype._refreshAdvancedSelects = function() {
    var cols=this.dataManager.columns, numCols=this.dataManager.getNumericColumns(), strCols=this.dataManager.getStringColumns();
    var catCols = strCols.length>0 ? strCols : cols;
    this._populateSelect('pivot-index',catCols); this._populateSelect('pivot-columns',catCols);
    this._populateSelect('pivot-values',numCols.length>0?numCols:cols);
    this._populateSelect('outlier-column',numCols); this._populateSelect('norm-column',numCols);
    this._populateSelect('bin-column',numCols); this._populateSelect('rolling-column',numCols);
    this._populateSelect('crosstab-row',catCols); this._populateSelect('crosstab-col',catCols);
};

// ============ 导出 ============
App.prototype._setupExport = function() {
    var self = this;
    document.getElementById('btn-export-csv').addEventListener('click', function() {
        if(self.dataManager.workingData.length===0){Utils.showToast(self.i18n.t('toast_no_data'),'warning');return;}
        Utils.downloadFile(self.dataManager.toCSV(),'export_data.csv','text/csv;charset=utf-8;');
        Utils.showToast(self.i18n.t('toast_export_done'),'success');
    });
    document.getElementById('btn-export-json').addEventListener('click', function() {
        if(self.dataManager.workingData.length===0){Utils.showToast(self.i18n.t('toast_no_data'),'warning');return;}
        Utils.downloadFile(self.dataManager.toJSON(),'export_data.json','application/json');
        Utils.showToast(self.i18n.t('toast_export_done'),'success');
    });
    document.getElementById('btn-export-clipboard').addEventListener('click', function() {
        if(self.dataManager.workingData.length===0){Utils.showToast(self.i18n.t('toast_no_data'),'warning');return;}
        var tsv=self.dataManager.toTSV();
        if(navigator.clipboard){navigator.clipboard.writeText(tsv).then(function(){Utils.showToast(self.i18n.t('toast_copied'),'success');}).catch(function(){Utils.showToast(self.i18n.t('toast_copy_fail'),'error');});}
        else{var ta=document.createElement('textarea');ta.value=tsv;document.body.appendChild(ta);ta.select();document.execCommand('copy');document.body.removeChild(ta);Utils.showToast(self.i18n.t('toast_copied'),'success');}
    });
    document.getElementById('btn-export-html').addEventListener('click', function() {
        if(self.dataManager.workingData.length===0){Utils.showToast(self.i18n.t('toast_no_data'),'warning');return;}
        Utils.downloadFile(self.dataManager.toHTML(),'export_table.html','text/html');
        Utils.showToast(self.i18n.t('toast_export_done'),'success');
    });
};

App.prototype._refreshExportPreview = function() {
    if(this.dataManager.workingData.length===0) return;
    this._renderTable('export-table-head','export-table-body',this.dataManager.head(10),this.dataManager.columns);
};

// ============ 工具 ============
App.prototype._updateAllSelects = function() {
    var cols=this.dataManager.columns, numCols=this.dataManager.getNumericColumns(), strCols=this.dataManager.getStringColumns();
    this._populateSelect('sort-column',cols); this._populateSelect('filter-column',cols);
    this._populateSelect('groupby-column',strCols.length>0?strCols:cols);
    this._populateSelect('groupby-value-column',numCols.length>0?numCols:cols);
    this._populateSelect('missing-column',cols); this._populateSelect('col-target',cols);
    var self = this;
    var dc=document.getElementById('dedup-columns');
    dc.innerHTML=cols.map(function(c){return '<label><input type="checkbox" value="'+c+'"> '+self.i18n.column(c, self.dataManager)+'</label>';}).join('');
    this._refreshVizSelects(); this._refreshAdvancedSelects();
};

App.prototype._populateSelect = function(id, options, addNone) {
    var el=document.getElementById(id); if(!el) return;
    var self = this;
    var html=''; if(addNone) html+='<option value="">'+this.i18n.t('viz_none')+'</option>';
    html+=options.map(function(o){return '<option value="'+o+'">'+self.i18n.column(o, self.dataManager)+'</option>';}).join('');
    el.innerHTML=html;
};

App.prototype._updateTime = function() {
    var el=document.getElementById('status-time'); if(el) el.textContent=new Date().toLocaleTimeString();
};

document.addEventListener('DOMContentLoaded', function() { window.app = new App(); });
App.prototype._renderOutliers = function() {
    if (!this.outlierResult) return;
    var r = this.outlierResult, div = document.getElementById('outlier-results');
    div.style.display = 'block';
    div.innerHTML = '<div style="background:var(--bg-tertiary);padding:14px;border-radius:var(--radius-sm);font-size:0.85rem;">'+
        '<p><strong>'+this.i18n.t('outlier_lower')+':</strong> '+r.bounds.lower.toFixed(2)+'</p>'+
        '<p><strong>'+this.i18n.t('outlier_upper')+':</strong> '+r.bounds.upper.toFixed(2)+'</p>'+
        '<p><strong>'+this.i18n.t('outlier_count')+':</strong> <span style="color:var(--primary);font-weight:700;">'+r.outliers.length+'</span></p>'+
        (r.outliers.length>0?'<p><strong>'+this.i18n.t('outlier_values')+':</strong> '+r.outliers.slice(0,10).join(', ')+(r.outliers.length>10?'...':'')+'</p>':'')+'</div>';
};
App.prototype._refreshDatasetLabel = function() {
    var dm = this.dataManager, name = dm.fileName;
    if (dm.isDefaultDataset) name = this.i18n.t('dataset_default');
    else if (name === 'pasted-data') name = this.i18n.t('dataset_pasted');
    document.getElementById('dataset-info').textContent = name + ' (' + dm.workingData.length + '?' + dm.columns.length + ')';
};
App.prototype._refreshLanguage = function() {
    var self = this;
    // Reuse rendered rows so changing language never resamples or reruns analysis.
    Object.entries(this.tableRenders || {}).forEach(function(entry) {
        self._renderTable(entry[0], entry[1].bodyId, entry[1].data, entry[1].columns);
    });
    document.querySelectorAll('select').forEach(function(select) {
        Array.from(select.options).forEach(function(option) {
            if (!option.hasAttribute('data-i18n') && option.value) option.textContent = self.i18n.column(option.value, self.dataManager);
            else if (select.id.startsWith('viz-') && option.value === '') option.textContent = self.i18n.t('viz_none');
        });
    });
    document.querySelectorAll('#dedup-columns label').forEach(function(label) {
        var input = label.querySelector('input');
        label.lastChild.textContent = ' ' + self.i18n.column(input.value, self.dataManager);
    });
    document.getElementById('col-action').dispatchEvent(new Event('change'));
    this._renderOutliers();
    if (this.dataManager.workingData.length) {
        this._refreshDatasetLabel();
        var preview = (this.tableRenders || {})['data-table-head'];
        if (preview) document.getElementById('table-footer').textContent = this.i18n.t('preview_summary', {shown:preview.data.length, total:this.dataManager.workingData.length});
        this._refreshOverview(true);
    }
    this.visualizer.refreshLanguage();
};
