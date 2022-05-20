// We import Chai to use its asserting functions here.
const { expect } = require("chai");
var crypto = require('crypto');
var eg = require('../scripts/elgamal.js')
var BigInt = require('jsbn');



describe("DAEKeyexchange3", function () {

  let bn = 2;
  let DAEKeyexchangeFC;
  let DAEKeyexchange;
  let addr = new Array(bn);
  let addrstr = new Array(bn);
  let exchangeContract = new Array(bn);
  let N = 160;//256;//256;//224;//
  let L = 1024;//3072;//3072;//2048;//
  const versionNum = 50000;//20011;//20001;//20000;
  const abi = [
    "function Initialization(address iUser, string calldata iID, string calldata iPK) external",
    "function getIdBasic(address iUser) external view returns (address,  string memory, string memory)",
    "function updateCert(address iUser, address iPK) external",
    "function setStrforCommunicator(address iUser, string calldata str, uint strtype) external ",
    "function getStrfromCommunicator(address iUser, uint strtype) external view returns (string memory)"
  ];

  before(async function () {
    DAEKeyexchangeFC = await ethers.getContractFactory("DAEKeyexchange3");
    addr = await ethers.getSigners();
    DAEKeyexchange = await DAEKeyexchangeFC.deploy(versionNum);
    for(let i=0; i< bn; i++){
      exchangeContract[i] = await new ethers.Contract(DAEKeyexchange.address,abi,addr[i+1]);
      addrstr[i] = addr[i+1].address;
    }
    
  });
  
  describe("Function Tests", function () {
    

    it("DAEK5", async function () {

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
        const exKeysP1 = await eP.generateKeyAsyncExt();
        const exKeysP2 = await eP.generateKeyAsyncExt();
        const galphapi = await eP.addAndPow(eP.x.toString(16),exKeysP1.sk);
        const alphapi = await eP.addExt(eP.x.toString(16),exKeysP1.sk);
        const gu = exKeysP2.pk;
        //send galphapi and gu to Q
        ins = await exchangeContract[0].setStrforCommunicator(addrstr[0], galphapi, 100);
        ins = await exchangeContract[0].setStrforCommunicator(addrstr[0], gu, 200);


  
        //for Q
        ins = await exchangeContract[1].getIdBasic(addrstr[0]);
        const addrP = ins[0];
        const pkP = ins[1];
        const idPpi = ins[2]; 
        if(!(addrP === addrstr[0])) {console.log("error1"); return;}
        const _galphapi = await exchangeContract[1].getStrfromCommunicator(addrstr[0], 100);
        const _gu = await exchangeContract[1].getStrfromCommunicator(addrstr[0], 200);
        const exKeysQ1 = await eQ.generateKeyAsyncExt();
        const exKeysQ2 = await eQ.generateKeyAsyncExt();
        const betapi = await eQ.addExt(eQ.x.toString(16),exKeysQ1.sk);
        const gbetapi = await eQ.computePk(betapi);
        const h1 = await eQ.multiplyAndPow(_galphapi,_gu,betapi,exKeysQ2.sk);
        const guv = await eQ.powSecret(_gu,exKeysQ2.sk);
        const hashforkey =  crypto.createHash('sha256');
        
        hashforkey.update(h1 + guv + _galphapi + _gu + gbetapi + exKeysQ2.pk);
        const keystr  = hashforkey.digest('hex');
        const kQ = keystr.substring(0,32);
        const k1Q = keystr.substring(0,24);
        const pk1Q = await eQ.computePk(k1Q);
        const k2Q = keystr.substring(0,20);
        const pk2Q = await eQ.computePk(k2Q);
        //encrypt exKeysQ1.sk  eQ.y.toString(16) idQ
        const eT = await eQ.encryptAsyncExt(exKeysQ1.sk,pk1Q);//await eQ.encryptAsyncExt(exKeysQ1.sk,pk1Q);
        const eidQ = await eQ.encryptAsyncExt(idQ,pk1Q);
        const c1 = eT.a.toString(16)+ '||' + eT.b.toString(16) + "||" + eidQ.a.toString(16)+ '||' + eidQ.b.toString(16);
        //send gbetapi , exKeysQ2.pk ,c1 to P
        ins = await exchangeContract[1].setStrforCommunicator(addrstr[1], gbetapi, 100);
        ins = await exchangeContract[1].setStrforCommunicator(addrstr[1], exKeysQ2.pk, 200);
        ins = await exchangeContract[1].setStrforCommunicator(addrstr[1], c1, 300);
  
  
        //for P
        ins = await exchangeContract[0].getIdBasic(addrstr[1]);
        const addrQ = ins[0];
        const pkQ = ins[1];
        const idQpi = ins[2];
        if(!(addrQ === addrstr[1])){console.log("error2"); return;}
        const _gbetapi = await exchangeContract[0].getStrfromCommunicator(addrstr[1], 100);
        const _gv = await exchangeContract[0].getStrfromCommunicator(addrstr[1], 200);
        const _c1 = await exchangeContract[0].getStrfromCommunicator(addrstr[1], 300);
        const h1pi = await eP.multiplyAndPow(_gbetapi,_gv, alphapi,exKeysP2.sk);
        const gvu = await eQ.powSecret(_gv,exKeysP2.sk);
        const hashforkey1 =  crypto.createHash('sha256');
        hashforkey1.update(h1pi + gvu + galphapi + gu + _gbetapi + _gv);
        const keystr1  = hashforkey1.digest('hex');
        const kP = keystr1.substring(0,32);
        const k1P = keystr1.substring(0,24);
        const pk1P = await eP.computePk(k1P);
        const k2P = keystr1.substring(0,20); 
        const pk2P = await eP.computePk(k2P);
        const ciphertext = _c1.split('||');
        
        const T = (await eP.decryptAsyncExt({'a':ciphertext[0],'b':ciphertext[1]},k1P,pk1P)).toString(16);
        const idQpi2 = (await eP.decryptAsyncExt({'a':ciphertext[2],'b':ciphertext[3]},k1P,pk1P)).toString(16);
        if(!(idQpi === idQpi2)) {console.log("error3"); return;}
        const gT = await eP.computePk(T);
        
        if(!((await eP.multiplyExt(gT,pkQ)) === _gbetapi)) {console.log("error4"); return;}
        //encrypt exKeysP1.sk  galpha idP
        const edelta = await eP.encryptAsyncExt(exKeysP1.sk,pk2P);
        const eidP = await eP.encryptAsyncExt(idP,pk2P);
        const c2 = edelta.a.toString(16)+ '||' + edelta.b.toString(16) + "||" + eidP.a.toString(16)+ '||' + eidP.b.toString(16);
        //send c2 to Q
        ins = await exchangeContract[0].setStrforCommunicator(addrstr[0], c2, 300);


  
        //for Q
        const _c2 = await exchangeContract[1].getStrfromCommunicator(addrstr[0], 300);
        const ciphertext2 = _c2.split('||');
        const delta = (await eQ.decryptAsyncExt({'a':ciphertext2[0],'b':ciphertext2[1]},k2Q,pk2Q)).toString(16);
        const idPpi2 = (await eQ.decryptAsyncExt({'a':ciphertext2[2],'b':ciphertext2[3]},k2Q,pk2Q)).toString(16);
        if(!(idPpi === idPpi2)) {console.log("error4"); return;}
        const gdelta= await eQ.computePk(delta);

        if(!((await eQ.multiplyExt(gdelta,pkP)) === _galphapi)) {console.log("error5"); return;}

        

   
    });
  });


});