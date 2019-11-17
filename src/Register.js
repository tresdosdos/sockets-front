import React from 'react';
import {AuthForm} from "./AuthForm";
import {Button} from "antd";
import {SCREEN_TYPES} from "./App";

export class Register extends React.Component {
    render() {
        return (
            <div>
                <h1>Already have an account?</h1>
                <Button onClick={() => this.props.handleScreen(SCREEN_TYPES.login)}>Login!</Button>
                <AuthForm onClick={this.props.onSubmit} />
            </div>
        );
    }
}