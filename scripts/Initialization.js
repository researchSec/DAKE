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
  for(let i=0; i< bn; i++){
    exchangeContract[i] = await new ethers.Contract("0xEF73E0CA4cd8aFea6D9Db4699131ba2ce89906D6",abi,addr[i]);
    addrstr[i] = addr[i].address;
  }
  let start = Date.now();
  let idPseed = "just a testP";
  let idQseed = "just a testQ";
  let hashid =  crypto.createHash('sha256');
  hashid.update(idPseed);
  const idP  = hashid.digest('hex');
  hashid =  crypto.createHash('sha256');
  hashid.update(idQseed);
  const idQ  = hashid.digest('hex');

 
  
  //const eP = await eg.ElGamal.initialParametersAsync(N,L);
  //const skp = "3d702063f223d4a0d8f9da37253845a4e1106280c068c78f7a5386dcea1d3f7c25d9d6b6142af0ba3a955a18eb31f36b07e355ffa05481ad067e64a5561a70104407e0bc1c7368c2a9ad46de4c9ad42a822d47c7db04f19a2ad83207a93ed662e0d77dd171a4f5955c934bdba13effc0923c645008bf9026d16a46ff1e5c0874";
  const pkp = "598951fe1656c604675a400bbd0a74399aab84d4d160fb87d665f04bbbdf7cc960212cde873315d131f0329329b9bd46c5816ac2cbed4cfd6b64692c8676add5769deb479e0b4e7b55901a2b0ae02ea1d9542cd74c2cbd45d7f5eacf3dd96519badab9ce6d731c4bafb422d1fac1bc01d14c43276bb57cdb3c3556ff0088beff0da79688dea4451a7c39d1931c50191b1644829a8dd621023d23b296f246def0feb7ef9ca2869fb14bb58f36f9d1bb07bdb9f6813d4f30a9887eec12896d8f35da70c819a942631636ff8c5059f7150a386ec0d58a2a5a5053524a8ef93a392a9e684c31a6d5f774350e86f80277a4f00bfc60b81d1bcc63412b089726018f1a5cf511c4b45729789ee6872c9390da6685c3871a793680fe262f0eef3f8fd3d0145a1fc220ec6bc5bc385c4465dbbe64945975b32258f77c08b49e2c55e7e0ab42eee848faa4db4d3e0ef9098b7e0a3699d1a8ab22c3afeede3be21620820316373630b99ff7a1b997f941f2b4efb276d4eaa3ad7c1b651972511c2dd7095155";
  //let ins = await eP.assignKeyAsync(skp,pkp);
  //if(!(ins === 1)) {console.log(error1); return;};
  //const uP = eP.y.toString(16);
  //console.log(eP.x.toString(16));
  //console.log(uP);
  //const secret = await eP.generateKeyAsyncExt();
  //const u = secret.pk;
  //console.log(secret.sk);
  //console.log(secret.pk);

 // const eQ = await eg.ElGamal.initialParametersAsync(N,L);
  //ins = await eQ.generateKeyAsync();
  //const skq = "b3f4c5bd94d1f59bc712d9f6cf0889ef3dbfd83c432c02503bbe3f033c7d67d3fcaef1c6b33a91bec9d24167ab7efa0f13aac86722701adbd5bbddf339daa441d9a49f956e5ea7794a1d054884d785381e9818e32482c0209349a9f5aeecc468c47cce360f49f3e52da7d4849d608c91bdfe7bf02a70a9136d078f7db5626459";
  const pkq= "409498c9c84316f910605a1edefb1dd4a217a02f7dae23628b2b619e95aba5af0b1fd62eee797a4762bd19fb4d3dcf7963c5026800e51011ddd31443bd37aeb029cb0cb44ea4fd0c7e029b5796dc26fbf52e323e302c69dcc56ce2761683de33c485093f2539e74353aa0467b03a2b7858568561e59fcec08c259cf5602991c7b269e71d0582bc0ddda33a7515a65f618da7d2dcb36547443586c77bc3dee12a145a5a8e4c8633ac06e387b812f9f29276c058f76efa9362e65e83829f3cd1c94279873758035dfd369cb48b0b0aa9eddac23a4173ad40ec4cb0f69b3b3c41676619396cc6f9e3ef08b78a2caeb80f0651913474a0ff4305caa6b7479c353f9822918b9247fe3e41e1c37a1cc832ab2b5d315628558d86657d2a585961f889b59fd0daa41fdf63e7b7e5ab6598a3fdc308ab98b073d2424b81933c4bfb9b07e55a108ea0b5d03c98a3e938a1200390d3b03ecba322d95b0cfebaf85efd8728baf0c396f40525cc4d81c8784e055c1a6e9dc75e856ed640a8b4fc23bbbb719a2b";
  //ins = await eQ.assignKeyAsync(skq,pkq);
  //if(!(ins === 1)) {console.log(error1); return;};
  //const v = eQ.y.toString(16);
  //console.log(eQ.x.toString(16));
  //console.log(v);
  //ins = await exchangeContract[0].Initialization(addrstr[0],idP,uP);
  //ins = await exchangeContract[0].Initialization(addrstr[1],idQ,v);
  ins = await exchangeContract[0].Initialization(addrstr[0],idP,pkp);
  ins = await exchangeContract[0].Initialization(addrstr[1],idQ,pkq);


  let time = Date.now() - start;
  console.log(`time for initialization = ${time} MS`);

  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });


    