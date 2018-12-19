import React, { Component } from 'react';
import Modal from 'react-modal';

import 'rc-progress/assets/index.css';
import { Line, } from 'rc-progress';

import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {DropdownButton, MenuItem} from "react-bootstrap";
//import {Link} from "react-router-dom";
//import {push} from 'react-router-dom';
import axios from 'axios';

import 'rc-notification/assets/index.css';
import Notification from 'rc-notification';
let notification = null;
Notification.newInstance({}, (n) => notification = n);


const customStyles = {
    content : {
        top                   : '225px',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        // marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)',
        background            : 'linear-gradient(135deg, #486B8A 0%, #53e3a6 100%)',
    }
};
Modal.setAppElement('#root')

class Profile extends Component {
    constructor() {
        super();
        this.state = {
            email:'' ,
            password:"",
            confirmpsw:"",
            age:'',
            gender:' - ',
            emailerror:'form-control visi none',
            readOnly: true,
            editable:"form-control visi none",
            readOnlyPsw: "",
            editablePsw:"form-control visi",
            modalIsOpen: false,
            modalIsOpenDel: false,
            ageerror: "form-control visi none",
            agecheck:'none',
            token: localStorage.getItem('token'),
            editProfile:'glyphicon glyphicon-pencil editProfile',
            okProfile: 'glyphicon glyphicon-ok okProfile' ,
            cancelProfile:'glyphicon glyphicon-remove cancelProfile',
            changePsw: 'glyphicon glyphicon-lock changePsw',
            delMe:'glyphicon glyphicon-trash delMe',
            delBtn:'delBtn',
            progress: 'visible',
            pswwrong:'none',
            pswwrongmatch: 'none',
            pswwrongempty:'none',
            exist: 'none',
            percent: 1,
        };
        this.openModal = this.openModal.bind(this);
        this.openModaldel = this.openModaldel.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.progressBar = this.progressBar.bind(this);
    }

    openModal() {
        this.setState({modalIsOpen: true,password:'',
            confirmpsw:'',});
    }
    openModaldel(e) {
        e.preventDefault();
        this.setState({modalIsOpenDel: true});
    }

    closeModal() {
        this.setState({
            modalIsOpen: false,
            modalIsOpenDel: false,
            editablePsw: 'form-control visi',
            password: '',
            confirmpsw: ''
        });
        this.cancelEdit();
    }

