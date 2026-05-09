import type { I_FeatureDef, T_FeatureName, T_FeaturePreset, T_HeadingOption, T_PluginCtor, T_ToolbarItem } from './types';

import  {
    Fullscreen,
    List,
    Bold,
    Underline,
    Strikethrough,
    Code,
    Subscript,
    Superscript,
    FontBackgroundColor,
    FontColor,
    FontFamily,
    FontSize,
    Highlight,
    Link,
    Heading,
    Indent,
    Table,
    TableToolbar,
    Italic,
    BlockQuote,
    Alignment,
    RemoveFormat,
    Essentials,
    Paragraph,
    Autoformat,
    TextTransformation,
} from 'ckeditor5';

export {
    ClassicEditor
} from 'ckeditor5';

export const ALWAYS_PLUGINS: T_PluginCtor[] = [Essentials, Paragraph, Autoformat, TextTransformation];

export const FEATURE_DEFINITIONS: Record<T_FeatureName, I_FeatureDef> = {
    undo:                { plugins: [],                    item: 'undo' },
    redo:                { plugins: [],                    item: 'redo' },
    bold:                { plugins: [Bold],                item: 'bold' },
    italic:              { plugins: [Italic],              item: 'italic' },
    underline:           { plugins: [Underline],           item: 'underline' },
    strikethrough:       { plugins: [Strikethrough],       item: 'strikethrough' },
    code:                { plugins: [Code],                item: 'code' },
    subscript:           { plugins: [Subscript],           item: 'subscript' },
    superscript:         { plugins: [Superscript],         item: 'superscript' },
    heading:             { plugins: [Heading],             item: 'heading' },
    bulletedList:        { plugins: [List],                item: 'bulletedList' },
    numberedList:        { plugins: [List],                item: 'numberedList' },
    outdent:             { plugins: [Indent],              item: 'outdent' },
    indent:              { plugins: [Indent],              item: 'indent' },
    link:                { plugins: [Link],                item: 'link' },
    blockQuote:          { plugins: [BlockQuote],          item: 'blockQuote' },
    removeFormat:        { plugins: [RemoveFormat],        item: 'removeFormat' },
    fontColor:           { plugins: [FontColor],           item: 'fontColor' },
    fontBackgroundColor: { plugins: [FontBackgroundColor], item: 'fontBackgroundColor' },
    fontFamily:          { plugins: [FontFamily],          item: 'fontFamily' },
    fontSize:            { plugins: [FontSize],            item: 'fontSize' },
    highlight:           { plugins: [Highlight],           item: 'highlight' },
    alignment:           { plugins: [Alignment],           item: 'alignment' },
    table:               { plugins: [Table, TableToolbar], item: 'insertTable' },
    fullscreen:          { plugins: [Fullscreen],          item: 'fullscreen' },
};

export const FEATURE_PRESETS: Record<T_FeaturePreset, T_ToolbarItem[]> = {
    minimalist: [
        'undo', 'redo', '|',
        'bold', 'italic', 'underline', '|',
        'bulletedList', 'numberedList', '|',
        'link',
    ],
    default: [
        'undo', 'redo', '|',
        'heading', '|',
        'bold', 'italic', 'underline', '|',
        'bulletedList', 'numberedList', 'outdent', 'indent', '|',
        'link', 'blockQuote', 'table'
    ],
    advanced: [
        'undo', 'redo', '|',
        'fullscreen', '|',
        'heading', '|',
        'fontFamily', 'fontSize', 'fontColor', 'fontBackgroundColor', '|',
        'bold', 'italic', 'underline', 'strikethrough', 'code', '|',
        'subscript', 'superscript', 'highlight', '|',
        'alignment', '|',
        'bulletedList', 'numberedList', 'outdent', 'indent', '|',
        'link', 'blockQuote', 'table', '|',
        'removeFormat',
    ],
};

export const DEFAULT_HEADING_OPTIONS: T_HeadingOption[] = [
    { model: 'paragraph', title: 'Texto', class: 'ck-heading_paragraph' },
    { model: 'heading1', view: 'h1', title: 'Título 1', class: 'ck-heading_heading1' },
    { model: 'heading2', view: 'h2', title: 'Título 2', class: 'ck-heading_heading2' },
    { model: 'heading3', view: 'h3', title: 'Título 3', class: 'ck-heading_heading3' },
    { model: 'heading4', view: 'h4', title: 'Título 4', class: 'ck-heading_heading4' },
    { model: 'heading5', view: 'h5', title: 'Título 5', class: 'ck-heading_heading5' },
    { model: 'heading6', view: 'h6', title: 'Título 6', class: 'ck-heading_heading6' },
]