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
  const versionNum = 20010;//20011;//20001;//20000;
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
    

    it("DAEK2", async function () {

 
      let idPseed = "just a test1";
      let idQseed = "just a test2";
      let hashid =  crypto.createHash('sha256');
      hashid.update(idPseed);
      const idP  = hashid.digest('hex');
      const eP = await eg.ElGamal.initialParametersAsync(N,L);
      let ins = await eP.generateKeyAsync();
      const uP = eP.y.toString(16);

      const eQ = await eg.ElGamal.initialParametersAsync(N,L);
      ins = await eQ.generateKeyAsync();
      const v = eQ.y.toString(16);
      let hashid2 =  crypto.createHash('sha256');
      hashid2.update(idQseed);
      const idQ  = hashid2.digest('hex');


      ins = await DAEKeyexchange.Initialization(addrstr[0],idP,uP);
      ins = await DAEKeyexchange.Initialization(addrstr[1],idQ,v);


      //for P
      const secret = await eP.generateKeyAsyncExt();
      const u = secret.pk;
      const hashforsig =  crypto.createHash('sha256');
      hashforsig.update(u);
      const strTosig  = hashforsig.digest('hex');
      const delta1 = await eP.signAsync(strTosig,N);
      let transdelta = delta1.a.toString(16) + "||" + delta1.b.toString(16);
      ins = await exchangeContract[0].setRforCommunicator(addrstr[0],addrstr[1],u);
      ins = await exchangeContract[0].setSigforCommunicator(addrstr[0],addrstr[1],transdelta);



      //for Q
      const sig = await exchangeContract[1].getsigfromCommunicator(addrstr[1],addrstr[0]);
      const upi = await exchangeContract[1].getRfromCommunicator(addrstr[1],addrstr[0]);
      let tmptransdelta = sig.split("||");
      let sdelta = {'a':new BigInt(tmptransdelta[0],16),'b':new BigInt(tmptransdelta[1],16)}
      ins = await exchangeContract[1].getIdBasic(addrstr[0]);
      const addrP = ins[0];
      const pkP = ins[1];
      const idPpi = ins[2]; 
      if(!(addrP === addrstr[0])) {console.log("error1"); return;}
      const hashforsig1 =  crypto.createHash('sha256');
      hashforsig1.update(upi);
      const strTosig1  = hashforsig1.digest('hex');
      if(!(await eQ.verifyAsync(strTosig1, sdelta, pkP, N))) {console.log("error2"); return;}
      
      const hashforsig2 =  crypto.createHash('sha256');
      hashforsig2.update(upi+v+idPpi);
      const strTosig2  = hashforsig2.digest('hex');
      const delta2 = await eQ.signAsync(strTosig2,N);
      let transdelta2 = delta2.a.toString(16) + "||" + delta2.b.toString(16);
      ins = await exchangeContract[1].setSigforCommunicator(addrstr[1],addrstr[0],transdelta2);
      const kstr = upi+v+(await eQ.computeSecret(upi))+idQ;
      const hashfork =  crypto.createHash('sha256');
      hashfork.update(kstr);
      const key1  = hashfork.digest('hex');


      //for P
      ins = await exchangeContract[0].getIdBasic(addrstr[1]);
      const addrQ = ins[0];
      const pkQ = ins[1];
      const idQpi = ins[2];
      if(!(addrQ === addrstr[1])){console.log("error3"); return;}
      const sig2 = await exchangeContract[0].getsigfromCommunicator(addrstr[0],addrstr[1]);
      let tmptransdelta2 = sig2.split("||");
      sdelta = {'a':new BigInt(tmptransdelta2[0],16),'b':new BigInt(tmptransdelta2[1],16)}

      const hashforsig3 =  crypto.createHash('sha256');
      hashforsig3.update(u+pkQ+idP);
      const strTosig3  = hashforsig3.digest('hex');
      if(!(await eP.verifyAsync(strTosig3, sdelta, pkQ, N))){console.log("error4"); return;}


      const kstr2 = u+pkQ+(await eP.computeSecretExt(pkQ,secret.sk))+idQpi;
      const hashfork2 =  crypto.createHash('sha256');
      hashfork2.update(kstr2);
      const key2  = hashfork2.digest('hex');
      if(!(key1 === key2)) {console.log("error5"); return;}



    });

   

  });


});