import { ALWAYS_PLUGINS, FEATURE_DEFINITIONS, FEATURE_PRESETS } from "./features";
import type { T_FeatureName, T_FeaturePreset, T_PluginCtor, T_ToolbarItem } from "./types";

export const resolveToolbar = (features?: T_FeaturePreset | T_FeatureName[]): T_ToolbarItem[] => {
    if (Array.isArray(features)) return features;
    return FEATURE_PRESETS[features ?? 'default'];
};

export const collectPlugins = (toolbar: T_ToolbarItem[]): T_PluginCtor[] => {
    const plugginsArr = [...ALWAYS_PLUGINS];
    for (const item of toolbar) {
        if (item === '|') continue;
        const def = FEATURE_DEFINITIONS[item];
        if (!def) continue;
        for (const p of def.plugins) plugginsArr.push(p);
    }
    return plugginsArr;
};

export const toToolbarItems = (toolbar: T_ToolbarItem[]): string[] => toolbar.map(t => (t === '|' ? '|' : FEATURE_DEFINITIONS[t].item));
