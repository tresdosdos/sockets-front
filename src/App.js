import React from 'react';
import io from 'socket.io-client';
import './App.css';

const socket = io('localhost:8080');

socket.on('connect', () => {
    console.log(socket.disconnected); // false
});

class App extends React.Component {
    state = {
        text: ''
    };

    handleClick = () => {
        socket.emit('text', this.state.text)
    }

    handleChange = (e) => {
        this.setState({
            text: e.currentTarget.value
        })
    };

    render() {
        return (
            <div className="App">
                <input value={this.state.text} onChange={this.handleChange}/>
                <button onClick={this.handleClick}>отправить</button>
            </div>
        );
    }
}

export default App;
