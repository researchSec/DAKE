// We import Chai to use its asserting functions here.
const { expect } = require("chai");
var crypto = require('crypto');
var eg = require('../scripts/elgamal.js')
var BigInt = require('jsbn');
const { Console } = require("console");



describe("DAEKeyexchange2", function () {

  let bn = 2;
  let DAEKeyexchangeFC;
  let DAEKeyexchange;
  let addr = new Array(bn);
  let addrstr = new Array(bn);
  let exchangeContract = new Array(bn);
  let N = 256;//256;//224;//
  let L = 3072;//3072;//2048;//
  const versionNum = 30000;//20011;//20001;//20000;
  const abi = [
    "function Initialization(address iUser, string calldata iID, string calldata iPK) external",
    "function getIdBasic(address iUser) external view returns (address,  string memory, string memory)",
    "function updateCert(address iUser, address iPK) external",
    "function setStrforCommunicator(address iUser, string calldata str) external",
    "function getStrfromCommunicator(address iUser) external view returns (string memory)"
  ];

  before(async function () {
    DAEKeyexchangeFC = await ethers.getContractFactory("DAEKeyexchange2");
    addr = await ethers.getSigners();
    DAEKeyexchange = await DAEKeyexchangeFC.deploy(versionNum);
    for(let i=0; i< bn; i++){
      exchangeContract[i] = await new ethers.Contract(DAEKeyexchange.address,abi,addr[i+1]);
      addrstr[i] = addr[i+1].address;
    }
    
  });
  
  describe("Function Tests", function () {
    

    it("DAEK3", async function () {

      
      let idPseed = "just a test1";
      let hashid =  crypto.createHash('sha256');
      hashid.update(idPseed);
      const idP  = hashid.digest('hex');
      const eP = await eg.ElGamal.initialParametersAsync(N,L);
      let ins = await eP.generateKeyAsync();
      const u = eP.y.toString(16);

      let idQseed = "just a test2";
      hashid =  crypto.createHash('sha256');
      hashid.update(idQseed);
      const idQ  = hashid.digest('hex');
      const eQ = await eg.ElGamal.initialParametersAsync(N,L);
      ins = await eQ.generateKeyAsync();
      const v = eQ.y.toString(16);

      ins = await DAEKeyexchange.Initialization(addrstr[0],idP,u);
      ins = await DAEKeyexchange.Initialization(addrstr[1],idQ,v);


      //for Q
      ins = await exchangeContract[1].getIdBasic(addrstr[0]);
      const addrP = ins[0];
      const pkP = ins[1];
      const idPpi = ins[2]; 
      if(!(addrP === addrstr[0])) {console.log("error1"); return;}
      const com = await eQ.computeSecret(pkP);
      const hashforkey =  crypto.createHash('sha256');
      hashforkey.update(pkP + v + com);
      const keystr  = hashforkey.digest('hex');
      const kQ = keystr.substring(0,32);
      const k1Q = keystr.substring(0,24);
      const pk1Q = await eQ.computePk(k1Q);
      const k2Q = keystr.substring(0,20);
      const pk2Q = await eQ.computePk(k2Q);
      const hashforsig =  crypto.createHash('sha256');
      hashforsig.update('1'+ pkP + v);
      const sigstr  = hashforsig.digest('hex');
      const delta1 = await eQ.signAsync(sigstr,N);
      const d1a = await eQ.encryptAsyncExt(delta1.a.toString(16),pk1Q);
      const d1b = await eQ.encryptAsyncExt(delta1.b.toString(16),pk1Q);
      const eidQ = await eQ.encryptAsyncExt(idQ,pk1Q);
      const c1 = d1a.a.toString(16)+ '||' + d1a.b.toString(16) + '||' + d1b.a.toString(16)+ '||' + d1b.b.toString(16)+"||"
                +eidQ.a.toString(16)+ '||' + eidQ.b.toString(16);
      ins = await exchangeContract[1].setStrforCommunicator(addrstr[1], c1);
      
                
      //for P
      ins = await exchangeContract[0].getIdBasic(addrstr[1]);
      const addrQ = ins[0];
      const pkQ = ins[1];
      const idQpi = ins[2];
      if(!(addrQ === addrstr[1])){console.log("error2"); return;}
      const com1 = await eP.computeSecret(pkQ);
      const hashforkey1 =  crypto.createHash('sha256');
      hashforkey1.update(u + pkQ + com1);
      const keystr1  = hashforkey1.digest('hex');
      const kP = keystr1.substring(0,32);
      const k1P = keystr1.substring(0,24);
      const pk1P = await eP.computePk(k1P);
      const k2P = keystr1.substring(0,20); 
      const pk2P = await eP.computePk(k2P);
      const c1pi = await exchangeContract[0].getStrfromCommunicator(addrstr[1]);
      const ciphertext = c1pi.split('||');
      const d1api = (await eP.decryptAsyncExt({'a':ciphertext[0],'b':ciphertext[1]},k1P,pk1P)).toString(16);
      const d1bpi = (await eP.decryptAsyncExt({'a':ciphertext[2],'b':ciphertext[3]},k1P,pk1P)).toString(16);
      const delta1pi = {'a':new BigInt(d1api,16),'b':new BigInt(d1bpi,16)};
      const idQpi2 =  await eP.decryptAsyncExt({'a':ciphertext[4],'b':ciphertext[5]},k1P,pk1P);
      if(!(idQpi === idQpi2.toString(16))){console.log("error3"); return;}
      const hashforsig1 =  crypto.createHash('sha256');
      hashforsig1.update('1'+ u + pkQ);
      const sigstr1  = hashforsig1.digest('hex');
      if(!(await eP.verifyAsync(sigstr1,delta1pi,pkQ,N))){console.log("error4"); return;};
      const hashforsig2 =  crypto.createHash('sha256');
      hashforsig2.update('2'+ u + pkQ);
      const sigstr2 = hashforsig2.digest('hex');
      const delta2 = await eP.signAsync(sigstr2,N);
      const d2a = await eP.encryptAsyncExt(delta2.a.toString(16),pk2P);
      const d2b = await eP.encryptAsyncExt(delta2.b.toString(16),pk2P);
      const eidP = await eP.encryptAsyncExt(idP,pk2P);
      const c2 = d2a.a.toString(16)+ '||' + d2a.b.toString(16) + '||' + d2b.a.toString(16)+ '||' + d2b.b.toString(16) + "||"
                + eidP.a.toString(16)+ '||' + eidP.b.toString(16);
      ins = await exchangeContract[0].setStrforCommunicator(addrstr[0], c2);

     

      //for Q
      const c2pi = await exchangeContract[1].getStrfromCommunicator(addrstr[0]);
      const ciphertext2 = c2pi.split('||');
      const d2api = (await eQ.decryptAsyncExt({'a':ciphertext2[0],'b':ciphertext2[1]},k2Q,pk2Q)).toString(16);
      const d2bpi = (await eQ.decryptAsyncExt({'a':ciphertext2[2],'b':ciphertext2[3]},k2Q,pk2Q)).toString(16);
      const delta2pi = {'a':new BigInt(d2api,16),'b':new BigInt(d2bpi,16)};
      const idPpi2 =  (await eQ.decryptAsyncExt({'a':ciphertext2[4],'b':ciphertext2[5]},k2Q,pk2Q)).toString(16);
      if(!(idPpi2 === idPpi)) {console.log("error5"); return;}
      const hashforsig3 =  crypto.createHash('sha256');
      hashforsig3.update('2'+ pkP + v);
      const sigstr3 = hashforsig3.digest('hex');
      if(!(await eQ.verifyAsync(sigstr3,delta2pi,pkP,N))){console.log("error6"); return;}
      
    });

   

  });


});