import { type CSSProperties, useState } from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import * as Font from '@ckeditor/ckeditor5-font/src/font';

import './style.css';

type T_CKEditorInstance = {
    getData: () => string;
    setData: (data: string) => void;
};

// type T_WordCountStats = { characters: number; words: number };

interface I_Props {
    data: string;
    disabled?: boolean;
    className?: string;
    style?: CSSProperties;
    config?: Record<string, unknown>;
    invalid?: boolean;
    inputRef?: unknown;
    [x: string]: unknown;
}

export default function TextEditor({ data, config, disabled, style, className, ...props }: I_Props) {

    const [_editor, setEditor] = useState<T_CKEditorInstance | null>(null);

    // const counterContainer = useRef<HTMLElement | undefined>();

    // const [_wordCountConfig, _setWordCountConfig] = useState({
    //         container: counterContainer.current,
    //         displayCharacters: true,
    //         displayWords: true,
    //         // onUpdate: (_stats: T_WordCountStats) => {
    //         //     // console.log("states", stats);
    //         // }
    // });

    const defaultConfig = {
        // fontFamily: {
        //     options: [
        //         'default',
        //         'Ubuntu, Arial, sans-serif',
        //         'Ubuntu Mono, Courier New, Courier, monospace'
        //     ]
        // },
        // colorButton_colors: 'CF5D4E,454545,FFF,DDD,CCEAEE,66AB16',
        // colorButton_enableAutomatic: false,
        toolbar: [
            'undo', 'redo',
            '|',
            'heading',
            '|',
            'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote',
            '|',
            // 'strikethrough', 'underline', 'subscript', 'superscript',
            'insertTable', '|',
            'outdent', 'indent', '|',
        ],
        heading: {
            options: [
                { model: 'paragraph', title: 'Texto', class: 'ck-heading_paragraph' },
                { model: 'heading1', view: 'h1', title: 'Título 1', class: 'ck-heading_heading1' },
                { model: 'heading2', view: 'h2', title: 'Título 2', class: 'ck-heading_heading2' },
                { model: 'heading3', view: 'h3', title: 'Título 3', class: 'ck-heading_heading3' },
                { model: 'heading4', view: 'h4', title: 'Título 4', class: 'ck-heading_heading4' },
                { model: 'heading5', view: 'h5', title: 'Título 5', class: 'ck-heading_heading5' },
                { model: 'heading6', view: 'h6', title: 'Título 6', class: 'ck-heading_heading6' },
            ]
        },
        // extraPlugins: 'WordCount',
        // WordCount: {
        //     showCharCount: true,

        //     maxCharCount: 200,

        //     hardLimit: true,
        // }
        // placeholder: "Type some text...",
        // extraPlugins: [WordCount]
        // plugins: 'WordCount',
        // wordCount: {
        //     container: document.getElementById("word-count"),
        //     displayCharacters: true
        //   }
        // removePlugins: [ 'Heading', 'Link', 'CKFinder' ],
    }


    const onError = () => {
        // console.log({ phase, willEditorRestart })
    }

    const CKProps = {
        config: { ...defaultConfig, ...config },
        disabled: !!(disabled),
        onError,
    }

    return (
        <div style={style} className={className}>
            <CKEditor
                editor={ClassicEditor}
                data={data}

                onReady={(editor: T_CKEditorInstance) => {
                    setEditor(editor);
                }}
                // onChange={(event: any, editor: any) => {
                //     const data = editor.getData();
                //     console.log({ event, editor, data });
                // }}
                {...CKProps}
                {...props}
            />
            {/* <div id="word-count" ref={counterContainer}>
                <div className="ck ck-word-count">
                    <div className="ck-word-count__words">Words: 4</div>
                    <div className="ck-word-count__characters">Characters: 28</div>
                </div>
            </div> */}
            {/* <div className="ck ck-word-count">
                <div className="ck-word-count__words">Words: %%</div>
                <div className="ck-word-count__characters">Characters: %%</div>
            </div> */}
        </div>
    )
}
