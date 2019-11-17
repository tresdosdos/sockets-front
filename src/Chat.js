import React from 'react';

export class Chat extends React.Component {
    configureItems = () => {
        return this.props.messages.map(msg => (<p key={msg.id}>{msg.user.username}:{msg.text}</p>))
    };

    render() {
        const items = this.configureItems();

        return (
            <>
                {items}
            </>
        );
    }
}