    handleUserInput = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        this.setState({[name]: value, agecheck:'none'});
        if (name ==="password"|| name ==="confirmpsw"){
            this.setState({editablePsw:'form-control', pswwrong: 'none',pswwrongmatch: 'none',pswwrongempty: 'none',});
        }
        else{this.setState({emailerror: 'form-control', pswwrong: 'none',pswwrongmatch: 'none',pswwrongempty: 'none',});}
    };

    saveProfile (e) {
        this.setState({
            progress: 'visible',
            email: this.state.email.trim(),
            age: this.state.age.trim(),
        });
        this.progressBar();
        if (this.state.email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {

            if (!(isNaN(this.state.age)) || this.state.age === ' - ') {
           //     this.setState({emailerror: 'form-control'});
                this.setState({readOnly: '1',
                    editable: 'form-control visi none',
                    emailerror: 'form-control visi none',
                    ageerror: 'form-control visi none',
                    editProfile:'glyphicon glyphicon-pencil editProfile visible onupdate',
                    changePsw: 'glyphicon glyphicon-lock changePsw onupdate',
                    delMe:'glyphicon glyphicon-trash delMe onupdate',
                    okProfile: 'glyphicon glyphicon-ok okProfile hidden',
                    cancelProfile: 'glyphicon glyphicon-remove cancelProfile hidden',
                    delBtn: 'delBtn',

                });

                axios.put('/user/?token='+localStorage.getItem('token'),
                    {
                    "username": this.state.email,
                    "age":this.state.age,
                    "gender":this.state.gender
                })
                    .then((response) => {
                        if (this.state.email!==localStorage.getItem('email')){
                            localStorage.setItem('token','');
                            this.setState({
                                progress: 'hidden', percent:100 ,});
                            this.notify();
                            // this.props.history.push('/login');
                        }
                        else {
                            this.setState({
                                progress: 'hidden',  percent:100 ,
                                editProfile: 'glyphicon glyphicon-pencil editProfile',
                                changePsw: 'glyphicon glyphicon-lock changePsw',
                                delMe: 'glyphicon glyphicon-trash delMe',

                            });

                            localStorage.setItem('email', this.state.email);
                            localStorage.setItem('age', this.state.age);
                            localStorage.setItem('gender', this.state.gender);
                        }

                        //localStorage.setItem('token',response.data.token);
                    })
                    .catch((error) => {
                        console.log(error.response.data.message);
                        // alert ('Пользователь с таким именем существует!')
                        this.setState({
                            progress: 'hidden',percent:100,
                            exist: '',
                            editProfile: 'glyphicon glyphicon-pencil editProfile',
                            changePsw: 'glyphicon glyphicon-lock changePsw',
                            delMe: 'glyphicon glyphicon-trash delMe',
                        });
                        this.emailerr('Пользователь с таким именем существует!');
                        this.cancelEdit();
                    });
            }
            else{
                this.setState({ageerror: 'form-control has-error', agecheck: 'visible',progress:'hidden',percent:100,});

                e.preventDefault();
            }
            e.preventDefault();
        }
        else{
            this.setState({emailerror: 'form-control has-error', progress:'hidden',percent:100, });
            e.preventDefault();
        }
    }
    savePsw (e) {
        if(!!this.state.password.trim()) {
            if (this.state.password && this.state.confirmpsw && (this.state.password === this.state.confirmpsw)) {
                e.preventDefault();
                this.setState({editablePsw: 'form-control visi', modalIsOpen: false});
                this.setState({
                    progress: 'visible',
                    editProfile: 'glyphicon glyphicon-pencil editProfile visible onupdate',
                    changePsw: 'glyphicon glyphicon-lock changePsw onupdate',
                    delMe: 'glyphicon glyphicon-trash delMe onupdate',
                });
                this.progressBar();
                axios.put('/user/pass?token=' + this.state.token, {
                    password: this.state.password.trim(),
                })
                    .then((response) => {
                        this.setState({
                            progress: 'hidden',percent:100,
                            editProfile: 'glyphicon glyphicon-pencil editProfile',
                            changePsw: 'glyphicon glyphicon-lock changePsw',
                            delMe: 'glyphicon glyphicon-trash delMe',
                        });
                    })
                    .catch(function (error) {
                        //console.log(error);
                        console.log(error.response.data);

                    });
            }
            else {
                this.setState({editablePsw: "form-control has-error",pswwrongmatch: '',});
                e.preventDefault();
            }
        }
        else {
            this.setState({editablePsw: "form-control has-error", pswwrongempty: '',});
            e.preventDefault();
        }
    }

    progressBar() {

        let percent = this.state.percent + 1;
        if (percent >= 100 ) {
            clearTimeout(this.tm);
            this.setState({ percent:0, });
            return;
        }
        let int = percent/1.5+9;
        this.setState({ percent });
        this.tm = setTimeout(this.progressBar, int);
    }

    edit (e) {
        this.setState({
            readOnly: '',
            editable: 'form-control edit',
            emailerror: 'form-control edit',
            ageerror: 'form-control edit',
            editProfile:'glyphicon glyphicon-pencil editProfile onupdate',
            okProfile: 'glyphicon glyphicon-ok okProfile visible' ,
            cancelProfile:'glyphicon glyphicon-remove cancelProfile visible',
            delBtn:'',
        });

        if (!localStorage.getItem('age')){this.setState({age:''})}
        e.preventDefault();
    }

    delMe (e){
        axios.delete('/user/?token='+this.state.token)
            .then((response) => {
                if (response.data ==='deleted')
                console.log('Bye bye!');
            })
            .catch(function (error) {
                console.log(error.response.data);
            });
        this.setState({
            token: "",
        });
        localStorage.setItem('token','');
        this.props.history.push('/login');

        e.preventDefault();
    }
    cancelEdit ()
    {
        this.setState({
            readOnly: '1',
            editable: 'form-control visi none',
            emailerror: 'form-control visi none',
            ageerror: 'form-control visi none',
            editProfile:'glyphicon glyphicon-pencil editProfile visible',
            okProfile: 'glyphicon glyphicon-ok okProfile hidden' ,
            cancelProfile:'glyphicon glyphicon-remove cancelProfile hidden',
            delBtn:'delBtn',
            email: localStorage.getItem('email'),
            age: localStorage.getItem('age'),
            gender: localStorage.getItem('gender'),
            agecheck: 'none',
        });
        if (!localStorage.getItem('age')){this.setState({age:' - '})}
    }

    genderChange(index,e) {
        this.setState({gender : e.target.innerHTML});
    }


    componentDidMount() {

        this.setState({
            editProfile:'glyphicon glyphicon-pencil editProfile hidden',
            changePsw: 'glyphicon glyphicon-lock changePsw hidden',
            delMe:'glyphicon glyphicon-trash delMe hidden',
        });
        this.progressBar();
            axios.get('/user/?token='+this.state.token)
            .then((response) => {
                this.setState({
                    email: response.data.username,
                    age: response.data.age,
                    gender: response.data.gender,
                });

                this.setState({progress: 'hidden',percent:100,});
                if (!this.state.age){
                    this.setState({age: " - "});
                }

                localStorage.setItem('email', response.data.username);
                localStorage.setItem('age', response.data.age);
                localStorage.setItem('gender', response.data.gender);
                if (this.state.gender === 'Пол (не обязательно)'){
                    this.setState({gender: ' - '});
                    localStorage.setItem('gender',' - ');
                }

                this.setState({
                    editProfile:'glyphicon glyphicon-pencil editProfile visible',
                    changePsw: 'glyphicon glyphicon-lock changePsw visible',
                    delMe:'glyphicon glyphicon-trash delMe visible',
                });
            })
            .catch((error) => {
                localStorage.setItem('token','');
                this.props.history.push('/login');
                console.log(error.response.data);
                //console.log(error);
            });
    }

    notify = () => {

        toast.info("Вы сменили почту. Войдите под новым именем. Выход будет произведен автоматически", {
            position: toast.POSITION.TOP_CENTER,
            pauseOnFocusLoss: false,
            closeButton: false,
            onOpen: console.log('...'),
            onClose: () => this.props.history.push('/login'),
        });

    };

    emailerr(e) {
        notification.notice({
            content: <span className={"reddd"}>{e}</span>,
            duration: 2.2,
            style:{
                top: '12em',
                right: '50%',
            }
        });
    }

    render() {

        return (

            <div className="profile">

                <div className="col-sm-1">
                </div>
                <div className="col-sm-10">

                <form className="form">
                    <Line percent={this.state.percent} className={this.state.progress} strokeWidth="1" strokeColor={"#38cda4"} trailColor={"rgba(255, 255, 255, .0)"} />
                <h3 className="text">Настройки профиля
                    <span className= {this.state.editProfile} id="editProfile"
                          data-toggle="tooltip" data-placement="top"
                          title="Редактировать профиль"
                          onClick={(e) => {this.edit(e)}}/>

                    <span className={this.state.changePsw} id="changePsw"
                          data-toggle="tooltip" data-placement="top"
                          title="Сменить пароль"
                          onClick={this.openModal}/>
                    <span className={this.state.delMe} id="trash"
                          data-toggle="tooltip" data-placement="top"
                          title="Удалиться"
                          onClick={(e) => {this.openModaldel(e)}}/>
                </h3>
                    <div className="form-group ">
                            <label htmlFor="inputEmail3" className="">Эл. почта</label>
                            <label className="">{this.state.email}</label>
                            <input type="email" className={this.state.emailerror + " "} id="inputEmail3"
                                   placeholder="Email address" required="1" name="email" readOnly={this.state.readOnly}
                                   value={this.state.email} onChange={this.handleUserInput}/>
                    </div>
                    <div className="form-group ">
                            <label htmlFor="profage" className="">Возраст</label>
                            <label className="">{this.state.age}</label>
                            <input type="age" className={this.state.ageerror + " " } id="profage" placeholder="возраст"
                                   name="age" readOnly={this.state.readOnly}
                                   value={this.state.age} onChange={this.handleUserInput}/>
                        <div className={this.state.agecheck} id="ageCheck">
                            <p>Возраст должен содержать только цифры!</p>
                        </div>
                    </div>
                    <div className="form-group ">
                            <label className="">Пол</label>
                            <label className="">{this.state.gender}</label>

                            <DropdownButton
                                className = {this.state.editable + " " + this.state.edit}
                                disabled= {this.state.readOnly ? true:false}
                                bsStyle="default"
                                title={this.state.gender}
                                id={`dropdown-gender`}
                                onSelect={(index,e) => {this.genderChange(index,e)}}
                            >
                                <MenuItem eventKey={1} key={1}>Мужской</MenuItem>
                                <MenuItem eventKey={2} key={2}>Женский</MenuItem>
                                <MenuItem eventKey={3} key={3}> - </MenuItem>

                            </DropdownButton>

                        <div>
                            <ToastContainer closeOnClick transition={Slide}/>
                        </div>
                        {/*<h3 className={"h4 "+ this.state.exist}>Пользователь с таким именем существует!</h3>*/}

                        <div className="form-group">
                        <span className={this.state.okProfile} id="okProfile"
                              data-toggle="tooltip" data-placement="top"
                              title="Сохранить"
                              onClick={(e) => {this.saveProfile(e)}}/>
                        <span className={this.state.cancelProfile} id="cancelProfile"
                              data-toggle="tooltip" data-placement="top"
                              title="Отмена"
                              onClick={() => {this.cancelEdit()}}/>
                        </div>

                        {/*<button className={"btn btn-warning "+this.state.delBtn} onClick={(e) => {this.openModaldel(e)}}>Хочу удалиться</button>*/}
                        {/*<div className={"lds-roller abs "+this.state.progress}>*/}
                            {/*<div></div>*/}
                            {/*<div></div>*/}
                            {/*<div></div>*/}
                            {/*<div></div>*/}
                            {/*<div></div>*/}
                            {/*<div></div>*/}
                            {/*<div></div>*/}
                            {/*<div></div>*/}
                        {/*</div>*/}
                    </div>

                <div>
                    <Modal
                        isOpen={this.state.modalIsOpen}
                        onRequestClose={this.closeModal}
                        style={customStyles}
                        contentLabel="Смена пароля"
                    >
                        <form>
                            <h3>Смена пароля</h3>

                            <div className="form-group">
                                    <label htmlFor="profpsw" className="">Пароль</label>
                                    <input type="password" className={this.state.editablePsw} id="profpsw"
                                           placeholder="Новый пароль" name="password" required="1" readOnly={this.state.readOnlyPsw}
                                           value={this.state.password} onChange={this.handleUserInput}/>
                            </div>
                                <div className="form-group">
                                        <label htmlFor="confirmpsw" className="">Подтвердить</label>
                                        <input type="password" id="confirmpsw" className={this.state.editablePsw}
                                               placeholder="Подтвердить пароль" name="confirmpsw"
                                               readOnly={this.state.readOnlyPsw}
                                               required="1" value={this.state.confirmpsw}
                                               onChange={this.handleUserInput}/>
                                    <span className={'h6 '+ this.state.pswwrong}>Пароль не может состоять только из пробелов</span>
                                    <span className={'h6 '+ this.state.pswwrongmatch}>Пароли не совпадают</span>
                                    <span className={'h6 '+ this.state.pswwrongempty}>Пароль не может быть пустым или состоять из пробелов</span>
                                </div>

                                <span className="glyphicon glyphicon-ok modalGlyph"
                                      data-toggle="tooltip" data-placement="top" title="Сохранить пароль"
                                      onClick={(e) => {this.savePsw(e)}}/>
                                <span className="glyphicon glyphicon-remove modalGlyph"
                                      data-toggle="tooltip" data-placement="top" title="Отмена"
                                      onClick={this.closeModal}/>
                        </form>
                    </Modal>
                    <Modal
                        isOpen={this.state.modalIsOpenDel}
                        onRequestClose={this.closeModal}
                        style={customStyles}
                        contentLabel="Подтверждение удаления"
                    >
                        <form>
                            <h3>Подтвердите удаление пользователя</h3>

                            <div className="form-group">
                            <span className="glyphicon glyphicon-ok modalGlyph"
                                  data-toggle="tooltip" data-placement="top" title="Подтверждаю"
                                  onClick={(e) => {this.delMe(e)}}/>
                            <span className="glyphicon glyphicon-remove modalGlyph"
                                  data-toggle="tooltip" data-placement="top" title="Нет, передумал"
                                  onClick={this.closeModal}/>
                            </div>
                        </form>
                    </Modal>
                </div>
                </form>
                </div>
                <div className="col-sm-1">
                </div>
            </div>
        );
    }
}

export default Profile;