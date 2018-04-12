import Web3 from 'web3';

// Uses the metamask provider. 
// This assumes the users has metamask installed
const web3 = new Web3(window.web3.currentProvider);

export default web3;