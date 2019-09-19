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

    configureItems = () => {
        return this.state.messages.map(msg => (<p key={msg}>{msg}</p>))
    };

    render() {
        const items = this.configureItems();

        return (
            <div className="content-wrapper">
                <form className="content">
                    <input value={this.state.text} onChange={this.handleChange}/>
                    <button type="submit" onClick={this.handleSubmit}>отправить</button>
                    <div>
                        {items}
                    </div>
                </form>
            </div>
        );
    }
}

export default App;
