import React, { useState, useEffect } from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import * as Font from '@ckeditor/ckeditor5-font/src/font';

import './style.css';

type T_EventInfo = {
    EventInfo: { name: string, path: Array<any>, source: any },
    Editor: any
}

export default function TextEditor() {

    const [editor, setEditor] = useState<any>(null);

    const config = {
        fontFamily: {
            options: [
                'default',
                'Ubuntu, Arial, sans-serif',
                'Ubuntu Mono, Courier New, Courier, monospace'
            ]
        },
        // colorButton_colors: 'CF5D4E,454545,FFF,DDD,CCEAEE,66AB16',
        // colorButton_enableAutomatic: false,
        toolbar: [
            'undo', 'redo',
            '|',
            'heading',
            '|',
            // 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote',
            // '|',
            // 'strikethrough', 'underline', 'subscript', 'superscript','todoList,
            // 'insertTable', '|',
            // 'outdent', 'indent', '|',
            // '|',
            'fontColor'
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
        // removePlugins: [ 'Heading', 'Link', 'CKFinder' ],
    }

    const onError = (phase: 'initialization' | 'runtime', willEditorRestart: boolean) => {
        console.log({ phase, willEditorRestart })
    }

    const CKProps = {
        config,
        disabled: false,
        onError,
    }

    // useEffect(() => {
    //     console.log(editor)

    //     editor?.create({
    //         fontColor: {
    //             options: [
    //                 'tiny',
    //                 'default',
    //                 'big'
    //             ]
    //         }
    //     })
    // }, [editor])


    return (
        <div>

            <CKEditor
                {...CKProps}
                className=""
                editor={ClassicEditor}
                data="<p>Hello from CKEditor 5!</p>"
                onReady={(editor: any) => {
                    // You can store the "editor" and use when it is needed.
                    console.log('Editor is ready to use!', editor);
                    setEditor(editor);
                }}
                onChange={(event: any, editor: any) => {
                    const data = editor.getData();
                    console.log({ event, editor, data });
                }}
            // onBlur={(event, editor) => {
            //     console.log('Blur.', editor);
            // }}
            // onFocus={(event, editor) => {
            //     console.log('Focus.', editor);
            // }}
            />

        </div>
    )
}
