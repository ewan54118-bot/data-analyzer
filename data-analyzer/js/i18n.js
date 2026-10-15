const I18N = {
    zh: {
        page_title: "DataLens - 智能数据分析平台",
        nav_home: "首页", nav_data: "数据管理", nav_overview: "数据概览", nav_transform: "数据转换",
        nav_visualize: "可视化", nav_advanced: "高级分析", nav_export: "导出",
        nav_data_short: "数据", nav_overview_short: "概览", nav_transform_short: "转换",
        nav_viz_short: "可视化", nav_advanced_short: "高级", nav_export_short: "导出",
        hero_badge: "智能数据分析", hero_prefix: "用浏览器实现", hero_highlight: "Pandas 数据分析",
        hero_subtitle: "从数据加载到统计分析，从数据转换到可视化呈现 —— 全面复刻 Python Pandas 核心功能，通过交互式操作深入理解每一种数据分析方法的原理与实践。支持中英双语，明暗双主题。",
        stat_pandas_ops: "Pandas 操作", stat_chart_types: "图表类型", stat_export_formats: "导出格式",
        btn_start: "开始分析", scroll_down: "向下滚动",
        dir_title: "功能模块总览", dir_subtitle: "点击任意卡片，进入对应功能模块的详细操作与交互演示",
        dir_enter: "进入模块",
        dir_data_title: "数据加载与管理", dir_data_desc: "支持 CSV / JSON 上传、粘贴解析、默认数据集，前部 / 尾部 / 随机采样预览。",
        dir_overview_title: "数据概览", dir_overview_desc: "info()、describe()、dtypes、value_counts()、corr() 全方位统计。",
        dir_transform_title: "数据转换", dir_transform_desc: "排序、筛选、分组聚合、缺失值处理、列操作、去重等强大功能。",
        dir_viz_title: "数据可视化", dir_viz_desc: "9 种图表类型 + 5 种配色方案，交互式 ECharts 可视化分析。",
        dir_advanced_title: "高级分析", dir_advanced_desc: "透视表、异常检测、数据标准化、分箱、滚动统计、交叉表。",
        dir_export_title: "数据导出", dir_export_desc: "CSV / JSON / TSV 剪贴板 / HTML 表格四种格式导出。",
        summary_title: "Pandas 操作对照表", summary_subtitle: "DataLens 完整复刻了 Pandas 的核心数据分析功能",
        table_category: "类别", table_module: "所属模块",
        cat_load: "数据加载", cat_preview: "数据预览", cat_info: "信息统计", cat_sort: "排序筛选",
        cat_group: "分组聚合", cat_missing: "缺失值", cat_viz: "可视化", cat_export: "数据导出",
        dl_load: "CSV/JSON 上传 + 粘贴解析", dl_preview: "前部 / 尾部 / 随机采样预览",
        dl_info: "维度/类型/内存/描述统计", dl_sort: "多列排序 + 条件筛选",
        dl_group: "7 种聚合函数分组", dl_missing: "7 种缺失值处理方法",
        dl_viz: "9 种交互式图表", dl_export: "4 种格式导出",
        mod_data: "数据管理", mod_overview: "数据概览", mod_transform: "数据转换",
        mod_viz: "可视化", mod_export: "导出",
        tab_load: "数据加载", tab_preview: "数据预览",
        preview_header: "数据预览",
        data_upload_csv: "上传 CSV 文件", data_drop_csv: "拖拽 CSV 文件到此处或点击选择",
        data_upload_json: "上传 JSON 文件", data_drop_json: "拖拽 JSON 文件到此处或点击选择",
        data_paste: "粘贴数据", data_paste_placeholder: "在此粘贴 CSV 或 JSON 数据...",
        data_btn_parse: "解析数据",
        data_default: "使用默认数据集", data_default_desc: "全球 30 个主要城市的多维度数据集（人口、GDP、气温等 12 个字段）",
        data_btn_load_default: "加载默认数据",
        data_show_all: "显示全部", data_sample: "随机采样", data_refresh: "刷新",
        sec_data_title: "数据加载与管理", sec_data_sub: "支持 CSV、JSON 文件上传，粘贴数据，或使用默认示例数据集",
        sec_overview_title: "数据概览", sec_overview_sub: "全面的数据统计信息，类似 pandas 的 info() 和 describe()",
        overview_shape: "数据维度", overview_rows: "行数", overview_cols: "列数", overview_memory: "内存占用",
        overview_dtypes: "数据类型 (dtypes)", overview_missing: "缺失值统计",
        overview_describe: "统计描述 (describe)", overview_value_counts: "值计数 (value_counts)",
        overview_value: "值", overview_count: "计数", overview_percentage: "百分比",
        overview_correlation: "相关性矩阵 (corr)", overview_no_missing: "✅ 无缺失值",
        sec_transform_title: "数据转换", sec_transform_sub: "强大的数据操作功能：排序、筛选、分组、缺失值处理等",
        transform_sort: "排序 (sort_values)", transform_sort_by: "排序列", transform_sort_order: "排序方式",
        transform_ascending: "升序", transform_descending: "降序", transform_apply_sort: "应用排序",
        transform_filter: "筛选 (query)", transform_filter_col: "筛选列", transform_filter_op: "操作符",
        transform_filter_val: "筛选值", transform_contains: "包含", transform_not_contains: "不包含",
        transform_apply_filter: "应用筛选", transform_reset_filter: "重置筛选",
        transform_groupby: "分组聚合 (groupby)", transform_groupby_col: "分组列",
        transform_groupby_val: "聚合列", transform_groupby_agg: "聚合方式", transform_apply_groupby: "执行分组",
        transform_missing: "缺失值处理", transform_missing_col: "目标列", transform_missing_method: "处理方法",
        transform_dropna: "删除缺失行", transform_fill_mean: "填充均值", transform_fill_median: "填充中位数",
        transform_fill_mode: "填充众数", transform_fill_value: "填充自定义值",
        transform_fill_ffill: "前向填充 (ffill)", transform_fill_bfill: "后向填充 (bfill)",
        transform_custom_value: "自定义值", transform_apply_missing: "处理缺失值",
        transform_col_ops: "列操作", transform_col_action: "操作",
        transform_drop_col: "删除列", transform_rename_col: "重命名列",
        transform_convert_type: "转换类型", transform_add_col: "添加计算列",
        transform_target_col: "目标列", transform_apply_col_op: "应用操作",
        transform_dedup: "去重 (drop_duplicates)", transform_dedup_cols: "去重列（多选）", transform_apply_dedup: "执行去重",
        transform_results: "操作结果", transform_apply_to_main: "应用到主数据集",
        transform_new_name: "新名称", transform_new_type: "新类型 (number/string)",
        transform_expression: "表达式 (如: col1 + col2)",
        sec_viz_title: "数据可视化", sec_viz_sub: "丰富的图表类型，交互式可视化分析",
        viz_chart_type: "图表类型", viz_bar: "柱状图", viz_line: "折线图", viz_scatter: "散点图",
        viz_pie: "饼图", viz_histogram: "直方图", viz_box: "箱线图", viz_heatmap: "热力图",
        viz_radar: "雷达图", viz_funnel: "漏斗图",
        viz_x_axis: "X 轴", viz_y_axis: "Y 轴", viz_color_by: "颜色分组", viz_none: "无",
        viz_title_input: "图表标题", viz_color_theme: "配色方案", viz_theme_default: "默认", viz_create: "生成图表",
        sec_advanced_title: "高级分析", sec_advanced_sub: "专业级数据分析功能：透视表、异常检测、标准化等",
        advanced_pivot: "数据透视表 (pivot_table)", advanced_pivot_index: "行索引",
        advanced_pivot_columns: "列", advanced_pivot_values: "值", advanced_pivot_agg: "聚合函数",
        advanced_apply_pivot: "生成透视表",
        advanced_outliers: "异常值检测 (IQR)", advanced_outlier_col: "目标列", advanced_detect_outliers: "检测异常值",
        advanced_normalize: "数据标准化", advanced_norm_col: "目标列", advanced_norm_method: "标准化方法",
        advanced_apply_norm: "应用标准化",
        advanced_binning: "数据分箱", advanced_bin_col: "目标列", advanced_bin_count: "分箱数量",
        advanced_bin_method: "分箱方法", advanced_bin_width: "等宽分箱", advanced_bin_freq: "等频分箱",
        advanced_apply_binning: "应用分箱",
        advanced_rolling: "滚动统计 (rolling)", advanced_rolling_col: "目标列",
        advanced_rolling_window: "窗口大小", advanced_rolling_stat: "统计方法", advanced_apply_rolling: "应用滚动统计",
        advanced_crosstab: "交叉表 (crosstab)", advanced_crosstab_row: "行", advanced_crosstab_col: "列",
        advanced_apply_crosstab: "生成交叉表", advanced_results: "分析结果",
        sec_export_title: "数据导出", sec_export_sub: "将处理后的数据导出为多种格式",
        export_csv_desc: "逗号分隔值文件，兼容 Excel 等软件", export_json_desc: "JSON 格式，适用于 Web 应用",
        export_clipboard: "剪贴板", export_clipboard_desc: "复制 TSV 格式到剪贴板",
        export_html_desc: "导出为 HTML 表格代码",
        export_download: "下载", export_copy: "复制", export_preview: "导出数据预览",
        footer_desc: "智能数据分析平台 — 浏览器中的 Pandas",
        footer_copyright: "© 2025 DataLens Pro. 智能数据分析平台",
        toast_data_loaded: "数据加载成功！共 {rows} 行 × {cols} 列",
        toast_error_load: "数据加载失败: {msg}",
        toast_sort_applied: "排序已应用", toast_filter_applied: "筛选完成，共 {count} 条结果",
        toast_filter_reset: "筛选已重置", toast_groupby_done: "分组聚合完成",
        toast_missing_handled: "缺失值处理完成", toast_col_op_done: "列操作完成",
        toast_dedup_done: "去重完成，移除 {count} 行重复数据",
        toast_export_done: "数据导出成功", toast_copied: "已复制到剪贴板",
        toast_chart_created: "图表已生成", toast_no_data: "请先加载数据",
        toast_applied: "已应用到主数据集", toast_pivot_done: "透视表已生成",
        toast_outlier_found: "发现 {count} 个异常值",
        toast_norm_done: "标准化已应用", toast_bin_done: "分箱已应用",
        toast_rolling_done: "滚动统计已应用", toast_crosstab_done: "交叉表已生成",
        toast_select_x: "请选择 X 轴列", toast_no_parse: "没有可解析的数据",
        toast_select_fields: "请填写所有必要字段", toast_copy_fail: "复制失败",
    },
    en: {
        page_title: "DataLens - Smart Data Analysis Platform",
        nav_home: "Home", nav_data: "Data", nav_overview: "Overview", nav_transform: "Transform",
        nav_visualize: "Visualize", nav_advanced: "Advanced", nav_export: "Export",
        nav_data_short: "Data", nav_overview_short: "Overview", nav_transform_short: "Transform",
        nav_viz_short: "Visualize", nav_advanced_short: "Advanced", nav_export_short: "Export",
        hero_badge: "Smart Data Analysis", hero_prefix: "Pandas Data Analysis", hero_highlight: "in Your Browser",
        hero_subtitle: "From data loading to statistical analysis, from data transformation to visualization — fully replicating Python Pandas core features with interactive operations to understand the principles and practice of each analysis method. Supports Chinese/English and light/dark themes.",
        stat_pandas_ops: "Pandas Operations", stat_chart_types: "Chart Types", stat_export_formats: "Export Formats",
        btn_start: "Start Analysis", scroll_down: "Scroll Down",
        dir_title: "Feature Modules", dir_subtitle: "Click any card to enter the detailed operations and interactive demos",
        dir_enter: "Enter Module",
        dir_data_title: "Data Loading & Management", dir_data_desc: "CSV/JSON upload, paste parsing, default dataset, Head/Tail/Sample preview.",
        dir_overview_title: "Data Overview", dir_overview_desc: "info(), describe(), dtypes, value_counts(), corr() comprehensive statistics.",
        dir_transform_title: "Data Transformation", dir_transform_desc: "Sort, filter, groupby, missing value handling, column ops, dedup.",
        dir_viz_title: "Data Visualization", dir_viz_desc: "9 chart types + 5 color themes, interactive ECharts visualization.",
        dir_advanced_title: "Advanced Analysis", dir_advanced_desc: "Pivot tables, outlier detection, normalization, binning, rolling statistics, and crosstabs.",
        dir_export_title: "Data Export", dir_export_desc: "CSV / JSON / TSV clipboard / HTML Table — 4 export formats.",
        summary_title: "Pandas Operation Reference", summary_subtitle: "DataLens fully replicates Pandas core data analysis features",
        table_category: "Category", table_module: "Module",
        cat_load: "Data Loading", cat_preview: "Data Preview", cat_info: "Info & Stats", cat_sort: "Sort & Filter",
        cat_group: "GroupBy", cat_missing: "Missing Values", cat_viz: "Visualization", cat_export: "Export",
        dl_load: "CSV/JSON upload + paste", dl_preview: "Head / Tail / Sample",
        dl_info: "Shape/dtypes/memory/describe", dl_sort: "Multi-column sort + conditional filter",
        dl_group: "7 aggregation functions", dl_missing: "7 missing value methods",
        dl_viz: "9 interactive chart types", dl_export: "4 export formats",
        mod_data: "Data", mod_overview: "Overview", mod_transform: "Transform",
        mod_viz: "Visualize", mod_export: "Export",
        tab_load: "Load Data", tab_preview: "Preview",
        preview_header: "Data Preview",
        data_upload_csv: "Upload CSV File", data_drop_csv: "Drag & drop CSV file here or click to select",
        data_upload_json: "Upload JSON File", data_drop_json: "Drag & drop JSON file here or click to select",
        data_paste: "Paste Data", data_paste_placeholder: "Paste CSV or JSON data here...",
        data_btn_parse: "Parse Data",
        data_default: "Use Default Dataset", data_default_desc: "Multi-dimensional dataset of 30 global cities (12 fields: population, GDP, temperature, etc.)",
        data_btn_load_default: "Load Default Data",
        data_show_all: "Show All", data_sample: "Random Sample", data_refresh: "Refresh",
        sec_data_title: "Data Loading & Management", sec_data_sub: "Upload CSV/JSON, paste data, or use the default dataset",
        sec_overview_title: "Data Overview", sec_overview_sub: "Comprehensive statistics, similar to pandas info() and describe()",
        overview_shape: "Data Shape", overview_rows: "Rows", overview_cols: "Columns", overview_memory: "Memory",
        overview_dtypes: "Data Types (dtypes)", overview_missing: "Missing Values",
        overview_describe: "Statistical Description (describe)", overview_value_counts: "Value Counts (value_counts)",
        overview_value: "Value", overview_count: "Count", overview_percentage: "Percentage",
        overview_correlation: "Correlation Matrix (corr)", overview_no_missing: "✅ No missing values",
        sec_transform_title: "Data Transformation", sec_transform_sub: "Powerful operations: sort, filter, groupby, missing value handling, etc.",
        transform_sort: "Sort (sort_values)", transform_sort_by: "Sort By", transform_sort_order: "Order",
        transform_ascending: "Ascending", transform_descending: "Descending", transform_apply_sort: "Apply Sort",
        transform_filter: "Filter (query)", transform_filter_col: "Filter Column", transform_filter_op: "Operator",
        transform_filter_val: "Filter Value", transform_contains: "Contains", transform_not_contains: "Not Contains",
        transform_apply_filter: "Apply Filter", transform_reset_filter: "Reset Filter",
        transform_groupby: "GroupBy (groupby)", transform_groupby_col: "Group By",
        transform_groupby_val: "Aggregate Column", transform_groupby_agg: "Aggregation", transform_apply_groupby: "Apply",
        transform_missing: "Missing Values", transform_missing_col: "Target Column", transform_missing_method: "Method",
        transform_dropna: "Drop NaN rows", transform_fill_mean: "Fill with Mean", transform_fill_median: "Fill with Median",
        transform_fill_mode: "Fill with Mode", transform_fill_value: "Fill Custom Value",
        transform_fill_ffill: "Forward Fill (ffill)", transform_fill_bfill: "Backward Fill (bfill)",
        transform_custom_value: "Custom Value", transform_apply_missing: "Handle Missing",
        transform_col_ops: "Column Ops", transform_col_action: "Action",
        transform_drop_col: "Drop Column", transform_rename_col: "Rename",
        transform_convert_type: "Convert Type", transform_add_col: "Add Computed Column",
        transform_target_col: "Target Column", transform_apply_col_op: "Apply",
        transform_dedup: "Dedup (drop_duplicates)", transform_dedup_cols: "Dedup Columns", transform_apply_dedup: "Apply Dedup",
        transform_results: "Results", transform_apply_to_main: "Apply to Main Dataset",
        transform_new_name: "New Name", transform_new_type: "New Type (number/string)",
        transform_expression: "Expression (e.g.: col1 + col2)",
        sec_viz_title: "Data Visualization", sec_viz_sub: "Rich chart types with interactive visual analysis",
        viz_chart_type: "Chart Type", viz_bar: "Bar", viz_line: "Line", viz_scatter: "Scatter",
        viz_pie: "Pie", viz_histogram: "Histogram", viz_box: "Box Plot", viz_heatmap: "Heatmap",
        viz_radar: "Radar", viz_funnel: "Funnel",
        viz_x_axis: "X Axis", viz_y_axis: "Y Axis", viz_color_by: "Color By", viz_none: "None",
        viz_title_input: "Chart Title", viz_color_theme: "Color Theme", viz_theme_default: "Default", viz_create: "Create Chart",
        sec_advanced_title: "Advanced Analysis", sec_advanced_sub: "Professional analysis: pivot tables, outlier detection, normalization, etc.",
        advanced_pivot: "Pivot Table (pivot_table)", advanced_pivot_index: "Row Index",
        advanced_pivot_columns: "Columns", advanced_pivot_values: "Values", advanced_pivot_agg: "Aggregation",
        advanced_apply_pivot: "Create Pivot",
        advanced_outliers: "Outlier Detection (IQR)", advanced_outlier_col: "Target Column", advanced_detect_outliers: "Detect",
        advanced_normalize: "Normalization", advanced_norm_col: "Target Column", advanced_norm_method: "Method",
        advanced_apply_norm: "Apply",
        advanced_binning: "Binning", advanced_bin_col: "Target Column", advanced_bin_count: "Bins",
        advanced_bin_method: "Method", advanced_bin_width: "Equal Width", advanced_bin_freq: "Equal Frequency",
        advanced_apply_binning: "Apply Binning",
        advanced_rolling: "Rolling Stats (rolling)", advanced_rolling_col: "Target Column",
        advanced_rolling_window: "Window Size", advanced_rolling_stat: "Statistic", advanced_apply_rolling: "Apply",
        advanced_crosstab: "Crosstab (crosstab)", advanced_crosstab_row: "Row", advanced_crosstab_col: "Column",
        advanced_apply_crosstab: "Create", advanced_results: "Results",
        sec_export_title: "Data Export", sec_export_sub: "Export processed data in various formats",
        export_csv_desc: "CSV file, compatible with Excel", export_json_desc: "JSON format, for web apps",
        export_clipboard: "Clipboard", export_clipboard_desc: "Copy TSV to clipboard",
        export_html_desc: "Export as HTML table code",
        export_download: "Download", export_copy: "Copy", export_preview: "Export Preview",
        footer_desc: "Smart Data Analysis Platform — Pandas in Your Browser",
        footer_copyright: "© 2025 DataLens Pro. Smart Data Analysis Platform",
        toast_data_loaded: "Data loaded! {rows} rows × {cols} columns",
        toast_error_load: "Failed to load: {msg}",
        toast_sort_applied: "Sort applied", toast_filter_applied: "Filter applied, {count} results",
        toast_filter_reset: "Filter reset", toast_groupby_done: "GroupBy completed",
        toast_missing_handled: "Missing values handled", toast_col_op_done: "Column operation done",
        toast_dedup_done: "Dedup done, removed {count} rows",
        toast_export_done: "Export successful", toast_copied: "Copied to clipboard",
        toast_chart_created: "Chart created", toast_no_data: "Please load data first",
        toast_applied: "Applied to main dataset", toast_pivot_done: "Pivot table created",
        toast_outlier_found: "Found {count} outliers",
        toast_norm_done: "Normalization applied", toast_bin_done: "Binning applied",
        toast_rolling_done: "Rolling stats applied", toast_crosstab_done: "Crosstab created",
        toast_select_x: "Please select X axis", toast_no_parse: "No data to parse",
        toast_select_fields: "Fill in all required fields", toast_copy_fail: "Copy failed",
    }
};


