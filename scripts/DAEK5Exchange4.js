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
  const versionNum = 50000;//20011;//20001;//20000;
  const abi = [
    "function Initialization(address iUser, string calldata iID, string calldata iPK) external",
    "function getIdBasic(address iUser) external view returns (address,  string memory, string memory)",
    "function updateCert(address iUser, address iPK) external",
    "function setStrforCommunicator(address iUser, string calldata str, uint strtype) external ",
    "function getStrfromCommunicator(address iUser, uint strtype) external view returns (string memory)"
  ];


  let overrides = {

    // The maximum units of gas for the transaction to use
    gasLimit: 6400000,

    // The price (in wei) per unit of gas
    gasPrice:  ethers.utils.parseUnits('5', 'gwei'),


  };
  addr = await ethers.getSigners();
  exchangeContract[1] = await new ethers.Contract("0xB672cf7c014838Df05B141815D8F65C0D1a3699D",abi,addr[1]);
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
  
  const _galphapi = "1d81664ee2465bfacd4d43239f18c0435d4c5b79670c9080faa1de2d1c5d834b06d9893667805278f5c468627f6e3cdbd571bbaa627ea7ae10af4b95200e97cc4c4c43c24b17bc5d18bd9abe147e5e80ffc06ae845ca2ff0c325142fe94aa24ae4784a13b913a8f81a9add1eca6b958061e3e0414718937269068b43c8d016452738a3f591672eb7bc7bf6c9439079a800ae8a234d46c9fbb39aad97ec23b6d9994ad833ecbc0d78ed7ac08b6e9292ccb60184a1379786ebe98707eb180416458b5e7169c7edfa03bb0bd2bd82511bd88d5a32d69293a6728d2fe49a9ca80922032e03acd9c112b4ec4c4aadf5ee5f0adb8f48317bb3fe8a1b1bc3a0c2fe05afacb920ee01b50d657edcba0f6d16aef5a90e3ca7edab11c2d38f4a848bd44189af43696d58bf98d090120ae2abb6764f2c4dad16ad43c993e8d6562dab4df4524581239388dca10079c65d8ad4299a13d36f426e82c40be16f37ac2cc5fe472cf95c85135411abae1ffef63f2d1458c5b11083b922b1c83edf503fa548001a5c";
  const k2Q = "1a7538e11f069a072a2b0ff6dc7c0b2835beae777cd35127289772acc2c32682";
  const pk2Q = "46c9150d5ec00a323108d5e7c9eb5bce8969bf2145715ebc9f0cefa46cb544b064d35bd6187085358b5e168c3480e7a5af7b7e91cbda63715284f15867cb5e604f30228e49faea92992842d4e60bf5f141b303569c6d422d904fe4cfc10d50b72e9849feaf35a4d3a42aa6e7d05ff333c7aace5dedeef7be4f9d413c7057688a424958e813ae81d8f72510f7de5bb4195d0a8471b50c8d4ed847e66ec75c3b79c8735e50186fa72db7ff2d62ec620f451dd650744004a55fd76c59902fd9b10dd9b477c8e63ee21dd4044388dcbcf5e82ce2f7d1a486d8f6221abf7fa11137a13d3523530310f28959e4fa89ff2abaf397e5933b7997ccb9670f843de9b319e63667af7ca74cce339e7afba0845ba3007d4c894b2be55a6f2c6ada8c27fbab0649dc8ac267b4d14c2f28c27dfb280367d3254f8c7e6dde02143bec3674625317a82acf736b5617b0660d088e0c48d1f852ca31982e819a6e5ec71c71f242145b726927bbd843a15c106ded82c86ad21bb8727eab8b87880de50740831f85df84";
  ins = await exchangeContract[1].getIdBasic(addrstr[0]);
  const addrP = ins[0];
  const pkP = ins[1];
  const idPpi = ins[2]; 
  if(!(addrP === addrstr[0])) {console.log("error1"); return;}
  const _c2 = await exchangeContract[1].getStrfromCommunicator(addrstr[0], 300);
  const ciphertext2 = _c2.split('||');
  const delta = (await eQ.decryptAsyncExt({'a':ciphertext2[0],'b':ciphertext2[1]},k2Q,pk2Q)).toString(16);
  const idPpi2 = (await eQ.decryptAsyncExt({'a':ciphertext2[2],'b':ciphertext2[3]},k2Q,pk2Q)).toString(16);
  if(!(idPpi === idPpi2)) {console.log("error4"); return;}
  const gdelta= await eQ.computePk(delta);

  if(!((await eQ.multiplyExt(gdelta,pkP)) === _galphapi)) {console.log("error5"); return;}
 
 
  let time = Date.now() - start;
  console.log(`time for ex4 = ${time} MS`);

  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });


    