import React, {Component} from 'react';
import {Route, Switch} from 'react-router-dom';
import {List, Write, View, Signup} from './index.js';
import { Right_Write } from './right/index.js'; 
import { Category } from './left/index.js'; 
import axios from 'axios';

import './main.css';

class main extends Component {
    constructor(props) {
        super(props)
        this.state = {
            category : '',
            category_change : false,
            contents : "",
            title : "",
        }
    }
    
    _withProps = function(Component, props) {
        return function (matchProps) {
            return <Component {...props} {...matchProps} />
        }
    }

    _changeState = () => {
        this.setState({ category_change : true })
      }

    _getTitle = () => {
        const title = document.getElementsByName('title')[0].value.trim();
        this.setState({title : title})
    }
    _getContents = (val) => {
        const contents = val.trim();
        this.setState({contents : contents});
    }

    _getModifyData = async (board_id) => {
        const getData = await axios('/get/board_data', {
            method : 'POST',
            headers : new Headers(),
            data : { id : board_id}
        });

        this.setState({
            title : getData.data.data[0].title,
            contents : getData.data.data[0].contents,
        })
    }

    render(){
        const {_changeState, _getContents, _getTitle, _getModifyData} = this;
        const {login, admin, user_ip, list_data, list_all_page, list_search, data, date, board_id, 
            list_page, _changePage, _changeCategory, user_id, _toggleModal, like_num, like_exist, _getAllLike,
            pre_view, next_view, _getPreAndNextData, _getLikeExist, _getData, category_data, select_category, _selectCategoryData} = this.props;
        const {contents, title} = this.state;

        return(
            <div className='Mains'>
                <div id='Mains-left'>
                    <Category _changeCategory={_changeCategory}
                            login = {login}
                            admin = {admin}
                            _changeState = {_changeState}
                            user_ip = {user_ip}
                    exact/>
                    {/*<Route path='/' render={props => <Category _changeCategory={_changeCategory} login = {login}/>} exact/>*/}
                </div>
                <div>
                    <Switch>
                    <Route path='/' component={this._withProps(List, {
                        category : this.state.category,
                        list_data : list_data,
                        list_all_page : list_all_page,
                        list_search : list_search,
                        list_page : list_page,
                        _changePage : _changePage
                    })} exact/>
                    </Switch>

                    <Route path='/signup' component={Signup}/>

                    <Route path='/write/modify/:data' 
                        component={this._withProps(Write, { 
                            _getContents : _getContents,
                            _getTitle : _getTitle,
                            contents : contents,
                            title : title,
                            _getModifyData : _getModifyData
                        })} />

                    <Route path='/write'
                        component={this._withProps(Write, {
                            _getContents : _getContents,
                            _getTitle : _getTitle,
                            contents : contents,
                            title : title
                        })} exact/>

                    <Route path='/view/:data' component={this._withProps(View, {
                                                                        board_id : board_id,
                                                                        login : login,
                                                                        user_id : user_id,
                                                                        admin : admin,
                                                                        _toggleModal : _toggleModal,
                                                                        data : data,
                                                                        date : date,
                                                                        like_num : like_num,
                                                                        like_exist : like_exist,
                                                                        _getData : _getData,
                                                                        _getAllLike : _getAllLike,
                                                                        pre_view : pre_view,
                                                                        next_view : next_view,
                                                                        _getPreAndNextData : _getPreAndNextData,
                                                                        _getLikeExist : _getLikeExist
                                                                        })}/>
                </div>
                <div id='Mains-right'>
                <Switch>
                    <Route path='/write/modify/:data'
                    component={this._withProps(Right_Write, { 
                    contents : contents,
                    category : category_data,
                    select_category : select_category,
                    _selectCategoryData : _selectCategoryData
                    })} />
                    
                    <Route path='/write' component={this._withProps(Right_Write, {
                                                                        contents : contents,
                                                                        category : category_data,
                                                                        select_category : select_category, 
                                                                        _selectCategoryData : _selectCategoryData
                                                                        })}/>
                </Switch>    
                </div>
            </div>
        );
    }
}

export default main;