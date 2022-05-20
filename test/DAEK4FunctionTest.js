// We import Chai to use its asserting functions here.
const { expect } = require("chai");
var crypto = require('crypto');
var eg = require('../scripts/elgamal.js')
var BigInt = require('jsbn');



describe("DAEKeyexchange1", function () {

  let bn = 2;
  let DAEKeyexchangeFC;
  let DAEKeyexchange;
  let addr = new Array(bn);
  let addrstr = new Array(bn);
  let exchangeContract = new Array(bn);
  let N = 256;//256;//224;//
  let L = 3072;//3072;//2048;//
  const versionNum = 40000;//20011;//20001;//20000;
  const abi = [
    "function Initialization(address iUser, string calldata iID, string calldata iPK) external",
    "function getIdBasic(address iUser) external view returns (address,  string memory, string memory)",
    "function updateCert(address iUser, address iPK) external",
    "function setRforCommunicator(address iP, address iQ, string calldata r) external",
    "function getRfromCommunicator(address iQ, address iP) external view returns (string memory)",
    "function setSigforCommunicator(address iQ, address iP, string calldata sig) external",
    "function getsigfromCommunicator(address iP, address iQ) external view returns (string memory)"
  ];

  before(async function () {
    DAEKeyexchangeFC = await ethers.getContractFactory("DAEKeyexchange1");
    addr = await ethers.getSigners();
    DAEKeyexchange = await DAEKeyexchangeFC.deploy(versionNum);
    for(let i=0; i< bn; i++){
      exchangeContract[i] = await new ethers.Contract(DAEKeyexchange.address,abi,addr[i+1]);
      addrstr[i] = addr[i+1].address;
    }
    
  });
  
  describe("Function Tests", function () {
    

    it("DAEK4", async function () {

      
      let idPseed = "just a test1";
      let hashid =  crypto.createHash('sha256');
      hashid.update(idPseed);
      const idP  = hashid.digest('hex');
      const eP = await eg.ElGamal.initialParametersAsync(N,L);
      let ins = await eP.generateKeyAsync();
      const galpha = eP.y.toString(16);
      let idQseed = "just a test2";
      hashid =  crypto.createHash('sha256');
      hashid.update(idQseed);
      const idQ  = hashid.digest('hex');
      const eQ = await eg.ElGamal.initialParametersAsync(N,L);
      ins = await eQ.generateKeyAsync();
      const gbeta = eQ.y.toString(16);
      ins = await DAEKeyexchange.Initialization(addrstr[0],idP,galpha);
      ins = await DAEKeyexchange.Initialization(addrstr[1],idQ,gbeta);


      //for P
      const exKeysP = await eP.generateKeyAsyncExt();
      const gu = exKeysP.pk;
      ins = await exchangeContract[0].setRforCommunicator(addrstr[0],addrstr[1],gu);


      //for Q
      const exKeysQ = await eQ.generateKeyAsyncExt();
      const gv = exKeysQ.pk;
      ins = await exchangeContract[1].getIdBasic(addrstr[0]);
      const addrP = ins[0];
      const pkP = ins[1];
      const idPpi = ins[2]; 
      if(!(addrP === addrstr[0])) {console.log("error1"); return;}
      const gupi = await exchangeContract[1].getRfromCommunicator(addrstr[1],addrstr[0]);
      
      const h1 = await eQ.multiplyAndPow(pkP,gupi,eQ.x.toString(16),exKeysQ.sk);
      const guv = await eQ.powSecret(gupi,exKeysQ.sk);
      const hashforkey =  crypto.createHash('sha256');
      hashforkey.update(h1 + guv + pkP + gupi + gbeta + gv + idPpi + idQ);
      const keystr  = hashforkey.digest('hex');
      const kQ = keystr.substring(0,32);
      const k1Q = keystr.substring(0,24);
      //const pk1Q = await eQ.computePk(k1Q);
      const k2Q = keystr.substring(0,20);
      //const pk2Q = await eQ.computePk(k2Q);
      //send gv , k1Q to P
      ins = await exchangeContract[1].setRforCommunicator(addrstr[1],addrstr[0],gv);
      ins = await exchangeContract[1].setSigforCommunicator(addrstr[1],addrstr[0],k1Q);


      //for P
      ins = await exchangeContract[0].getIdBasic(addrstr[1]);
      const addrQ = ins[0];
      const pkQ = ins[1];
      const idQpi = ins[2];
      if(!(addrQ === addrstr[1])){console.log("error2"); return;}
      const gvpi = await exchangeContract[0].getRfromCommunicator(addrstr[0],addrstr[1]);
      const K1Qpi = await exchangeContract[0].getsigfromCommunicator(addrstr[0],addrstr[1]);
      const h1pi = await eP.multiplyAndPow(gvpi,pkQ,eP.x.toString(16),exKeysP.sk);
      const gvu = await eP.powSecret(gvpi,exKeysP.sk);
      const hashforkey1 =  crypto.createHash('sha256');
      hashforkey1.update(h1pi + gvu + galpha + gu + pkQ + gvpi + idP + idQpi);
      const keystr1  = hashforkey1.digest('hex');
      const kP = keystr1.substring(0,32);
      const k1P = keystr1.substring(0,24);
      const k2P = keystr1.substring(0,20); 
      if(!(K1Qpi === k1P)){console.log("error3"); return;}
      //send k2P to Q
      ins = await exchangeContract[0].setSigforCommunicator(addrstr[0],addrstr[1],k2P);



      //for Q
      const K2Ppi = await exchangeContract[1].getsigfromCommunicator(addrstr[1],addrstr[0]);
      if(!(K2Ppi === k2Q)) {console.log("error2"); return;}




    });

   

  });


});