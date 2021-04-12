import axios from 'axios';
import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import './main.css';

class view extends Component {
    constructor(props){
        super(props)
        this.state = {
            none_like : 'https://iconmonstr.com/wp-content/g/gd/makefg.php?i=../assets/preview/2013/png/iconmonstr-thumb-10.png&r=171&g=171&b=171',
            like : 'https://iconmonstr.com/wp-content/g/gd/makefg.php?i=../assets/preview/2013/png/iconmonstr-thumb-10.png&r=171&g=53&b=53',
            list_num : 0,
            pre : "https://iconmonstr.com/wp-content/g/gd/makefg.php?i=../assets/preview/2018/png/iconmonstr-angel-left-thin.png&r=0&g=0&b=0",
            next : "https://iconmonstr.com/wp-content/g/gd/makefg.php?i=../assets/preview/2018/png/iconmonstr-angel-right-thin.png&r=0&g=0&b=0",
            reply_data : [],
            reply_num : null,
        }
    }

    componentDidMount(){
        const board_id = this.props.match.params.data;
        const {like_exist, _getPreAndNextData, _getData} = this.props;
        const {reply_num} = this.state;

        if(reply_num === null){
            this._getReplyData(board_id)
        }

        if(board_id != this.props.board_id){
            _getData(board_id);
            _getPreAndNextData(board_id);
            this._addViewCnt(board_id);
        }
        
        if(like_exist === null) {
            this._getLikeInfo();
        }
        
    }
    _addViewCnt = async function (board_id) {
        await axios('/update/view_cnt', {
            method : 'POST',
            headers : new Headers(),
            data : {id : board_id}
        })
    }

    _toggleLike = async function() {
        const {user_id, login, _toggleModal, _getData, _getAllLike} = this.props;

        if(!login){
            alert('로그인이 필요합니다.');
            return _toggleModal(true);
        }

        const board_id = this.props.match.params.data;
        const obj = {type : 'add', user_id : user_id, board_id : board_id}

        const res = await axios('/update/like', {
            method : 'POST',
            headers : new Headers(),
            data : obj
        })

        if(!res.data){
            if(window.confirm('좋아요를 취소하시겠습니까?')){
                const cancel = {type : 'remove', user_id : user_id, board_id : board_id}

                await axios('/update/like', {
                    method : 'POST',
                    headers : new Headers(),
                    data : cancel
                })

                this.setState({like_exist : false})
                _getAllLike(board_id)
                
                alert('좋아요가 취소되었습니다.');
            }
        }else{
            this.setState({like_exist : true})
            _getAllLike(board_id)

            alert('해당 게시물에 좋아요를 누르셨습니다.')
        }
    }

    _getLikeInfo = async function(){
        const {user_id, login, _getLikeExist} = this.props;

        if(login) {
            const board_id = this.props.match.params.data;
            const obj = {user_id : user_id, board_id : board_id}

            const getData = await axios('/check/like', {
                method : 'POST',
                headers : new Headers(),
                data : obj
            })

            if(getData.data[0]){
                return _getLikeExist(true);
                }
            _getLikeExist(false);
        }
    }

    _changeViewPage = function(url) {
        if(url === 'null_pre'){
            return alert('첫번째 게시물입니다.')
        } else if(url === 'null_next'){
            return alert('마지막 게시물입니다.')
        }
        return window.location.href = url;
    }

    _removeView = async function() {
        if(window.confirm('해당 게시물을 삭제하시겠습니까?\n삭제된 데이터는 복구할 수 없습니다.')) {
            const board_id = this.props.match.params.data;

            await axios('/delete/board', {
            method : 'POST',
            headers: new Headers(),
            data : { board_id : board_id }
            })

            alert('게시물이 삭제되었습니다.')
            return window.location.href = '/'
        }
    }

    _loginCheck = () => {
        const {
            login,_toggleModal
        } = this.props;
        
        if(!login) {
            alert('로그인이 필요합니다.');
            _toggleModal(true)

            return false;
        }
        return true;
    }

    _addReply = async () => {
        let reply = document.getElementsByName('write_reply')[0].value.trim();
    
        // 내용 줄바꿈 처리하기
        reply = reply.replace(/(\n|\r\n)/g, '<br>');
    
        const board_id = this.props.match.params.data;
        const { user_id } = this.props;
    
        if(!this._loginCheck()) {
          return
        }
    
        if(reply === "" || reply.length === 0) {
          document.getElementsByName('write_reply')[0].focus()
          document.getElementsByName('write_reply')[0].value = reply;
    
          return alert('댓글을 입력해주세요.');
    
        } else if(reply.split('<br>').length > 5) {
          return alert('댓글 내용이 5줄 이상 초과되었습니다.')
        }
    
        const data = { 
          board_id : board_id,
          contents : reply,
          user_id : user_id 
        }
    
        await axios('/add/reply', {
          method : 'POST',
          headers: new Headers(),
          data : data
        })
    
        alert('댓글이 등록되었습니다.')
        return window.location.reload();
    }
    _getReplyData = async (board_id) => {

        // 데이터와 총 갯수 구하기
        const data = await axios('/get/reply_data', {
          method : 'POST',
          headers: new Headers(),
          data : { board_id : board_id }
        })
        return this.setState({
            reply_data : data.data.rows,
            reply_num : data.data.count
        })
    }
    
