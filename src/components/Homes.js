import React, {Component} from 'react';
// import homes from './home-list.js';
import {DropdownButton, MenuItem} from 'react-bootstrap';
import axios from 'axios';
import Modal from "react-modal";
// import Line from "rc-progress/es/Line";
import 'rc-progress/assets/index.css';
import { Line, } from 'rc-progress';

import 'rc-notification/assets/index.css';
import Notification from 'rc-notification';
let notification = null;
Notification.newInstance({}, (n) => notification = n);

let homes = [];
let rooms = [];

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

class Homes extends Component {
    constructor(props) {
        super();
        this.state = {
            myrooms: [],
            nameHome: "Введите новое имя ниже",
            nameRoom: "создайте комнату",
            homeedit: "",
            roomedit: "",
            homeindex: "0",
            roomindex: "0",
            homeId: '',
            roomId: '',
            delhome: 'onupdate',
            delroom: 'onupdate',
            down: '',
            delhometitle: 'Добавить дом',
            downroom: '',
            delroomtitle: 'Добавить комнату',
            progress: 'visible',
            savehome: 'hidden',
            saveroom: 'hidden',
            roomstatus:'',
            homeerr:'',
            roomerr:'',
            homelist:'',
            roomlist:'',
            modalIsOpen: false,
            todelete:'',
            percent: 0,
        };
        this.homeChange = this.homeChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeRoom = this.handleChangeRoom.bind(this);
        this.handleClickHome = this.handleClickHome.bind(this);
        this.handleClickRoom = this.handleClickRoom.bind(this);
        this.gettingHomes = this.gettingHomes.bind(this);
        this.gettingRooms = this.gettingRooms.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.progressBar = this.progressBar.bind(this);
    }
    openModal(e) {
        this.setState({modalIsOpen: true,
        todelete: e});
    }

    closeModal() {
        this.setState({
            modalIsOpen: false,
        });

    }

    componentDidMount() {
        this.gettingHomes();
    }


    handleChange(event) {
        this.setState({
            homeedit: event.target.value,
            savehome: 'visible',
            homeerr: '' ,
        });
    }

    homeChange(index) {
        this.setState({
            nameHome: homes[index].homeName,
            homeedit: homes[index].homeName,
            homeindex: index,
            nameRoom: "создайте комнату",
            roomedit: "",
            homeId: homes[index]._id,
            homeerr: '' ,
            savehome: 'hidden',
            saveroom: 'hidden',
        });
        this.gettingRooms(homes[index]._id);
    }

