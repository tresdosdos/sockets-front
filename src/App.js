import React from 'react';
import io from 'socket.io-client';
import './App.css';
import {Button, Input, Layout} from "antd";

const { Header, Footer, Sider, Content } = Layout;

const socket = io(
    process.env.NODE_ENV === 'production'
        ? 'https://socckets.herokuapp.com/'
        : 'localhost:8080');

socket.on('connect', () => {
    console.log('connected');
});

class App extends React.Component {
    state = {
        text: '',
        messages: [],
    };

    componentDidMount() {
        socket.on('text', (msg) => {
            const messages = [...this.state.messages];

            messages.push(msg);

            this.setState({
                messages
            });
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();

        if (!this.state.text) {
            return;
        }

        socket.emit('text', this.state.text);

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
    }

    configureItems = () => {
        return this.state.messages.map(msg => (<p key={msg}>{msg}</p>))
    };

    render() {
        const items = this.configureItems();

        return (
            <Layout>
                <Header>Header</Header>
                <Content>{items}</Content>
                <Footer>
                    <Input value={this.state.text} onKeyDown={this.handlePress} onChange={this.handleChange}/>
                    <Button type="submit" onClick={this.handleSubmit}>отправить</Button>
                </Footer>
            </Layout>
        );
    }
}

export default App;