    _removeReply = async function (reply_id) {
        
        if(window.confirm('해당 댓글을 삭제하시겠습니까?')){
            await axios('/delete/reply', {
                method : 'POST',
                headers : new Headers(),
                data : {reply_id : reply_id}
            })
        }

        alert('댓글 삭제가 완료되었습니다.');
        return window.location.reload();
    }

    render(){
        const {none_like, like, pre, next, reply_num, reply_data} = this.state;
        const {data, date, like_num, like_exist, pre_view, next_view, admin} = this.props;

        const {_loginCheck, _addReply} = this;

        if(next_view.length){
            var next_url = '/view/' + next_view[0].board_id;
        }

        if(pre_view.length){
            var pre_url = '/view/' + pre_view[0].board_id;
        }
        
        if(data){
            var modify_url = '/write/modify/' + data.board_id;
        }
        return(
            <div className='Write View'>
                {data ?
                    <div>
                    {admin === 'Y'
                    ?
                        <div className='write_option_div'>
                            <Link to={modify_url}> <input type='button' value='수정' /> </Link>
                            <input type='button' value='삭제' onClick={() => this._removeView()} />
                        </div>
                    : null}
                    <div className='top_title'>
                        <input type='text' id='title_txt' name='title' defaultValue={data.title} readOnly/>

                        <div className='date_div'>
                            {date}
                        </div>
                    </div>
                    <div id='content_div'
                                dangerouslySetInnerHTML={ {__html : data.contents}}
                                >
                    </div>
                    <div className='other_div'>
                    <input type='button' value='목록' id='view_list_button'
                        onClick={() => window.location.href = '/'} />

                        <div className='view_pre_next_div view_pre'> 
                            {/* left empty*/}
                            <p> 이전글 </p>
                            <img src={pre} onClick={
                                pre_url
                                ? () => this._changeViewPage(pre_url)
                                : () => this._changeViewPage('null_pre')
                                }/>
                            <div>
                                {pre_view.length > 0
                                ? pre_view[0].title
                                : <p>첫번째 글입니다.</p>}
                            </div>
                        </div>

                        <div className='Like'>
                            <img src={!like_exist ? none_like : like} onClick={() => this._toggleLike()}/>
                            <h5> 좋아요 ({!like_num ? data.likes : like_num})</h5>
                        </div>
                        <div className='view_pre_next_div view_next'> 
                            {/* right empty*/} 
                            <p> 다음글 </p>
                            <img src={next} onClick={
                                next_url
                                ? () => this._changeViewPage(next_url)
                                : () => this._changeViewPage('null_next')
                                }/>
                            <div>
                                {next_view.length > 0
                                ? next_view[0].title
                                : <p>마지막 글입니다.</p>}
                            </div>
                        </div>
                    </div>
                    <div className='Reply_div'>
                        <h4>댓글</h4>

                        <div className='Reply_write'>
                            <textarea rows='3' placeholder='100자 이내의 글을 입력하세요.' maxLength='100' name='write_reply' onClick={() => _loginCheck()}>

                            </textarea>
                            <input type='button' value='등록' id='reply_submit_button' onClick={() => _addReply()}/>
                        </div>
                    </div>

                    <div className='Reply_list'>
                        {reply_data.length > 0 && reply_num > 0
                            ? 
                            <div>
                                    <h5> {reply_num} 개의 댓글이 있습니다.</h5>
                                    <div className='reply_list_div'>
                                        {reply_data.map( (el, key) => {
                                            let id = el.user_id;
                                            if(el.user.admin === 'Y'){
                                                id = '관리자'
                                            }
                                            let date = el.date.slice(2, 10) + ' ' + el.date.slice(11, 16);
                                            return(
                                            <div className='reply_list_gird' key={key}> 
                                                <div style={ el.user.admin === 'Y' ? {'fontWeight' : 'bold'} : null}
                                                    className='reply_list_id'
                                                >
                                                    {id}
                                                </div>
                                                <div className='reply_list_contents' dangerouslySetInnerHTML={ {__html : el.contents }}>
                                                </div>
                                                
                                                <div className='reply_list_date'>
                                                    {date}
                                                    {(this.props.login && this.props.login === el.user.id) || this.props.admin === 'Y'
                                                        ? <input type='button' value='삭제' onClick={() => this._removeReply(el.reply_id)} className='reply_delete_btn'/>
                                                        : null}
                                                </div>
                                            </div>
                                            )
                                        })}
                                    </div>
                                </div>

                                : <h5> 작성된 댓글이 없습니다. </h5>}
                    </div>
                </div>
                :null}
            </div>
        );
    }
}

export default view;