import React from 'react';
//import { CKEditor } from '@ckeditor/ckeditor5-react';
//import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import { Editor } from '@tinymce/tinymce-react';

/*
const removePlugins = [
    'ImageUpload'
];
*/

function MyEditor({ description, setDescription }) {
    return (
        <Editor
            apiKey="fs2s8z2cwt6bq159rv1hpcq6ojwfz022e7sj6ygg0dyc171h"
            initialValue={description}
            init={{
                max_height: 500,
                menubar: false,
                plugins: [
                    'advlist autolink lists link image charmap print preview anchor',
                    'searchreplace visualblocks code fullscreen hr',
                    'insertdatetime media table paste code help wordcount',
                    'linkchecker tinymcespellchecker advtable fullscreen'
                ],
                toolbar: 'formatselect | bold italic backcolor link | alignleft aligncenter alignright alignjustify hr | bullist numlist outdent indent | removeformat | image | table spellchecker fullscreen code',
                //toolbar_mode: 'floating',
                menu: {
                    file: { title: 'File', items: 'newdocument restoredraft | preview | print ' },
                    edit: { title: 'Edit', items: 'undo redo | cut copy paste | selectall | searchreplace' },
                    view: { title: 'View', items: 'code | visualaid visualchars visualblocks | spellchecker | preview fullscreen' },
                    insert: { title: 'Insert', items: 'image link media template codesample inserttable | charmap emoticons hr | pagebreak nonbreaking anchor toc | insertdatetime' },
                    format: { title: 'Format', items: 'bold italic underline strikethrough superscript subscript codeformat | formats blockformats fontformats fontsizes align lineheight | forecolor backcolor | removeformat' },
                    tools: { title: 'Tools', items: 'spellchecker spellcheckerlanguage | code wordcount' },
                    table: { title: 'Table', items: 'inserttable | cell row column | tableprops deletetable' },
                    help: { title: 'Help', items: 'help' }
                  },
                fullscreen_native: true,
                //images_upload_url: 'postAcceptor.php',
                //automatic_uploads: true
                //fontsize_formats: '8pt 10pt 12pt 14pt 16pt 18pt 24pt 36pt 48pt'
            }}
            onEditorChange={(content, editor) => setDescription(content)}
        />
    )

    /*
    return (
        <CKEditor
            editor={ClassicEditor}
            data={description}
            config={{ removePlugins }}
            onChange={(event, editor) => setDescription(editor.getData())}
        />
    )
    */
}

export default React.memo(MyEditor);