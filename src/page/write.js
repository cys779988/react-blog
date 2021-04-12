import React, { Component } from 'react';
import './main.css';

import {CKEditor} from '../inc/index.js';

class write extends Component {
  componentDidMount() {
    if(this.props.match.params.data && this.props.title.length ===0 ){
      this.props._getModifyData(this.props.match.params.data);
    }
  }
  render() {
    const {_getContents, contents, _getTitle, title } = this.props;
    return (
        <div className='Write'>
          <div id='Title'>
            <input type='text' id='title_txt' name='title' placeholder='제목' defaultValue={title} onBlur={() => _getTitle()}/>
          </div>
          <div>
            {/*<textarea id='content_txt' name='contents' placeholder='내용을 입력하세요.'></textarea>*/}
            <CKEditor
              _getContents = {_getContents}
              contents = {contents}/>
          </div>
        </div>
    );
  }
}

export default write;