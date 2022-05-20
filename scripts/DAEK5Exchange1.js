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
  exchangeContract[0] = await new ethers.Contract("0xB672cf7c014838Df05B141815D8F65C0D1a3699D",abi,addr[0]);
  addrstr[0] = addr[0].address;
  addrstr[1] = addr[1].address;
  let start = Date.now();


  let idPseed = "just a testP";
  let hashid =  crypto.createHash('sha256');
  hashid.update(idPseed);
  const idP  = hashid.digest('hex');
  const eP = await eg.ElGamal.initialParametersAsync(N,L);
  const sk = "8f17e98b25f12c15ce1950f827c7e8b825519853a664e006a0a9fc977fdb6ec0a3fc0d52d3f5a8a2911d285a3bc2564c4ff6c32185baf29cfff59b75275c0605beba4df0151c166d89253a792f7b717b8918519656efdb38835aa8b321e3c42115f9a742d9db2439e00b452df98e2190a22d2ad6732cc9835094ff0ee49309e28a500d3f72566df2ac2d5a6e94e57ea1a751cb9ffa6829f5e000a7cc581f118f2c028183b066de23fb916d78c50d88723e4e2bbaea7035d17761aa60ddeb363fe0e4f622c2fae3f9fdf9c73f7d84a80922e174e43dae38d7abda34fe1a0b09d41a0637c87d8ee22422bfb3924f2b862d71e2cb8c36226c93fd07c27edad53160c840a7169af347b0609335dce66bfca14714819839cfbc5b26e259434835b32335f3b9b6af546f9732dea7a20e9ce20bd238eb9dc010ecaafa55ca02ecff55255749b0e8f68d2c5896861db12787b218db58803048df4c0fd53cc526b6d92a1ff0033f0261846397c0ad329c6b1923b0942133a57b2a6b706b1ca457602e871d";
  const pk = "598951fe1656c604675a400bbd0a74399aab84d4d160fb87d665f04bbbdf7cc960212cde873315d131f0329329b9bd46c5816ac2cbed4cfd6b64692c8676add5769deb479e0b4e7b55901a2b0ae02ea1d9542cd74c2cbd45d7f5eacf3dd96519badab9ce6d731c4bafb422d1fac1bc01d14c43276bb57cdb3c3556ff0088beff0da79688dea4451a7c39d1931c50191b1644829a8dd621023d23b296f246def0feb7ef9ca2869fb14bb58f36f9d1bb07bdb9f6813d4f30a9887eec12896d8f35da70c819a942631636ff8c5059f7150a386ec0d58a2a5a5053524a8ef93a392a9e684c31a6d5f774350e86f80277a4f00bfc60b81d1bcc63412b089726018f1a5cf511c4b45729789ee6872c9390da6685c3871a793680fe262f0eef3f8fd3d0145a1fc220ec6bc5bc385c4465dbbe64945975b32258f77c08b49e2c55e7e0ab42eee848faa4db4d3e0ef9098b7e0a3699d1a8ab22c3afeede3be21620820316373630b99ff7a1b997f941f2b4efb276d4eaa3ad7c1b651972511c2dd7095155";
  let ins = await eP.assignKeyAsync(sk,pk);
  if(ins === 0) {console.log("error");return;}
  
  const exKeysP1 = await eP.generateKeyAsyncExt();
  const exKeysP2 = await eP.generateKeyAsyncExt();
  console.log(exKeysP1.sk);
  console.log(exKeysP1.pk);
  console.log(exKeysP2.sk);
  console.log(exKeysP2.pk);
  const galphapi = await eP.addAndPow(eP.x.toString(16),exKeysP1.sk);
  const alphapi = await eP.addExt(eP.x.toString(16),exKeysP1.sk);
  console.log(galphapi);
  console.log(alphapi);
  const gu = exKeysP2.pk;
  //send galphapi and gu to Q
  ins = await exchangeContract[0].setStrforCommunicator(addrstr[0], galphapi, 100);
  ins = await exchangeContract[0].setStrforCommunicator(addrstr[0], gu, 200);


  let time = Date.now() - start;
  console.log(`time for ex1 = ${time} MS`);

  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });


    