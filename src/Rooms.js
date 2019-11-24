import React from 'react';
import {Button} from "antd";

export class Rooms extends React.Component {
    render() {
        return this.props.rooms.map(room => {
            return (<Button className={'room-btn'} onClick={() => this.props.onClick(room.id)} key={room.id}>{room.name}</Button>);
        });
    }
}