    gettingHomes() {
        this.setState({
            progress: 'visible',
            roomlist: 'blocked',
            homelist: 'blocked',
        });
        this.progressBar();
        axios.get('/homes/?token=' + localStorage.getItem('token'))
            .then((response) => {
                if (response.data.homes.length === 0) {
                    homes = [];
                    this.setState({
                        nameHome: "Введите новое имя ниже",
                        nameRoom: "создайте комнату",
                        homeedit: '',
                        delhome: 'onupdate',
                        delroom: 'onupdate',
                        downroom: 'onupdate',
                        progress: 'hidden',
                        roomstatus: 'onupdate',
                        homelist: 'blocked ',
                       // homeerr: 'onupdate',
                        // down: 'glow',
                        percent:100,
                    });
                }
                else {
                    homes = response.data.homes;
                    this.setState({
                        homeId: homes[0]._id,
                        delhome: '',
                        progress: 'hidden',
                        roomstatus: '',
                        homelist: ' ',
                        homeerr: ' ',
                        down: '',
                        // percent:100,
                    });
                    this.homeChange(0);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }


    handleClickHome(e) {
        if (!this.state.homeedit.trim()) {
            this.setState({
               homeerr: 'has-error' ,
            });
          //  alert("enter something")
        }
        else {
            this.progressBar();
            this.setState({
                progress: 'visible',
                savehome: 'hidden',
            });
            axios.post('/homes/?token=' + localStorage.getItem('token'), {
                homeName: this.state.homeedit.trim(),
                homeId: this.state.homeId,
            })
                .then((response) => {
                    if (response.data === 'yes') {
                        this.setState({
                            homeId: response.data,
                            delhome: '',
                            down: '',
                            downroom: '',
                            roomstatus: '',
                            savehome: 'hidden',
                            saveroom: 'hidden',
                            homelist: ' ',
                            homeerr: ' ',
                            homeedit:this.state.homeedit.trim(),
                        });
                        homes[this.state.homeindex].homeName = this.state.homeedit;
                        this.homeChange(this.state.homeindex);
                    }
                    else {
                        this.setState({
                            homeId: response.data,
                            delhome: '',
                            down: '',
                            downroom: '',
                            roomstatus: '',
                            savehome: 'hidden',
                            saveroom: 'hidden',
                            homelist: ' ',
                            homeerr: ' ',
                            homeedit:this.state.homeedit.trim(),
                        });
                        homes.push({_id: response.data, homeName: this.state.homeedit});
                        this.homeChange(homes.length - 1);
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }

    newHome(e) {
        // console.log(!this.state.down);
        if (!this.state.down||this.state.down==='glow') {
            this.setState({
                nameHome: "Введите новое имя ниже",
                homeedit: '',
                homeId: '',
                roomId: '',
                down: ' down ',
                delhometitle: 'Отменить',
                delhome: 'onupdate',
                downroom: 'onupdate',
                delroom: 'onupdate',
                savehome: 'hidden',
                saveroom: 'hidden',
                homelist: ' blocked',
                homeerr: '',
            });
        }
        else {

            this.setState({
                progress: 'visible',
                savehome: 'hidden',
                saveroom: 'hidden',
                roomlist: 'blocked',
                homelist: 'blocked',

                down: '',
                delhometitle: 'Добавить дом',
                delhome: '',
                downroom: '',
                /* delroom:'',*/
            });
            this.gettingHomes();
        }
    }

        // delHome() {
        //     axios.post('/homes/delete?token=' + localStorage.getItem('token'), {
        //         homeId: this.state.homeId,
        //     })
        //         .then((response) => {
        //             if (response.data === 'deleted') {
        //                 homes.slice(this.state.homeindex, 1);
        //                 if (homes.length === 1) {
        //                     homes = [];
        //                     //this.homeChange(0);
        //                     this.setState({
        //                         nameHome: "Введите новое имя ниже",
        //                         homeId: '',
        //                         homeedit: '',
        //                         savehome: 'hidden',
        //                         saveroom: 'hidden',
        //
        //                     });
        //                 }
        //                 this.gettingHomes();
        //                 this.gettingRooms(this.state.homeId);
        //             }
        //         })
        //         .catch(function (error) {
        //             console.log(error);
        //         });
        // }

    gettingRooms(homeId) {
        this.setState({
            progress: 'visible',
            roomlist: 'blocked',
            homelist: 'blocked',
        });
        this.progressBar();
        axios.post('/homes/room?token=' + localStorage.getItem('token'), {homeId: homeId})
            .then((response) => {
                if (response.data.length === 0 || response.data === "error finding home") {
                    this.setState({
                        nameRoom: "создайте комнату",
                        roomedit: '',
                        delroom: 'onupdate',
                        myrooms: [],
                        roomId: '',
                        progress: 'hidden',
                        savehome: 'hidden',
                        saveroom: 'hidden',
                        roomlist: 'blocked',
                        homelist: '',
                        percent:100,
                    });
                    rooms = [];
                }
                else {
                    rooms = response.data;
                    this.roomChange(0);
                    this.setState({
                        delroom: '',
                        myrooms: response.data,
                        progress: 'hidden',
                        savehome: 'hidden',
                        saveroom: 'hidden',
                        homelist: '',
                        roomlist: '',
                        percent:100,
                    });
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    roomChange(index) {
        this.setState({
            nameRoom: rooms[index].roomName,
            roomedit: rooms[index].roomName,
            roomindex: index,
            roomId: rooms[index]._id,
            roomerr: '' ,
        });
    }


    handleChangeRoom(event) {
        this.setState({
            roomedit: event.target.value,
            saveroom: 'visible',
            roomerr: '' ,

        });
    }

    handleClickRoom() {
        if (!this.state.roomedit.trim()) {
        //    alert("enter something")
            this.setState({
                roomerr: 'has-error' ,
            });
        }
        else {
            this.progressBar();
            this.setState({
                progress: 'visible',
                savehome: 'hidden',
                saveroom: 'hidden',
                roomlist: 'blocked',
                homelist: 'blocked',
            });
            axios.post('/homes/newroom?token=' + localStorage.getItem('token'), {
                homeId: this.state.homeId,
                roomName: this.state.roomedit.trim(),
                roomId: this.state.roomId,
            })

                .then((response) => {
                    if (response.data === 'yes') {
                        rooms[this.state.roomindex].roomName = this.state.roomedit;
                        this.setState({
                            myrooms: rooms,
                            delroom: '',
                            progress: 'hidden',
                            savehome: 'hidden',
                            saveroom: 'hidden',
                            roomlist: '',
                            homelist: '',
                            roomedit: this.state.roomedit.trim(),
                            percent:100,
                        });
                        this.roomChange(this.state.roomindex);
                    }

                    else if (response.data === 'home first') {
                        this.setState({ progress: 'hidden',percent:100,});
                        this.notifyError('Сохраните или отмените создание дома!');
                    }
                    else {
                        this.setState({
                            roomId: response.data,
                            delroom: '',
                            downroom: '',
                            progress: 'hidden',
                            percent:100,
                            savehome: 'hidden',
                            saveroom: 'hidden',
                            roomlist: '',
                            homelist: '',
                            roomedit: this.state.roomedit.trim(),
                        });
                        rooms.push({_id: response.data, roomName: this.state.roomedit});
                        this.setState({myrooms: rooms});
                        this.roomChange(rooms.length - 1);
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }

    notifyError(e) {
        notification.notice({
            content: <span>{e}</span>,
            duration: 2,
            maxCount: 0,
            key: 1,
            style: {
                top: '160px',
                left: '-50%',
            }
            // onClose() {},
        });
    }

    newRoom(e) {
        if (!this.state.downroom) {
            this.setState({
                nameRoom: "Введите название ниже",
                roomedit: '',
                roomId: '',
                downroom: 'down',
                delroomtitle: 'Отменить',
                delroom: 'onupdate',
                savehome: 'hidden',
                saveroom: 'hidden',
                roomlist: 'blocked',
                homelist: 'blocked',
                homeerr: 'blocked',
            });
        }
        else {
            this.setState({
                down: '',
                delroomtitle: 'Добавить комнату',
                delroom: '',
                downroom: '',
                savehome: 'hidden',
                saveroom: 'hidden',

                progress: 'visible',
                roomlist: 'blocked',
                homelist: 'blocked',
                homeerr: '',
            });
            this.gettingRooms(this.state.homeId);
        }
    }


    deleteObj(e) {
        this.setState({
            progress: 'visible',
            savehome: 'hidden',
            saveroom: 'hidden',
            roomlist: 'blocked',
            homelist: 'blocked',
        });
        let w = this.state.todelete;
        if (w ==="r"){
        axios.post('/homes/deleteroom?token=' + localStorage.getItem('token'), {
            roomId: this.state.roomId,
        })
            .then((response) => {
                if (response.data === 'deleted') {
                    rooms.splice(this.state.roomindex, 1);
                    if (rooms.length === 0) {
                        this.setState({
                            nameRoom: "создайте комнату",
                            roomId: '',
                            roomedit: '',
                            savehome: 'hidden',
                            saveroom: 'hidden',
                            roomlist: '',
                            homelist: '',
                        });
                        //this.roomChange(0);
                    }
                    this.gettingRooms(this.state.homeId);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        }
        else{
            axios.post('/homes/delete?token=' + localStorage.getItem('token'), {
                homeId: this.state.homeId,
            })
                .then((response) => {
                    if (response.data === 'deleted') {
                        homes.slice(this.state.homeindex, 1);
                        if (homes.length === 1) {
                            homes = [];
                            //this.homeChange(0);
                            this.setState({
                                nameHome: "Введите новое имя ниже",
                                homeId: '',
                                homeedit: '',
                                savehome: 'hidden',
                                saveroom: 'hidden',
                                roomlist: '',
                                homelist: '',
                            });
                        }
                        this.gettingHomes();
                        this.gettingRooms(this.state.homeId);
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }

    handleKeyPress(e) {
        if (e.key === 'Enter') {
            if (e.target.id === 'homes') {
                this.handleClickHome();
            }
            if (e.target.id === 'rooms') {
                this.handleClickRoom();
            }
        }
    }

    handleClick(e){
        let h = e.target.id;
        if (h !== 'okhome' && h!=='okroom'  ){
            this.setState({
                saveroom:'',
                savehome:'',

            })
        }
    }

    cancel(e) {
        if (e === 'h') {
            if (this.state.nameHome === 'Введите новое имя ниже') {
                this.setState({
                    homeedit: '',
                    savehome: 'hidden',
                });
            }
            else {
                this.setState({
                    homeedit: this.state.nameHome,
                    savehome: 'hidden',
                });
            }
        }
        if (e === 'r') {
            if (this.state.nameRoom === 'создайте комнату') {
                this.setState({
                    roomedit: '',
                    saveroom: 'hidden',
                });
            }
            else {
                this.setState({
                    roomedit: this.state.nameRoom,
                    saveroom: 'hidden',
                });
            }
        }
    }

    progressBar() {

        let percent = this.state.percent + 1;
        if (percent >= 100 ) {
            clearTimeout(this.tm);
            this.setState({ percent:0, });
            return;
        }
        let int = percent*2.5+9;
        this.setState({ percent });
        this.tm = setTimeout(this.progressBar, int);
    }

    render() {
        return (
            <div  onClick={(e) => {this.handleClick(e)}}>
                <div className="col-sm-1">
                </div>
                <div className="col-sm-10">
                    <form>
                        <Line percent={this.state.percent} className={this.state.progress} strokeWidth="1" strokeColor={"#38cda4"} trailColor={"rgba(255, 255, 255, .0)"} />
                        <h3>Дома</h3>
                        <span className={"glyphicon glyphicon-plus-sign Home rotate " + this.state.down}
                              id="editProfile"
                              data-toggle="tooltip" data-placement="top"
                              title={this.state.delhometitle}
                              onClick={(e) => {this.newHome(e)}}/>
                        <span className={"glyphicon glyphicon-minus-sign Home " + this.state.delhome} id="editProfile"
                              data-toggle="tooltip" data-placement="top"
                              title="Удалить дом"
                              onClick={() => {this.openModal()}}/>
                        <div className="homes">
                            <DropdownButton
                                className={"room " + this.state.homelist}
                                bsStyle="default"
                                title={this.state.nameHome}
                                id={`dropdown-basic`}
                                onSelect={(index) => {this.homeChange(index)}}>
                                {homes.map((homeDetail, index) => {
                                    return <MenuItem eventKey={index} key={index}>
                                        {homeDetail.homeName}</MenuItem>
                                })}
                            </DropdownButton>
                            <input type="homes" className={"form-control room  pd "+this.state.homeerr} id="homes"
                                   placeholder="название дома" value={this.state.homeedit}
                                   onChange={this.handleChange}
                                   onKeyPress={(e)=>{this.handleKeyPress(e)}}/>
                            <i className="home-saver hidden ">

                      <span id="okhome" className={"glyphicon glyphicon-ok hsave " + this.state.savehome}
                            data-toggle="tooltip" title="Сохранить дом"
                            onClick={this.handleClickHome}/>
                            </i>
                            <span id="cancelhome" className={"glyphicon glyphicon-remove hcancel " + this.state.savehome}
                                      data-toggle="tooltip" title="Отменить ввод"
                                      onClick={(e)=>{this.cancel('h')}}/>
                        </div>

                        <h3>Комнаты</h3>
                        <div className={"homes "+this.state.roomstatus}>
                           <span className={"glyphicon glyphicon-plus-sign roomg rotate " + this.state.downroom}
                                 data-toggle="tooltip" data-placement="top"
                                 title={this.state.delroomtitle}
                                 onClick={(e) => {
                                     this.newRoom(e)
                                 }}/>
                            <span className={"glyphicon glyphicon-minus-sign roomg roomdel " + this.state.delroom}
                                  data-toggle="tooltip" data-placement="top"
                                  title="Удалить комнату"
                                  onClick={(e) => {
                                      this.openModal("r")
                                  }}/>
                            <DropdownButton
                                className={"room "+ this.state.roomlist}
                                bsStyle="default"
                                title={this.state.nameRoom}
                                id={`dropdown-basic`}
                                onSelect={(index) => {
                                    this.roomChange(index)
                                }}>
                                {this.state.myrooms.map((roomDetail, index) => {
                                    return <MenuItem eventKey={index} key={index}>
                                        {roomDetail.roomName}</MenuItem>
                                })}
                            </DropdownButton>
                            <input type="rooms" className={"form-control room pd "+this.state.roomerr} id="rooms"
                                   placeholder="название комнаты" value={this.state.roomedit}
                                   onChange={this.handleChangeRoom}
                                   onKeyPress={(e)=>{this.handleKeyPress(e)}}/>
                            <i className="home-saver hidden">
                                 <span id="okroom" className={"glyphicon glyphicon-ok hsave " + this.state.saveroom}
                                    data-toggle="tooltip" title="Сохранить комнату"
                                    onClick={this.handleClickRoom}
                                 />
                                <span id="cancelhome" className={"glyphicon glyphicon-remove hcancel " + this.state.saveroom}
                                      data-toggle="tooltip" title="Отменить ввод"
                                      onClick={(e)=>{this.cancel('r')}}/>
                            </i>
                        </div>
                    </form>


                    <Modal
                        isOpen={this.state.modalIsOpen}
                        onRequestClose={this.closeModal}
                        style={customStyles}
                        contentLabel="Confirm delete"
                    >
                        <form>
                            <h3>Подтвердите удаление</h3>
                            <span className="glyphicon glyphicon-ok modalGlyph"
                                  data-toggle="tooltip" data-placement="top" title="Удалить"
                                  onClick={(e) => {
                                      this.deleteObj();
                                      this.closeModal()
                                  }}/>
                            <span className="glyphicon glyphicon-remove modalGlyph"
                                  data-toggle="tooltip" data-placement="top" title="Отмена"
                                  onClick={this.closeModal}/>
                        </form>
                    </Modal>


                </div>
                <div className="col-sm-1">
                </div>
            </div>
        );
    }
}

export default Homes;