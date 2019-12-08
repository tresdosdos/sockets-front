import React from 'react';
import {Button, Input} from "antd";

export function AuthForm(props) {
    const [username, setName] = React.useState('');
    const [password, setPass] = React.useState('');

    return (
        <div>
            <h2>Username</h2>
            <Input value={username} onChange={e => setName(e.currentTarget.value)} />
            <h2>Password</h2>
            <Input type={'password'} value={password} onChange={e => setPass(e.currentTarget.value)} />
            <Button onClick={() => props.onClick(username, password)}>Submit</Button>
        </div>
    );
}