import React from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import _ from 'lodash';
import './App.css';
import {Button, Input, Layout} from "antd";
import {Chat} from "./Chat";
import {Rooms} from "./Rooms";
import {Login} from "./Login";
import {Register} from "./Register";

const { Header, Footer, Sider, Content } = Layout;

export const baseUrl = process.env.NODE_ENV === 'production'
    ? 'https://socckets.herokuapp.com'
    : 'http://localhost:8080';

export const SCREEN_TYPES = {
    default: 'default',
    login: "login",
    register: 'register',
};

class App extends React.Component {
    state = {
        text: '',
        messages: [],
        rooms: [],
        addRoomVal: '',
        screenType: SCREEN_TYPES.login,
        roomId: ''
    };

    handleSocket = () => {
        this.socket = io(baseUrl, {query: { token: localStorage.getItem('token') }});

        this.socket.on('connect', () => {
            console.log('connected');
        });

        this.socket.on('message', (messages) => {
            this.setState({
                messages
            });
        });

        this.socket.on('rooms', (rooms) => {
            this.setState({
                rooms,
            })
        })
    };

    async componentDidMount() {
        if (!localStorage.getItem('token')) {
            return this.handleScreen(SCREEN_TYPES.login);
        }

        const res = await axios.get(`${baseUrl}/user`, {headers: {
            'Authorization': localStorage.getItem('token')
            }});

        if (!res) {
            return this.handleScreen(SCREEN_TYPES.login);
        }

        localStorage.setItem('token', res.headers.authorization);
        this.handleScreen(SCREEN_TYPES.default);

        this.handleSocket();
    }

    handleScreen = (screenType) => {
      this.setState({
          screenType
      })
    };

    handleSubmit = (e) => {
        e.preventDefault();

        if (!this.state.text) {
            return;
        }

        this.socket.emit('message', {
            text: this.state.text,
            roomId: this.state.roomId,
        });

        this.setState({
            text: '',
        })
    };

    handleChange = (e) => {
        this.setState({
            text: e.currentTarget.value
        })
    };

    handlePress = (e) => {
        if (e.keyCode !== 13) {
            return;
        }

        this.handleSubmit(e);
    };

    handleLogin = async (username, password) => {
        const res = await axios.post(`${baseUrl}/user/login`, {username, password});

        localStorage.setItem('token', res.headers.authorization);
        this.handleScreen(SCREEN_TYPES.default);
        this.handleSocket();
    };

    handleRegister = async (username, password) => {
        const res = await axios.post(`${baseUrl}/user/register`, {username, password});

        localStorage.setItem('token', res.headers.authorization);
        this.handleScreen(SCREEN_TYPES.default);
        this.handleSocket();
    };

    handleAddRoomChange = (e) => {
        this.setState({
            addRoomVal: e.currentTarget.value,
        })
    };

    handleAddRoom = () => {
        this.socket.emit('room/new', {name: this.state.addRoomVal});
        this.setState({
            addRoomVal: '',
        })
    };

    handleRoomJoin = (roomId) => {
        if (roomId === this.state.roomId) {
            return;
        }

        this.setState({roomId});
        this.socket.on(`room/${roomId}`, (messages) => {
            console.log(messages);
            this.setState({messages});
        });
        this.socket.on(`room/${roomId}/joiners`, (message) => {
            const messages = [...this.state.messages];
            messages.push(message);

            this.setState({messages});
        });
        this.socket.emit(`room/join`, {id: roomId});
    };

    get messages() {
        return _.uniq(this.state.messages.filter(msg => msg.roomId === this.state.roomId));
    }

    render() {
        if (this.state.screenType === SCREEN_TYPES.login) {
            return (<Login onSubmit={this.handleLogin} handleScreen={this.handleScreen} />);
        }

        if (this.state.screenType === SCREEN_TYPES.register) {
            return (<Register onSubmit={this.handleRegister} handleScreen={this.handleScreen} />);
        }

        return (
            <Layout>
                <Header>Header</Header>
                <Layout>
                    <Sider theme={'light'}>
                        <Rooms rooms={this.state.rooms} onClick={this.handleRoomJoin} />
                        <Input value={this.state.addRoomVal} onChange={this.handleAddRoomChange} placeholder={'Room name for add'} />
                        <Button onClick={this.handleAddRoom}>Add room</Button>
                    </Sider>
                    <Layout className={'chat-layout'}>
                        <Content>
                            <Chat messages={this.messages} />
                        </Content>
                        <Footer>
                            <Input value={this.state.text} onKeyDown={this.handlePress} onChange={this.handleChange}/>
                            <Button type="submit" onClick={this.handleSubmit}>отправить</Button>
                        </Footer>
                    </Layout>
                </Layout>
            </Layout>
        );
    }
}

export default App;
