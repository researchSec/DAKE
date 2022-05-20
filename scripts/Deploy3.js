// We import Chai to use its asserting functions here.
const { expect } = require("chai");
var crypto = require('crypto');
var eg = require('./elgamal.js')
var BigInt = require('jsbn');


async function main() {
  
  let bn = 2;
  let DAEKeyexchangeFC;
  let DAEKeyexchange;
  let addr = new Array(bn);
  const versionNum = 30000;//10010;//10001;//10000;
  let overrides = {

    // The maximum units of gas for the transaction to use
    gasLimit: 6400000,

    // The price (in wei) per unit of gas
    gasPrice:  ethers.utils.parseUnits('5', 'gwei'),


  };
  DAEKeyexchangeFC = await ethers.getContractFactory("DAEKeyexchange3");
  addr = await ethers.getSigners();
  DAEKeyexchange = await DAEKeyexchangeFC.deploy(versionNum,overrides);


  console.log("Account balance:", (await addr[0].getBalance()).toString());
  console.log("Contract address:", DAEKeyexchange.address);

 

  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });


    