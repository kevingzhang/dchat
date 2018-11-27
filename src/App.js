import React, { Component } from 'react';
import './App.css';

import LoginBox from './LoginBox.js';
import Chatroom from './Chatroom.js';

import { newNKNClient, getNKNAddr } from './nkn';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: null,
      chatWith: null,
      messages: {},
    };

    this.login = this.login.bind(this);
    this.receiveMessage = this.receiveMessage.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }

  login(username) {
    // bluezelle: initialize client
    // bluezelle: get chat history
    // bluezelle: get friends

    this.nknClient = newNKNClient(username);
    this.nknClient.on('message', (src, payload, payloadType) => {
      let username = src.split('.')[0];
      this.receiveMessage(username, username, payload);
    });

    this.setState({
      username: username,
      messages: {},
    });
  }

  receiveMessage(chat, username, message) {
    let messageList = this.state.messages[chat] || [];

    messageList.push({
      username: username,
      content: <p>{message}</p>,
      img: "http://i.imgur.com/Tj5DGiO.jpg",
    });

    this.setState({
      messages: Object.assign(this.state.messages, { [chat]: messageList }),
    });
  }

  sendMessage(username, message) {
    this.nknClient.send(getNKNAddr(username), message);
  }

  render() {
    return (
      <div className="App">
        {
          this.state.username
          ?
          <Chatroom
            myUsername={this.state.username}
            friendUsername={this.state.chatWith}
            messages={this.state.messages[this.state.chatWith] || []}
            receiveMessage={this.receiveMessage}
            sendMessage={this.sendMessage}
            />
          :
          <LoginBox login={this.login}/>
        }
      </div>
    );
  }
}

export default App;
