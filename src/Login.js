import React from 'react';
import {AuthForm} from "./AuthForm";
import {Button} from "antd";
import {SCREEN_TYPES} from "./App";

export class Login extends React.Component {
    render() {
        return (
            <div>
                <h1>Haven't got an account?</h1>
                <Button onClick={() => this.props.handleScreen(SCREEN_TYPES.register)}>Register!</Button>
                <AuthForm onClick={this.props.onSubmit} />
            </div>
        );
    }
}
