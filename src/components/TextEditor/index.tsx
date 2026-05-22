import { useState, useEffect, useMemo, type CSSProperties, useRef, useImperativeHandle, type Ref } from 'react';
import classname from 'classnames';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import translations from 'ckeditor5/translations/es.js';

import { ClassicEditor, DEFAULT_HEADING_OPTIONS } from './features';
import type { onChangeType, T_ConfigParams } from './types';

import { collectPlugins, resolveToolbar, toToolbarItems } from './utils';
import 'ckeditor5/ckeditor5.css';
import "./ckeditor-styles.scss";

const LICENSE_KEY = 'GPL'; // or <YOUR_LICENSE_KEY>.

interface I_Props {
    data?: string;
    initialData?: string;
    placeholder?: string;
    disabled?: boolean;
    readOnly?: boolean;
    className?: string;
    style?: CSSProperties;
    config?: T_ConfigParams;
    invalid?: boolean;
    inputRef?: Ref<unknown>;
    name?: string;
    onChange?: onChangeType;
    onBlur?: VoidFunction
}

export default function TextEditor({
    initialData, placeholder, config = {}, style, invalid, disabled, readOnly, className, ...props
}: I_Props) {
    const [isLayoutReady, setIsLayoutReady] = useState(false);
    const editorRef = useRef<ClassicEditor | null>(null);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsLayoutReady(true);

        return () => setIsLayoutReady(false);
    }, []);

    useImperativeHandle(props.inputRef, () => ({
        focus: () => editorRef.current?.editing.view.focus()
    }), []);

    const { editorConfig } = useMemo(() => {

        if (!isLayoutReady) return {};

        const { toolbar: features, showMenuBar, ...restConfig } = config;

        const toolbar = resolveToolbar(features);

        return {
            editorConfig: {
                root: {
                    placeholder: placeholder,
                    initialData,
                },
                toolbar: {
                    items: toToolbarItems(toolbar),
                    shouldNotGroupWhenFull: false
                },
                plugins: collectPlugins(toolbar),
                licenseKey: LICENSE_KEY,
                fontFamily: {
                    supportAllValues: true
                },
                // fontSize: {
                //     options: [10, 12, 14, 'default', 18, 20, 22],
                //     supportAllValues: true
                // },
                heading: {
                    options: DEFAULT_HEADING_OPTIONS
                },
                fullscreen: {
                    onEnterCallback: (container: HTMLElement) =>
                        container.classList.add(
                            'editor-container',
                            'editor-container_classic-editor',
                            'editor-container_include-fullscreen',
                            'main-container'
                        )
                },
                language: 'es',
                link: {
                    addTargetToExternalLinks: true,
                    defaultProtocol: 'https://',
                    decorators: {
                        toggleDownloadable: {
                            mode: 'manual' as const,
                            label: 'Downloadable',
                            attributes: {
                                download: 'file'
                            }
                        }
                    }
                },
                menuBar: {
                    isVisible: showMenuBar,
                },
                table: {
                    contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
                },
                translations: [translations],
                ...restConfig
            }
        };
    }, [isLayoutReady, placeholder, initialData, config]);

    return (
        <div style={style} className={classname("main-container", className)}>
            <div className={classname(
                "editor-container",
                "editor-container_classic-editor",
                "editor-container_include-fullscreen",
                { "disabled-editor": disabled }
            )}>
                <div className={classname("editor-container__editor", { "is-invalid": invalid })}>
                    {editorConfig &&
                        <CKEditor
                            editor={ClassicEditor}
                            config={editorConfig}
                            disabled={disabled || readOnly}
                            onReady={(editor) => {
                                editorRef.current = editor;
                            }}
                            {...props}
                        />
                    }
                </div>
            </div>
        </div>
    );
}
