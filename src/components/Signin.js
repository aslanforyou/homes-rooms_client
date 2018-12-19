import React, { Component } from 'react';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {Link} from "react-router-dom";
import {DropdownButton, MenuItem} from "react-bootstrap";
import axios from 'axios';

import 'rc-progress/assets/index.css';
import { Line, } from 'rc-progress';

import 'rc-notification/assets/index.css';
import Notification from 'rc-notification';

let notification = null;
Notification.newInstance({}, (n) => notification = n);


class Signin extends Component {
    constructor() {
        super();
        this.state = {
            email:'',
            password:'',
            confirmpsw:'',
            error:'form-control',
            emailerror:'form-control',
            ageerror:'form-control',
            age:'',
            gender:'Пол (не обязательно)',
            agecheck:'none',
            progress:'hidden',
            pswwrong:'none',
            exist: 'hidden',
            percent: 0,
        };
        this.progressBar = this.progressBar.bind(this);
    }

    handleUserInput = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        this.setState({[name]: value});
        this.setState({error: 'form-control',pswwrong :'none'});
        this.setState({emailerror: 'form-control',exist: 'hidden'});

    };

    handleUserInputAge = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        this.setState({[name]: value,
            error: 'form-control',
            ageerror: 'form-control',
            agecheck:'none'
        });
    };

    signIn (e) {


        if(!!this.state.password.trim()) {
            if (this.state.email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
                if (this.state.email && this.state.password && this.state.confirmpsw) {
                    if (this.state.confirmpsw !== this.state.password) {
                        this.setState({error: 'form-control has-error'});
                        this.pswerror('Пароли не совпадают!');
                        e.preventDefault();
                    }
                    else {
                        let gender = (this.state.gender === 'Пол (не обязательно)' ? ' - ': this.state.gender)
                        this.setState({error: 'form-control'});
                        this.setState({emailerror: 'form-control'});
                        if (!(isNaN(this.state.age)) || this.state.age.length === 0) {

                            this.setState({progress: 'visible'});
                            this.progressBar();
                            axios.post('/user/', {
                                username: this.state.email,
                                password: this.state.password.trim(),
                                gender: gender,
                                age: this.state.age
                            })
                                .then((response) => {
                                    console.log(response.data.data);
                                    if (response.data.data === 'yes') {
                                        clearTimeout(this.tm);
                                        this.props.history.push('/login');
                                    }
                                    if (response.data.data === 'exists') {
                                        // alert('You already exist, updated!');
                                        this.setState({exist: ' ', progress: 'hidden', percent:100  });
                                        this.notify();
                                        setTimeout(()=>{this.props.history.push('/login') }, 5000);

                                    }
                                })
                                .catch(function (error) {
                                  //  console.log(error);
                                    console.log(error.response.data);
                                });
                        }
                        else {
                            this.setState({
                                ageerror: 'form-control has-error',
                                agecheck: 'visible'
                            });


                            e.preventDefault();
                        }
                        e.preventDefault();
                    }
                }
            }
            else {
                this.setState({emailerror: 'form-control has-error'});
                e.preventDefault();
            }
        }
        else {
            this.pswerror('Пароль пуст или содержит только пробелы!');
            this.setState({editablePsw: "form-control has-error", error: 'form-control has-error',/*pswwrong: '',*/});
            e.preventDefault();
        }
    }

    genderChange(index,e) {
        this.setState({gender : e.target.innerHTML});
    }

    notify = () => {

        toast.warn("Вы уже зарегистрированы! Войдите под своим именем", {
            position: toast.POSITION.TOP_CENTER,
            pauseOnFocusLoss: false,
            closeButton: false,
        });
    };

    pswerror(e) {
        notification.notice({
            content: <span>{e}</span>,
            duration: 3,
            onClose() {
                console.log(e);
            },
        });
    }

    progressBar() {

        let percent = this.state.percent + 1;
        if (percent >= 100 ) {
            clearTimeout(this.tm);
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
                <form className= "form-signin">
                    <h2 className="form-signin-heading">
                        <div>
                                    <ToastContainer closeOnClick transition={Slide}/>
                        </div>
                        {/*<span className={"h5 alert  "+ this.state.exist}></span>*/}
                        <Link to={`/login`} id="link" className="">Войти</Link>
                        /
                        <Link to={`/signin`} id="link" className='current'>Регистрация</Link>
                        <Line percent={this.state.percent} className={this.state.progress} strokeWidth="1" strokeColor={"#67dca3"} trailColor={"rgba(255, 255, 255, .0)"} />
                    </h2>
                    <label htmlFor="inputEmail" className="sr-only">Эл. почта</label>
                    <input type="email" id="inputEmail" className={this.state.emailerror}
                           placeholder="Эл. почта" name="email"
                           required="1" autoFocus="1"
                           value={this.state.email} onChange={this.handleUserInput} />
                    <label htmlFor="inputPassword" className="sr-only">Пароль</label>
                    <input type="password" id="inputPassword" className={this.state.error}
                           placeholder="Пароль" name="password"
                           required="1" value={this.state.password}
                           onChange={this.handleUserInput} />
                    <input type="password" id="inputPassword2" className={this.state.error}
                           placeholder="Подтвердить пароль" name="confirmpsw"
                           required="1" value={this.state.confirmpsw}
                           onChange={this.handleUserInput} />
                    <span className={'h6 '+ this.state.pswwrong}>Пароль не может состоять только из пробелов</span>
                    <input type="age" id="inputUage" className={this.state.ageerror}
                           placeholder="Возраст (не обязательно)" name="age"
                           required="" value={this.state.age}
                           onChange={this.handleUserInputAge}/>
                    <div className={this.state.agecheck} id="ageCheck">
                        <p>Возраст должен быть введен только цифрами!</p>
                    </div>
                    <DropdownButton
                        className = "form-control gender"
                        bsStyle="default"
                        title={this.state.gender}
                        id={`dropdown-genderr`}
                        onSelect={(index,e) => {this.genderChange(index,e)}}>

                        <MenuItem eventKey={1} key={1}>Мужской</MenuItem>
                        <MenuItem eventKey={2} key={2}>Женский</MenuItem>
                        <MenuItem eventKey={3} key={3}> - </MenuItem>
                    </DropdownButton>
                    <button className="btn-sm  btn-danger btn-block" type="submit"
                            onClick={(e) => {this.signIn(e)}}>Зарегистрироваться</button>

                </form>
                </div>
                <div className="col-sm-1">
                </div>

            </div>
        );
    }
}

export default Signin;