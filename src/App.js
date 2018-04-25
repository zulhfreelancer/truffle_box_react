import React, { Component } from 'react'
import SimpleStorageContract from '../build/contracts/SimpleStorage.json'
import getWeb3 from './utils/getWeb3'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

const contract = require('truffle-contract')
const simpleStorage = contract(SimpleStorageContract)

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      storageValue: null,
      web3: null,
      accounts: []
    }
    this.handleClick = this.handleClick.bind(this);
  }

  componentWillMount() {
    getWeb3.then(results => {
      this.setState({
        web3: results.web3
      }, function(){
        simpleStorage.setProvider(this.state.web3.currentProvider)
        this.initialSetup()
      })
    }).catch(() => {
      console.log('Please use MetaMask.');
    })
  }

  initialSetup() {
    this.getAccounts()
    this.getStorageValue()
  }

  getAccounts() {
    this.state.web3.eth.getAccounts((error, _accounts) => {
      this.setState({accounts: _accounts})
    })
  }

  getStorageValue() {
    simpleStorage.deployed().then((instance) => {
      return instance.get.call();
    }).then((result) => {
      this.setState({storageValue: result.toNumber()})
    })
  }

  handleClick() {
    simpleStorage.deployed().then((instance) => {
      return instance.add(5, {from: this.state.accounts[0]});
    }).then((result) => {
      this.getStorageValue()
    })
  }

  render() {
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
            <a href="#" className="pure-menu-heading pure-menu-link">TruffleReact</a>
        </nav>

        {this.state.web3 &&
          <main className="container">
            <div className="pure-g">
              <div className="pure-u-1-1">
                <p style={{color: 'red'}}>
                  Please make sure you are using the right network in MetaMask.
                </p>
                <h2>Smart Contract</h2>
                <p>The stored value is: {this.state.storageValue}</p>
                <button
                  onClick={this.handleClick}
                >
                  Add 5 More
                </button>
              </div>
            </div>
          </main>
        }

        {this.state.web3 === undefined &&
          <div>
            <br/>
            <br/>
            <center>
              <h3>Please install MetaMask</h3>
            </center>
          </div>
        }
      </div>
    );
  }
}

export default App
