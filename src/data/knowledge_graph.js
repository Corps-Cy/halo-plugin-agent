// Mapping keywords to Halo technical documentation IDs
// This helps reduce token usage by only injecting relevant context.

const knowledgeMap = [
    // --- Backend / Core ---
    {
        keywords: ['reconciler', 'controller', 'logic', 'sync', 'backend', 'java', '协调器', '后端', '逻辑'],
        docs: ['18_reconciler_writing.md', '12_object_management.md']
    },
    {
        keywords: ['extension', 'crd', 'gvk', 'model', 'schema', 'data', 'database', '模型', '数据', '数据库'],
        docs: ['17_extension_definition.md', '09_plugin_manifest.md']
    },
    {
        keywords: ['settings', 'config', 'configuration', 'preference', '配置', '设置'],
        docs: ['20_setting_fetcher.md']
    },
    
    // --- Frontend / UI ---
    {
        keywords: ['ui', 'frontend', 'vue', 'component', 'view', 'page', '界面', '前端', '页面'],
        docs: ['13_plugin_ui_intro.md', '29_plugin_ui_routes.md', '30_plugin_ui_api_request.md']
    },
    {
        keywords: ['upload', 'attachment', 'file', 'image', '上传', '附件', '文件', '图片'],
        docs: ['33_plugin_ui_component_uppy_upload.md', '49_extension_point_attachment_storage.md', '39_plugin_ui_component_attachment_selector_modal.md']
    },
    {
        keywords: ['menu', 'sidebar', 'tab', 'navigation', '菜单', '侧边栏', '导航'],
        docs: ['29_plugin_ui_routes.md', '60_ui_extension_point_plugin_self_tabs_create.md']
    },
    {
        keywords: ['form', 'input', 'editor', '表单', '输入', '编辑器'],
        docs: ['87_form_schema.md', '88_annotations_form.md', '59_ui_extension_point_editor_create.md']
    },
    {
        keywords: ['permission', 'rbac', 'role', 'auth', 'security', '权限', '角色', '安全'],
        docs: ['84_plugin_ui_permission.md', '83_plugin_role_template.md']
    },
    
    // --- Extension Points ---
    {
        keywords: ['notification', 'alert', 'notify', 'message', '通知', '消息'],
        docs: ['52_extension_point_notifier.md']
    },
    {
        keywords: ['theme', 'template', 'render', 'head', 'footer', '主题', '模板'],
        docs: ['53_extension_point_template_head_processor.md', '54_extension_point_template_footer_processor.md', '24_plugin_theme_templates.md']
    }
];

// Always include these foundation docs
const coreDocs = [
    '04_framework.md', // Architecture Overview
    '00_master_spec.md', // Critical Rules
    '02_java_import_reference.md' // Class & Import Lookup
];

module.exports = {
    knowledgeMap,
    coreDocs
};