// Every interface message has matching Chinese and English entries.
Object.assign(I18N.zh, {
    "loading_text": "正在加载 DataLens…",
    "switch_language": "切换语言",
    "toggle_theme": "切换主题",
    "menu": "菜单",
    "back_to_top": "返回顶部",
    "preview_head": "前部数据",
    "preview_tail": "尾部数据",
    "preview_5": "5 行",
    "preview_10": "10 行",
    "preview_20": "20 行",
    "preview_50": "50 行",
    "preview_summary": "显示 {shown} 行，共 {total} 行",
    "statistic": "统计项",
    "stat_count": "计数",
    "stat_sum": "总和",
    "stat_mean": "均值",
    "stat_std": "标准差",
    "stat_min": "最小值",
    "stat_max": "最大值",
    "stat_median": "中位数",
    "stat_q1": "第一四分位数（25%）",
    "stat_q3": "第三四分位数（75%）",
    "dtype_number": "数值",
    "dtype_string": "文本",
    "dtype_object": "对象",
    "missing_value": "缺失值",
    "viz_title_placeholder": "我的图表",
    "viz_theme_vintage": "复古",
    "viz_theme_dark": "深色",
    "viz_theme_ocean": "海洋",
    "viz_theme_forest": "森林",
    "chart_bar": "柱状图",
    "chart_line": "折线图",
    "chart_scatter": "散点图",
    "chart_pie": "饼图",
    "chart_histogram": "{column}的直方图",
    "chart_box": "箱线图",
    "chart_heatmap": "相关性热力图",
    "chart_radar": "雷达图",
    "chart_funnel": "漏斗图",
    "chart_no_data": "暂无数据",
    "chart_frequency": "频数",
    "chart_correlation": "相关系数",
    "outlier_lower": "下界",
    "outlier_upper": "上界",
    "outlier_count": "异常值数量",
    "outlier_values": "异常值",
    "advanced_minmax": "最小—最大值缩放",
    "advanced_zscore": "标准分数标准化",
    "column_normalized": "{column}（归一化）",
    "column_zscore": "{column}（标准分数）",
    "column_bin": "{column}（分箱）",
    "column_rolling": "{column}（滚动{statistic}）",
    "export_html_title": "HTML 表格",
    "error_empty_dataset": "数据集为空",
    "error_invalid_json": "JSON 格式无效，请检查数据格式",
    "error_csv_quotes": "CSV 引号格式无效",
    "error_csv_delimiter": "无法识别 CSV 分隔符",
    "error_csv_fields": "CSV 字段数量与表头不一致",
    "error_csv": "CSV 解析失败，请检查数据格式",
    "error_default_load": "请通过本地服务器（如 Live Server）打开页面以加载默认数据",
    "dataset_pasted": "粘贴的数据",
    "dataset_default": "默认城市数据集"
});
Object.assign(I18N.en, {
    "loading_text": "Loading DataLens…",
    "switch_language": "Switch Language",
    "toggle_theme": "Toggle Theme",
    "menu": "Menu",
    "back_to_top": "Back to Top",
    "preview_head": "Head",
    "preview_tail": "Tail",
    "preview_5": "5 rows",
    "preview_10": "10 rows",
    "preview_20": "20 rows",
    "preview_50": "50 rows",
    "preview_summary": "Showing {shown} of {total} rows",
    "statistic": "Statistic",
    "stat_count": "Count",
    "stat_sum": "Sum",
    "stat_mean": "Mean",
    "stat_std": "Std",
    "stat_min": "Min",
    "stat_max": "Max",
    "stat_median": "Median",
    "stat_q1": "First quartile (25%)",
    "stat_q3": "Third quartile (75%)",
    "dtype_number": "Number",
    "dtype_string": "String",
    "dtype_object": "Object",
    "missing_value": "Missing value",
    "viz_title_placeholder": "My Chart",
    "viz_theme_vintage": "Vintage",
    "viz_theme_dark": "Dark",
    "viz_theme_ocean": "Ocean",
    "viz_theme_forest": "Forest",
    "chart_bar": "Bar Chart",
    "chart_line": "Line Chart",
    "chart_scatter": "Scatter Plot",
    "chart_pie": "Pie Chart",
    "chart_histogram": "Histogram of {column}",
    "chart_box": "Box Plot",
    "chart_heatmap": "Correlation Heatmap",
    "chart_radar": "Radar Chart",
    "chart_funnel": "Funnel Chart",
    "chart_no_data": "No data",
    "chart_frequency": "Frequency",
    "chart_correlation": "Correlation coefficient",
    "outlier_lower": "Lower",
    "outlier_upper": "Upper",
    "outlier_count": "Outliers",
    "outlier_values": "Values",
    "advanced_minmax": "Min-Max Scaling",
    "advanced_zscore": "Z-Score Normalization",
    "column_normalized": "{column} (normalized)",
    "column_zscore": "{column} (Z-score)",
    "column_bin": "{column} (bin)",
    "column_rolling": "{column} (rolling {statistic})",
    "export_html_title": "HTML Table",
    "error_empty_dataset": "Empty dataset",
    "error_invalid_json": "Invalid JSON format; please check the data format",
    "error_csv_quotes": "Invalid CSV quoting",
    "error_csv_delimiter": "Unable to detect the CSV delimiter",
    "error_csv_fields": "CSV field count does not match the header",
    "error_csv": "Failed to parse CSV; please check the data format",
    "error_default_load": "Open the page through a local server (such as Live Server) to load default data",
    "dataset_pasted": "Pasted data",
    "dataset_default": "Default cities dataset"
});
const DEFAULT_COLUMN_LABELS = {"City":"城市","Country":"国家","Continent":"大洲","Population":"人口","Area_km2":"面积（平方千米）","GDP_Billion_USD":"国内生产总值（十亿美元）","Avg_Temperature_C":"平均气温（℃）","Annual_Rainfall_mm":"年降雨量（毫米）","Tourism_Index":"旅游指数","Cost_of_Living_Index":"生活成本指数","Internet_Speed_Mbps":"网速（兆比特/秒）","Life_Expectancy":"预期寿命（年）"};
const DEFAULT_VALUE_LABELS = {"Tokyo":"东京","London":"伦敦","New York":"纽约","Paris":"巴黎","Sydney":"悉尼","Singapore":"新加坡","Dubai":"迪拜","Berlin":"柏林","Toronto":"多伦多","Shanghai":"上海","Mumbai":"孟买","Sao Paulo":"圣保罗","Cairo":"开罗","Mexico City":"墨西哥城","Moscow":"莫斯科","Seoul":"首尔","Bangkok":"曼谷","Istanbul":"伊斯坦布尔","Lagos":"拉各斯","Buenos Aires":"布宜诺斯艾利斯","Stockholm":"斯德哥尔摩","Amsterdam":"阿姆斯特丹","Zurich":"苏黎世","Vienna":"维也纳","Helsinki":"赫尔辛基","Johannesburg":"约翰内斯堡","Nairobi":"内罗毕","Lima":"利马","Hanoi":"河内","Kuala Lumpur":"吉隆坡","Japan":"日本","UK":"英国","USA":"美国","France":"法国","Australia":"澳大利亚","UAE":"阿联酋","Germany":"德国","Canada":"加拿大","China":"中国","India":"印度","Brazil":"巴西","Egypt":"埃及","Mexico":"墨西哥","Russia":"俄罗斯","South Korea":"韩国","Thailand":"泰国","Turkey":"土耳其","Nigeria":"尼日利亚","Argentina":"阿根廷","Sweden":"瑞典","Netherlands":"荷兰","Switzerland":"瑞士","Austria":"奥地利","Finland":"芬兰","South Africa":"南非","Kenya":"肯尼亚","Peru":"秘鲁","Vietnam":"越南","Malaysia":"马来西亚","Asia":"亚洲","Europe":"欧洲","North America":"北美洲","Oceania":"大洋洲","South America":"南美洲","Africa":"非洲"};

