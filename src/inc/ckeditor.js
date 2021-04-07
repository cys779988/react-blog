import React, { Component } from 'react';

import {CKEditor} from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

class ckeditor extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { contents, _getContents } = this.props;
    
    return (
        <div>
            <CKEditor
                editor={ ClassicEditor }
                data={contents}
                onReady={ editor => {
                    // You can store the "editor" and use when it is needed.
                    console.log( 'Editor is ready to use!', editor );
                } }
                onChange={ ( event, editor ) => {
                    const data = editor.getData();
                    console.log( { event, editor, data } );
                } }
                onBlur={ ( event, editor ) => {
                    const data = editor.getData();

                    _getContents(data);
                } }
                onFocus={ ( event, editor ) => {
                    console.log( 'Focus.', editor );
                } }
            />
        </div>
    );
  }
}

export default ckeditor;