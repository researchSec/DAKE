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
 

 
  
  const eP = await eg.ElGamal.initialParametersAsync(N,L);
  
  const secret = await eP.generateKeyAsyncExt();
 
  console.log(secret.sk);
  console.log(secret.pk);



 

  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });


    