class I18nManager {
    constructor() { this.currentLang = localStorage.getItem('datalens-lang') === 'en' ? 'en' : 'zh'; }
    t(key, params) {
        if (!params) params = {};
        var text = I18N[this.currentLang]?.[key] || I18N['en']?.[key] || key;
        Object.keys(params).forEach(function(p) { text = text.split('{'+p+'}').join(params[p]); });
        this.lastMessage = {key:key, params:Object.assign({}, params), text:text};
        return text;
    }
    applyTranslations() {
        var lang = this.currentLang;
        document.querySelectorAll('[data-i18n]').forEach(function(el) {
            var key = el.getAttribute('data-i18n');
            if (I18N[lang]?.[key]) {
                // Preserve icons and controls while replacing only the label.
                if (el.children.length) {
                    Array.from(el.childNodes).filter(function(n) { return n.nodeType === 3; }).forEach(function(n) { n.remove(); });
                    el.appendChild(document.createTextNode(' ' + I18N[lang][key]));
                } else el.textContent = I18N[lang][key];
            }
        });
        document.querySelectorAll('[data-i18n-placeholder]').forEach(function(el) {
            var key = el.getAttribute('data-i18n-placeholder');
            if (I18N[lang]?.[key]) el.placeholder = I18N[lang][key];
        });
        ['title', 'aria-label'].forEach(function(attr) {
            document.querySelectorAll('[data-i18n-' + attr + ']').forEach(function(el) {
                el.setAttribute(attr, I18N[lang][el.getAttribute('data-i18n-' + attr)]);
            });
        });
        document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
        var btn = document.getElementById('langLabel');
        if (btn) btn.textContent = lang === 'zh' ? 'EN' : '中文';
        document.title = I18N[lang]?.page_title || document.title;
    }
    toggle() {
        this.currentLang = this.currentLang === 'zh' ? 'en' : 'zh';
        localStorage.setItem('datalens-lang', this.currentLang);
        this.applyTranslations();
        var self = this;
        document.querySelectorAll('.toast').forEach(function(toast) {
            if (!toast.translation) return;
            var message = toast.translation, params = Object.assign({}, message.params);
            if (params.msg) {
                var key = Object.keys(I18N.zh).find(function(k) { return I18N.zh[k] === params.msg || I18N.en[k] === params.msg; });
                if (key) params.msg = self.t(key);
            }
            toast.textContent = self.t(message.key, params);
        });
    }
}
I18N.zh.error_unknown = '请检查数据格式后重试';
I18N.en.error_unknown = 'Please check the data format and try again';

