import type { Editor, PluginConstructor, HeadingOption, EventInfo, ClassicEditor } from 'ckeditor5';

export type T_HeadingOption = HeadingOption;

export type T_FeaturePreset = 'minimalist' | 'default' | 'advanced';

export type T_FeatureName =
    | 'undo' | 'redo'
    | 'bold' | 'italic' | 'underline' | 'strikethrough' | 'code'
    | 'subscript' | 'superscript'
    | 'heading'
    | 'bulletedList' | 'numberedList' | 'outdent' | 'indent'
    | 'link' | 'blockQuote' | 'removeFormat'
    | 'fontColor' | 'fontBackgroundColor' | 'fontFamily' | 'fontSize'
    | 'highlight' | 'alignment' | 'table' | 'fullscreen';

export type T_ToolbarItem = T_FeatureName | '|';

export type T_PluginCtor = PluginConstructor<Editor>;

export interface I_FeatureDef {
    plugins: T_PluginCtor[];
    item: string;
}

export type T_ConfigParams = {
    toolbar?: T_FeaturePreset | T_FeatureName[],
    showMenuBar?: boolean;
}

export interface onChangeType {
    (event: EventInfo<string, unknown>, editor: ClassicEditor): void;
}