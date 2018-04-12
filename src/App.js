import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import web3 from './web3';
import lottery from './lottery';

class App extends Component {

  // Same as declaring this.state = {} inside a constructor.
  // Only available in ES6
  state = {
    manager: '',
    players: [],
    balance: '',
    value: '',
    message: ''
  };
  
  async componentDidMount() {
    console.log(web3.version)
    web3.eth.getAccounts().then(console.log)
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    this.setState({ manager, players, balance });
  }

  onSubmit = async (event) => {
    event.preventDefault();

    this.setState({message: "Waiting for your transaction to finish...."});

    const accounts = await web3.eth.getAccounts();
    await lottery.methods.join().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether')
    });

    this.setState({message: "Good Luck on your Entry!"});
  };

  onClick = async() => {
    this.setState({message: "Picking a winner...."});

    const accounts = await web3.eth.getAccounts();
    await lottery.methods.pickWinner().send({
        from: accounts[0]
      });

    this.setState({message: "Winner has been picked and prize has been transferred"});
  };

  render() {
    return (
      <div>
        <h2>Contract</h2>
        <p>This Contract is managed by: {this.state.manager}</p>
        <p>Current players: {this.state.players.length} </p>
        <p>Current price pool: {web3.utils.fromWei(this.state.balance, 'ether')} ether</p>
        <hr />
        <form onSubmit={this.onSubmit}>
          <h4>Want to try your luck?</h4>
          <div>
            <label>Amount of ether to enter</label>
            <input value={this.state.value}
                   onChange={event => this.setState({ value: event.target.value })} />
          </div>
          <button>Enter</button>
        </form>
        
        <hr />
        
        <h1>{this.state.message}</h1>
        
        <hr />

        <h4> Manager Section </h4>
        <button onClick={this.onClick} >Pick a winner!</button>
      </div>
    );
  }
}

export default App;
