import React, {Component} from 'react';
import './App.css';
import queryString from 'query-string';

import {Head} from './inc';
import {Main} from './page/index.js';
import axios from 'axios';
import { Category } from './page/left';

class App extends Component{
    constructor(props){
        super(props)
        this.state = {
            login : false,
            admin : false,
            user_ip : "",
            signup : false,
            login_modal : false,
            list_data : [],
            list_page : 1,
            list_limit : 10,
            list_all_page : [],
            list_search : "",
            data : "",
            date : "",
            category : "",
            user_id : "",
            like_num : "",
            like_exist : null,
            pre_view : "",
            next_view : "",
            board_id : "",
            category_data : [],
            select_category : "",      
        }
    }

    componentDidMount() {

        this._getListData();
        this._getAllCategoryData();

        if(sessionStorage.login && sessionStorage.IP) {
            this.setState({
                login : JSON.parse(sessionStorage.login).id,
                admin : JSON.parse(sessionStorage.login).admin,
                user_ip : JSON.parse(sessionStorage.IP),
                user_id : JSON.parse(sessionStorage.login).user_id
            })
        }
    }

    _login = (data) => {
        sessionStorage.setItem('login', JSON.stringify(data.suc))
        sessionStorage.setItem('IP', JSON.stringify(data.ip))

        this.setState({
                        login : JSON.parse(sessionStorage.login).id,
                        admin : JSON.stringify(data.suc).admin,
                        user_ip : JSON.parse(sessionStorage.IP),
                        user_id : JSON.parse(sessionStorage.login).user_id
        })
        return window.location.reload()
    }

    _logout = () => {
        this.setState({login : false, admin : false, user_ip : ""})

        sessionStorage.removeItem('login')
        sessionStorage.removeItem('IP')
    }

    _toggleModal = (boolean) => {
        this.setState({login_modal : boolean})
    }

    _setPage = function() {
        if(sessionStorage.page){
            this.setState({ list_page : Number(sessionStorage.page)})
            return Number(sessionStorage.page);
        }

        this.setState({list_page : 1})
        return 1;
    }

    _changePage = (el) => {
        this.setState({list_page : el})
        sessionStorage.setItem('page', el);

        return this._getListData();
    }

    _getListData = async function() {
        const {list_limit} = this.state;
        const list_pages = this._setPage();

        let categorys = '';
        if(sessionStorage.getItem('category')) {
            categorys = sessionStorage.getItem('category')
        }

        let search = "";
        if(queryString.parse(this.props.location.search)){
            search = queryString.parse(this.props.location.search).search;
        }

        const total_cnt = await axios('/get/board_cnt', {
            method : 'POST',
            headers : new Headers(),
            data : { search : search, category : categorys}
        });

        const total_list = await axios('/get/board', {
            method : 'POST',
            headers : new Headers(),
            data : {
                limit : list_limit,
                page : list_pages,
                search : search,
                category : categorys
            }
        })

        let page_arr = [];

        for(let i = 1; i<=Math.ceil(total_cnt.data.cnt / list_limit); i++){
            page_arr.push(i);
        }

        this.setState({list_data : JSON.stringify(total_list.data),
                        list_all_page : page_arr,
                        list_search : search })
    }

    _changeCategory = (target) => {
        sessionStorage.setItem('category', target);
        this.setState({category : target});

        return this._getListData();
    }

    _getData = async (board_id) => {
        const getData = await axios('/get/board_data', {
            method : 'POST',
            headers : new Headers(),
            data : {id : board_id}
        });
        const date = getData.data.data[0].date.slice(0,10) + ' ' + getData.data.data[0].date.slice(11,16);
        return this.setState({data : getData.data.data[0], date :date, board_id : getData.data.data[0].board_id})
    }

    _getAllLike = async (board_id) => {
        const getData = await axios('/get/board_data', {
          method : 'POST',
          headers: new Headers(),
          data : { id : board_id }
        });
        this.setState({ like_num : getData.data.data[0].likes })
      }

      _getPreAndNextData = async (board_id) => {
        const category = sessionStorage.getItem('category');
        const res = await axios('/get/pre_and_next', {
            method : 'POST',
            headers : new Headers(),
            data : {board_id : board_id, category, category}
        })
        this.setState({
            pre_view : res.data.pre,
            next_view : res.data.next
        })
    }

    _getLikeExist = (boo) => {
        this.setState({ like_exist : boo})
    }

    _getAllCategoryData = async function() {
        const getData = await axios('/get/category');

        this.setState({category_data : getData.data})
    }

    _selectCategoryData = async (board_id) => {
        
        let category = document.getElementsByName('select_category')[0].value;

        if(board_id) {
            const getData = await axios('/get/board_data', {
                method : 'POST',
                headers : new Headers(),
                data : { id : board_id }
            });
            console.log(getData);
            return  this.setState({ select_category : getData.data.data[0].cat_id });
        }
        this.setState({
            select_category : category
        })
    }


    render(){
        const {login, admin, user_ip, login_modal, data, date, board_id,
        list_data, list_all_page, list_search, list_page, user_id, like_num, like_exist, pre_view, next_view, category_data, select_category
        } = this.state;

        const {_login, _logout, _toggleModal, _getSearch, _changePage, _changeCategory, _getPreAndNextData, _getLikeExist, _getAllLike, _getData, _selectCategoryData} = this;
        return(
            <div>
                <div>
                    <Head
                        login = {login}
                        admin = {admin}
                        user_ip = {user_ip}
                        _login = {_login}
                        _logout = {_logout}
                        login_modal = {login_modal}
                        _toggleModal = {_toggleModal}
                    />
                </div>

                <div>
                    <Main
                        admin = {admin}
                        user_ip = {user_ip}
                        login = {login}
                        login_modal = {login_modal}
                        _toggleModal = {_toggleModal}
                        _getSearch = {_getSearch}
                        list_data = {list_data}
                        list_all_page = {list_all_page}
                        list_search = {list_search}
                        list_page = {list_page}
                        _changePage = {_changePage}
                        _changeCategory = {_changeCategory}
                        user_id = {user_id}
                        data = {data}
                        date = {date}
                        board_id = {board_id}
                        like_num = {like_num}
                        like_exist = {like_exist}
                        _getAllLike = {_getAllLike}
                        pre_view = {pre_view}
                        next_view = {next_view}
                        _getPreAndNextData = {_getPreAndNextData}
                        _getLikeExist = {_getLikeExist}
                        _getData = {_getData}
                        category_data = {category_data}
                        select_category = {select_category}
                        _selectCategoryData = {_selectCategoryData}
                    />
                </div>
            </div>
        );
    }
}

export default App;