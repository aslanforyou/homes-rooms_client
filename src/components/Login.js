import React, { Component } from 'react';
import {Link} from 'react-router-dom';
//import {push} from 'react-router-dom';
import axios from 'axios';

import 'rc-progress/assets/index.css';
import { Line, } from 'rc-progress';

import 'rc-notification/assets/index.css';
import Notification from 'rc-notification';
let notification = null;
Notification.newInstance({}, (n) => notification = n);

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            error: 'form-control',
            emailerror: 'form-control',
            // current:'current',
            token:'',
            progress:'hidden',
            percent: 0,
        };
        this.progressBar = this.progressBar.bind(this);
    };

    handleUserInput = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        this.setState({[name]: value});
        this.setState({error: 'form-control'});
        this.setState({emailerror: 'form-control'});
        notification.removeNotice(1);
    };

    logIn(e) {
        notification.removeNotice(1);
        if (this.state.email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)){
            e.preventDefault();
            if (this.state.password) {
                this.setState({progress: 'visible'});
                this.progressBar();
                axios.post('/user/login', {
                    //token: localStorage.getItem('token'),
                    username: this.state.email,
                    password: this.state.password.trim(),
                })
                    .then((response) => {
                        if (response.data.data === 'yes') {
                            console.log('Login accepted');
                            localStorage.setItem('token', response.data.token);
                            clearTimeout(this.tm);
                            this.props.history.push('/profile');
                        }
                        if (response.data === 'no') {
                            console.log('Login NOT accepted');
                            this.notifyError('Такой адрес не зарегистрирован!');
                            clearTimeout(this.tm);
                            this.setState({progress: 'hidden', percent:100});
                        }
                        if (response.data === 'wrong psw') {
                           // console.log('...');
                             this.notifyError('Не правильный пароль');
                            this.setState({error: 'form-control has-error'});
                            clearTimeout(this.tm);
                            this.setState({progress: 'hidden', percent:100 });
                        }

                    })
                    .catch(function (error) {
                        //console.log(error);
                        console.log(error.response.data);
                    });
            }
            else{this.setState({error: 'form-control has-error', percent:100});}

        }
        else {
            this.setState({emailerror: 'form-control has-error', percent:100});
            this.notifyError('Такой адрес не зарегистрирован или введен неверно!');
            e.preventDefault();
        }
    }

    routeChange() {
        this.props.history.push('/profile');
    }

    notifyError(e) {
        notification.notice({
            content: <span>{e}</span>,
            duration: 3,
            maxCount: 0,
            key: 1,
            // onClose() {},
        });
    }
    progressBar() {
        let percent = this.state.percent + 1;
        if (percent >= 100 ) {
            clearTimeout(this.tm);
            percent = 1;
            this.setState({ percent:0, });
            return;
        }

        this.setState({ percent:percent, });
        this.tm = setTimeout(this.progressBar, 25);
    }

    render() {

        return (
            <div className="Myapp">
                <div className="col-sm-1">
                </div>
                <div className="col-sm-10">
                <form className="form-signin">
                    <h2  className="form-signin-heading">
                        <Link to={`/login`} id="link" className='current'>Войти</Link>
                        /
                        <Link to={`/signin`} id="link" className="" >Регистрация</Link>
                        <Line percent={this.state.percent} className={this.state.progress} strokeWidth="1" strokeColor={"#67dca3"} trailColor={"rgba(255, 255, 255, .0)"} />
                    </h2>

                    <input type="email" id="loginEmail" className={this.state.emailerror}
                           placeholder="Эл. почта" name="email"
                           required="1" autoFocus="1"
                           value={this.state.email} onChange={this.handleUserInput}/>
                    {/*<div className="emailCheck" id="emailCheck">*/}
                        {/*/!*<p>Такой адрес не зарегистрирован или введен неверно!</p>*!/*/}
                    {/*</div>*/}
                    <input type="password" id="loginPassword" className={this.state.error}
                           placeholder="Пароль" name="password"
                           required="1" value={this.state.password}
                           onChange={this.handleUserInput}/>
                    <button className="btn-sm  btn-block btn-login" type="submit"
                            onClick={(e) => {this.logIn(e)}}>Войти
                    </button>

                </form>
                </div>
                <div className="col-sm-1">
                </div>

            </div>
        );
    }
}

export default Login;