// Translate display labels only; column keys and source data stay stable.
I18nManager.prototype.column = function(column, manager) {
    if (!column) return column;
    if (manager.isDefaultDataset && DEFAULT_COLUMN_LABELS[column]) return this.currentLang === 'zh' ? DEFAULT_COLUMN_LABELS[column] : column;
    if ((manager.originalColumns || []).includes(column)) return column;
    if (I18N.zh['stat_' + column]) return this.t('stat_' + column);
    var match = column.match(/^(.*)_(normalized|zscore|bin)$/);
    if (match) return this.t('column_' + match[2], {column: this.column(match[1], manager)});
    match = column.match(/^(.*)_rolling_(mean|sum|std|min|max|median|count)$/);
    if (match) return this.t('column_rolling', {column: this.column(match[1], manager), statistic: this.t('stat_' + match[2])});
    return this.value(column, manager);
};
I18nManager.prototype.value = function(value, manager) {
    if (value === null || value === undefined || value === 'NaN') return this.t('missing_value');
    return this.currentLang === 'zh' && manager.isDefaultDataset && typeof value === 'string' ? (DEFAULT_VALUE_LABELS[value] || value) : value;
};
I18nManager.prototype.error = function(error) {
    if (error.i18nKey) return this.t(error.i18nKey);
    if (error instanceof SyntaxError) return this.t('error_invalid_json');
    return this.t('error_unknown');
};
