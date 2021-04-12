import React, {Component} from 'react';
import {Route, Link} from 'react-router-dom';
import '../App.css';
import {Login} from './index.js';

class header extends Component{
    constructor(props){
        super(props);
        this.state = {
            visible : false,
            id : "",
            password : "",
        }
    }

    _openModal = function(){
        return this.props._toggleModal(true);
    }

    _logout = function () {
        if(window.confirm('로그아웃 하시겠습니까?')){
            this.props._logout();
        }
    }
    render(){
        const {login, admin, user_ip, login_modal, _toggleModal, _login} = this.props;
        return(
            <div className='header_grid'>
                <div className='acenter'>
                    {login && admin === 'Y' && user_ip === '192.168.100.221' ? <h5><Link to='/write'>포스트작성</Link></h5> : null}
                </div>
                <div className='acenter'>
                    <Route path='/'/>
                    <Link className='link_tit' to='/'> <h3>YeongSu's Blog</h3></Link>
                </div>

                <div className='acenter'>
                    <br/>
                    <ul className='btn_list'>
                    {login ? <li className='btn_cursor' onClick={() => {this._logout()}}>로그아웃</li>
                           :  <li className='btn_cursor' onClick={() => {this._openModal()}}>로그인</li>}
                    {!login ?
                    <li><Link className='link_tit' to='/signup'>회원가입</Link></li>
                    : null
                }
                    </ul>
                </div>
                <Login
                    _login = {_login}
                    login_modal = {login_modal}
                    _toggleModal = {_toggleModal}/>
            </div>
        );
    }
}

export default header;