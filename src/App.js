import React from 'react';
import io from 'socket.io-client';
import './App.css';

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

    handleClick = () => {
        socket.emit('text', this.state.text)
    };

    handleChange = (e) => {
        this.setState({
            text: e.currentTarget.value
        })
    };

    configureItems = () => {
        return this.state.messages.map(msg => (<p key={msg}>{msg}</p>))
    };

    render() {
        const items = this.configureItems();

        return (
            <div className="content-wrapper">
                <div className="content">
                    <input value={this.state.text} onChange={this.handleChange}/>
                    <button onClick={this.handleClick}>отправить</button>
                    <div>
                        {items}
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
