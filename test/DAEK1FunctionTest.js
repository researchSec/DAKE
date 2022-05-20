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
  let N = 256;//224;//160;
  let L = 3072;//2048;//1024;
  const versionNum = 10011;//10010;//10001;//10000;
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
    

    it("DAEK1", async function () {

     
      let idPseed = "just a test1";
      let idQseed = "just a test2";
      let hashid =  crypto.createHash('sha256');
      hashid.update(idPseed);
      const idP  = hashid.digest('hex');
      hashid =  crypto.createHash('sha256');
      hashid.update(idQseed);
      const idQ  = hashid.digest('hex');


      
      const eP = await eg.ElGamal.initialParametersAsync(N,L);
      let ins = await eP.generateKeyAsync();
      const uP = eP.y.toString(16);


      const eQ = await eg.ElGamal.initialParametersAsync(N,L);
      ins = await eQ.generateKeyAsync();
      const v = eQ.y.toString(16);

      
      ins = await DAEKeyexchange.Initialization(addrstr[0],idP,uP);
      ins = await DAEKeyexchange.Initialization(addrstr[1],idQ,v);


       //for P
      const r = crypto.randomBytes(32).toString('hex');
      ins = await exchangeContract[0].setRforCommunicator(addrstr[0],addrstr[1],r);
    

      //for Q
      ins = await exchangeContract[1].getIdBasic(addrstr[0]);
      const addrP = ins[0];
      const pkP = ins[1];
      const idPpi = ins[2]; 
      if(!(addrP == addrstr[0])) {console.log("error1");return;}
      const rpi = await exchangeContract[1].getRfromCommunicator(addrstr[1],addrstr[0]);
      const hashforsig =  crypto.createHash('sha256');
      hashforsig.update(rpi + v + idPpi);
      const strTosig  = hashforsig.digest('hex');
      const delta = await eQ.signAsync(strTosig,N);
      const transdelta = delta.a.toString(16) + "||" + delta.b.toString(16);
      ins = await exchangeContract[1].setSigforCommunicator(addrstr[1],addrstr[0],transdelta);
      const uPbeta = await eQ.computeSecret(uP);
      const kstr = uP + v + uPbeta + idQ;
      const hashfork =  crypto.createHash('sha256');
      hashfork.update(kstr);
      const key1  = hashfork.digest('hex');

      //for P
      ins = await exchangeContract[0].getIdBasic(addrstr[1]);
      const addrQ = ins[0];
      const pkQ = ins[1];
      const idQpi = ins[2];
      if(!(addrQ === addrstr[1])) {console.log("error2");return;}
      const sig = await exchangeContract[0].getsigfromCommunicator(addrstr[0],addrstr[1]);
      const tmptransdelta = sig.split("||");
      const sdelta = {'a':new BigInt(tmptransdelta[0],16),'b':new BigInt(tmptransdelta[1],16)};
      const hashforsig2 =  crypto.createHash('sha256');
      hashforsig2.update(r + pkQ + idP);
      const strTosig2  = hashforsig2.digest('hex')

      if(!(await eP.verifyAsync(strTosig2, sdelta, pkQ, N))) {console.log("error3");return;}
      const vAlphaP = await eP.computeSecret(pkQ);
      const kstr1 = uP + pkQ + vAlphaP + idQpi;
      const hashfork1 =  crypto.createHash('sha256');
      hashfork1.update(kstr1);
      const key2  = hashfork1.digest('hex');

      if(!(key1 === key2)) {console.log("error4");return;}

    });

   

  });


});