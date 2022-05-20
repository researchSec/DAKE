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
  let addrstr = new Array(bn);
  let exchangeContract = new Array(bn);
  let N = 256;//224;//160;
  let L = 3072;//2048;//1024;
  const versionNum = 30000;//20011;//20001;//20000;
  const abi = [
    "function Initialization(address iUser, string calldata iID, string calldata iPK) external",
    "function getIdBasic(address iUser) external view returns (address,  string memory, string memory)",
    "function updateCert(address iUser, address iPK) external",
    "function setStrforCommunicator(address iUser, string calldata str) external",
    "function getStrfromCommunicator(address iUser) external view returns (string memory)"
  ];

  let overrides = {

    // The maximum units of gas for the transaction to use
    gasLimit: 6400000,

    // The price (in wei) per unit of gas
    gasPrice:  ethers.utils.parseUnits('5', 'gwei'),


  };
  addr = await ethers.getSigners();
  exchangeContract[1] = await new ethers.Contract("0xfaB4d9B1D64334104D157873f04B84c7ff52c8b3",abi,addr[1]);
  addrstr[0] = addr[0].address;
  addrstr[1] = addr[1].address;
  let start = Date.now();

 
  let idQseed = "just a testQ";
  const hashid =  crypto.createHash('sha256');
  hashid.update(idQseed);
  const idQ  = hashid.digest('hex');
  const eQ = await eg.ElGamal.initialParametersAsync(N,L);
  const sk = "735bcc72fb5070a7434e21ec0ef3d680805c2123e3e853517675df7b9f13fc3c1d0ca45d891b51331cd033c72f636326b9835be89e57f6ee085f0de4dcacfa18a3cf2492a266deeda02d4efc4a1621c0a45442de08d2486b60ea4405865e3fe41b401f049ae9df80ad48d6dd0c9037ee11be6fce7b9e585777d8813d4def05ec6b6d39a6ab8ef82147d9dc75964ae3d99130241817d10c2bef048f1adcd8b3c2ec3b5688aa0c8090234032066608c063a318aa1c45c86c627929af0492b3b4add605e48ac46a53b243f5985e3d5015498b6659dddc060ac862bd79980a0c5bba1ac138a6b34f32e2d75e625ea27c18ad37789639e4a2f092d942c1526399efbd8f6f309a98120d494e3758e9434bc3a640f43dcc8179269625d5fec7ce0b389b1e895a1b5e3553589d70d94f96a2e6a8fbc6fce5bc26bec921c303928e6cf465d912ee49b3fae03cb536f7c5a64e53218f5748b7fe60d5ffc740e42807d888d5ee08857ff83547dc3f6ce1402d5c255ee1e0087adc62e7fe46ef2c08b4ceb5e9";
  const pk = "409498c9c84316f910605a1edefb1dd4a217a02f7dae23628b2b619e95aba5af0b1fd62eee797a4762bd19fb4d3dcf7963c5026800e51011ddd31443bd37aeb029cb0cb44ea4fd0c7e029b5796dc26fbf52e323e302c69dcc56ce2761683de33c485093f2539e74353aa0467b03a2b7858568561e59fcec08c259cf5602991c7b269e71d0582bc0ddda33a7515a65f618da7d2dcb36547443586c77bc3dee12a145a5a8e4c8633ac06e387b812f9f29276c058f76efa9362e65e83829f3cd1c94279873758035dfd369cb48b0b0aa9eddac23a4173ad40ec4cb0f69b3b3c41676619396cc6f9e3ef08b78a2caeb80f0651913474a0ff4305caa6b7479c353f9822918b9247fe3e41e1c37a1cc832ab2b5d315628558d86657d2a585961f889b59fd0daa41fdf63e7b7e5ab6598a3fdc308ab98b073d2424b81933c4bfb9b07e55a108ea0b5d03c98a3e938a1200390d3b03ecba322d95b0cfebaf85efd8728baf0c396f40525cc4d81c8784e055c1a6e9dc75e856ed640a8b4fc23bbbb719a2b";
  let ins = await eQ.assignKeyAsync(sk,pk);
  if(ins == 0) {console.log("error1"); return;}

  ins = await exchangeContract[1].getIdBasic(addrstr[0]);
  const addrP = ins[0];
  const pkP = ins[1];
  const idPpi = ins[2]; 
  if(!(addrP === addrstr[0])) {console.log("error1"); return;}
  const com = await eQ.computeSecret(pkP);
  const hashforkey =  crypto.createHash('sha256');
  hashforkey.update(pkP + pk + com);
  const keystr  = hashforkey.digest('hex');
  const kQ = keystr.substring(0,180);
  const k1Q = keystr.substring(0,224);
  const pk1Q = await eQ.computePk(k1Q);
  const k2Q = keystr.substring(0,256);
  const pk2Q = await eQ.computePk(k2Q);
  const hashforsig =  crypto.createHash('sha256');
  hashforsig.update('1'+ pkP + pk);
  const sigstr  = hashforsig.digest('hex');
  const delta1 = await eQ.signAsync(sigstr,N);
  const d1a = await eQ.encryptAsyncExt(delta1.a.toString(16),pk1Q);
  const d1b = await eQ.encryptAsyncExt(delta1.b.toString(16),pk1Q);
  const eidQ = await eQ.encryptAsyncExt(idQ,pk1Q);
  const c1 = d1a.a.toString(16)+ '||' + d1a.b.toString(16) + '||' + d1b.a.toString(16)+ '||' + d1b.b.toString(16)+"||"
            +eidQ.a.toString(16)+ '||' + eidQ.b.toString(16);
  ins = await exchangeContract[1].setStrforCommunicator(addrstr[1], c1);
  


  let time = Date.now() - start;
  console.log(`time for ex2 = ${time} MS`);

  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });


    