// We import Chai to use its asserting functions here.
const { expect } = require("chai");
var crypto = require('crypto');
var eg = require('./elgamal.js')
var BigInt = require('jsbn');
const { version } = require("process");


async function main() {
  
  let bn = 2;
  let DAEKeyexchangeFC;
  let DAEKeyexchange;
  let addr = new Array(bn);
  let addrstr = new Array(bn);
  let exchangeContract = new Array(bn);
  let N = 256;//224;//160;
  let L = 3072;//2048;//1024;
  const versionNum = 40011;//10010;//10001;//10000;
  const abi = [
    "function Initialization(address iUser, string calldata iID, string calldata iPK) external",
    "function getIdBasic(address iUser) external view returns (address,  string memory, string memory)",
    "function updateCert(address iUser, address iPK) external",
    "function setRforCommunicator(address iP, address iQ, string calldata r) external",
    "function getRfromCommunicator(address iQ, address iP) external view returns (string memory)",
    "function setSigforCommunicator(address iQ, address iP, string calldata sig) external",
    "function getsigfromCommunicator(address iP, address iQ) external view returns (string memory)"
  ];
  let overrides = {

    // The maximum units of gas for the transaction to use
    gasLimit: 6400000,

    // The price (in wei) per unit of gas
    gasPrice:  ethers.utils.parseUnits('5', 'gwei'),


  };
  addr = await ethers.getSigners();
  exchangeContract[1] = await new ethers.Contract("0xEF73E0CA4cd8aFea6D9Db4699131ba2ce89906D6",abi,addr[1]);
  addrstr[0] = addr[0].address;
  addrstr[1] = addr[1].address;
  let start = Date.now();
  const k2Q = "f8b914c2c5b5b00353fb4efd35543521550f920d896c01ba972c9670ece82d2c";
 
  const K2Ppi = await exchangeContract[1].getsigfromCommunicator(addrstr[1],addrstr[0]);
  if(!(K2Ppi === k2Q)) {console.log("error1"); return;}
 
  let time = Date.now() - start;
  console.log(`time for ex4 = ${time} MS`);

  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });


    