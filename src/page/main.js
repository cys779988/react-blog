import React, {Component} from 'react';
import {Route, Link, Switch} from 'react-router-dom';
import {List, Write, View, Signup} from './index.js';
import { Right_Write } from './right/index.js'; 
import { Category } from './left/index.js'; 

import './main.css';

class main extends Component {
    constructor(props) {
        super(props)
        this.state = {
            category : '',
            category_change : false,
            contents : ""
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

    _getContents = (val) => {
        const contents = val.trim();
        this.setState({contents : contents});

    }
    render(){
        const {_changeState, _getContents} = this;
        const {login, admin, user_ip, list_data, list_all_page, list_search, list_page, _changePage, _changeCategory} = this.props;
        const {contents} = this.state;

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
                    <Route path='/signup' component={Signup}/>
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


                    <Route path='/write' component={this._withProps(Write, {_getContents : _getContents, contents : contents})}/>
                    <Route path='/view/:data' component={View}/>
                </div>
                <div id='Mains-right'>
                    <Route path='/write' component={this._withProps(Right_Write, {contents : contents})}/>
                </div>
            </div>
        );
    }
}

export default main;