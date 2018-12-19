import React, { Component } from 'react';
import {Route,Link, withRouter} from 'react-router-dom';
import {DropdownButton, MenuItem} from "react-bootstrap";
import './App.css';
import "./bootstrap/dist/css/bootstrap.css";
import 'bootstrap/dist/js/bootstrap.min.js';
import Signin from './components/Signin';
import Login from './components/Login';
import Profile from "./components/Profile";
//import Main from "./components/Main";
import Homes from "./components/Homes";
import Modal from "react-modal";
//import axios from 'axios';


const routeConfig = [
    {
        path:'/',
        public:  Login,
        private: Homes
    },
    {
        path:'/login',
        public: Login ,
        private: Homes
    },
    {
        path:'/signin',
        public: Signin,
        private: Homes
    },
    {
        path:'/homes',
        private: Homes,
        public: Login,
    },
    {
        path:'/profile',
        private: Profile,
        public: Login
    },
];

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

let isLogged = false;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalIsOpen: false,
            // navMenu:'Навигация',
            // home:'',
            // profile:'',
        };
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    openModal() {
        this.setState({modalIsOpen: true});
    }

    closeModal() {
        this.setState({modalIsOpen: false});
    }

    changePath(index,e){
        let path = e.target.innerHTML;
        switch (path) {
            case 'Главная':
                this.props.history.push('/');
                break;
            case 'Дома' :
                this.props.history.push('/homes');
                break;
            case 'Профиль' :
                this.props.history.push('/profile');
                break;
            default:
        }
    }

    renderRoutesWithLoginCheck() {

        return routeConfig
            .filter((item) => isLogged ? item.hasOwnProperty('private') : item.hasOwnProperty('public'))
            .map((item, index) =>
                <Route key={index} exact path={item.path} component={isLogged ? item.private : item.public}/>
            );
    }



    render() {
        const path = this.props.location.pathname;
        const homeClass = path === "/homes" ? "active" : "";
        const profileclass = path === "/profile" ? "active" : "";
        let navmenu = 'Навигация';
        if (path === "/homes") {navmenu = "Дома"}
        if (path === "/profile") {navmenu = "Профиль"}

        isLogged = !!localStorage.getItem('token');

        return (
            <div>
                    <nav className="navbar">
                        <div className="collapse navbar-collapse navbar-static-top" id="navbarSupportedContent">
                            <ul className="nav navbar-nav navbar-collapse">
                                {/*<li> {isLogged ? <Link to="/">Главная</Link> : null}</li>*/}
                                <li> {isLogged ? <Link to="/homes" className = {homeClass} >Дома</Link> : null} </li>
                                <li> {isLogged ? <Link to="/profile" className = {profileclass}>Профиль</Link> : null} </li>
                                <li> {isLogged ? <Link to="#/" onClick={() => {
                                    this.openModal()}} > Выход</Link> : null} </li>
                            </ul>
                        </div>

                        {isLogged ?
                            <DropdownButton
                            className="navigation"
                            data-toggle="collapse"
                            title = {navmenu}
                            id={`dropdown-nav`}
                            caret=''
                            onSelect={(index,e) => {this.changePath(index,e)}}
                        >
                            {/*{isLogged ? <MenuItem >Главная</MenuItem> : null}*/}
                            {isLogged ? <MenuItem >Дома</MenuItem> : null}
                            {isLogged ? <MenuItem >Профиль</MenuItem> : null}
                            {isLogged ? <MenuItem  onClick={() => {this.openModal()
                            }}> Выход</MenuItem> : null}

                        </DropdownButton>: null}
                    </nav>

                {this.renderRoutesWithLoginCheck()}

                <Modal
                    isOpen={this.state.modalIsOpen}
                    onRequestClose={this.closeModal}
                    style={customStyles}
                    contentLabel="Password Change"
                >
                    <form>
                        <h3>Вы уверены что хотите выйти?</h3>
                        <span className="glyphicon glyphicon-ok modalGlyph"
                              data-toggle="tooltip" data-placement="top" title="Выйти"
                              onClick={(e) => {
                                  localStorage.clear();
                                  this.closeModal()
                              }}/>
                        <span className="glyphicon glyphicon-remove modalGlyph"
                              data-toggle="tooltip" data-placement="top" title="Остаться"
                              onClick={this.closeModal}/>
                    </form>
                </Modal>

            </div>
        );
    }
}

export default withRouter (App);
