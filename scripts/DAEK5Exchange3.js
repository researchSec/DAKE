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
  
  ins = await exchangeContract[0].getIdBasic(addrstr[1]);
  const addrQ = ins[0];
  const pkQ = ins[1];
  const idQpi = ins[2];
  const exKeysP1sk = "2be1dff1dfc4d96702a3d461343afcef8748740c1610c8514042009af110c691c7a6b61bc86e85ee6831bd7723e1f90fa8fe03a2c8a842ca117b47d4f1423793bcbedb3232855cb564310b8f42d6c59cfdecde7430e86191fd0898016bd59537bda8b36ea74832c40cd7c13c2f0b30e63945c1732db26be677b19d419b4c4592595188e278d81bad7d7abc69739f28d1baf680897bc19f772a2472e83929d92417b8188d069c1426823a8a7b51128a22c530095c417a974d4f25fd299be11e885584221a0ad5d1c9744fd89a87b4e5ef331fd4ae566658571a7d449d6f6af604965021269d224121480b9f09fc39553c90b759428f397e976fc4e14f2630ce2f197016d1ac43c6f99640e6c7033af94742a3eb26a8fde8443c1e4cd4b503d3a96d40dc6000ef79bacbc7bc51c92b16f2002932d39f1c7480f232ffc2310fa28abdc63f9786b23d11c7e42c856df9484b6e10845de5ea7831c0cf8d569893f3a94563aac35dc513b033872718a70dbb7049e03e33e41fefa203c6e12bab4dd98b";
  const exKeysP1pk = "1d5fb0df4db62c359ae3beeae0f24a325ba35e98db52e20c9705d34e6faa27d046eb6f4b7a73ed5fe9c46e26608281eaf015986193d4b63ffdf809f146c352130e9d84e550ce5b4720030975bbd68c23a052dd652a82d49035fbdb24ad5123b5e669abeb22563527dcad6455da87f4d8140c3562566db0e79929ecc0514b641ec9ecfb547a8eec64c2ac04f7c237bdbc2a5c1cbe5a97d484f45956299ebd7ea6c4073dcad60dc26bd386397b3410f479568e81514dde1370e56db8729551c4ff643077bcbfbf4e708bedd3832e04969fa71c60423c01e6830a1dc9679fcca67df1877d7822665e86c95a9e2044d1e02c7dd1a082e7fcbf3ff9ba2c9284f6cf1a6961d4098da5a4ec7624198368779ebefad1df7b6152f328860336a7edde385952c6d63090dff4cafe77be56f0926ef9340971d4f99671b560763087dcc60e75967c5f48413284c45109a6e55bd1cc2ce615d39e857a0d75326e265292d76d043b8f59ac55e58bd79c19174915cfef93d9b72052ef3d7250f3ae385a3391ab20";
  const exKeysP2sk = "2f6997f7fc690d02b863d8ae842c9f667bbc8286daaffc4dfa6baba3c3bedd5d0a2e8083d06c994a925c44123f3c873725c1dca815fe5d648b651fcb6c00fbe3a5c3ca79ff3fdcdef8a45c91599456d8e9afcd36a8fa9fb921a1aa49b7f314a3b30fd39ff5a90b5d50916194805953be2762fbee99ff844bc203284f77b46c79b949c21591d3e94189338e8b3421cd95f43196ebb7cd3aa40cbdb64d62b8361fdc865380f686b1a4056fa7b808b929e25a745f8dd9efb1f6b7eb27d6d2c71cdaa51e152529077fd5c173886d079c2f8e6bd7fd9f60e715a5bb9fb411ed3f5efef015c751884c7a41a457e67cbcce11a8a64f861f1ed9a19854ba1a7f432cb51918343f8ca35ac2f8bc798cfbc0959bf433f48b2b363ecaf373f6de94d0a8bcacdb41aeadcd722cdbe72f9b6eddddb4b2839a4de3788835050a652c256052b0c9cb8f7174d10935bddb49b1ad951eea23831c36339117ddccb9bef044636aabbcf4ca6a4337f351b180f4df9de8c20a2dc37ec8e992cad60a937cff4d410dfc88";
  const exKeysP2pk = "5ef926a9e1fbcc61d974e63605464184cbdd946645d9369fd9e44ccd6ac181cb3d4fb660ccf6966bdc05d6afb5d6bf8b07b61924c58679c01ab3ed8b2a407bc34b788d6ba263c1b4ba7692c46d2fcb01e75995958d34ba9b129927e04fec180ff8a250c9b62e1601f2138526a331ab5bf9b3db4b115dced51cf266f3110a30ca4a47a216b27aad0c1fe6984272f4936efd2933c9f0797dd02cf2cbdbffe2b009bd80d22f23aac8da40a64c6f7e42e1a1acd7420d451d568ddebb16c86977a0d01e7e4db77512dab434fbbefcfc20f841c8c70311c40b7748a408d078c336b0c908be9fe153d8931c62a3b362eac7b0bfae809eb7950e37b71dca3bc3ec3976410db87ae15b314666d5fd6c47e55347216dee3af070c9f1b446b65e7a12e90a6413a26d2c564df7e064d066ab52ff9be2e3ad4d6a43a9e02d32d6a9d6055d8bdf20f358fdf52ef72b6ddf69b83d5b100f6ebb9001c31a668cf23a8961022a2748ada1fdd7a2c99ef6259e28c904a35f406627048573e01ad5b7c0a6eccb384b13";
  const galphapi  = "1d81664ee2465bfacd4d43239f18c0435d4c5b79670c9080faa1de2d1c5d834b06d9893667805278f5c468627f6e3cdbd571bbaa627ea7ae10af4b95200e97cc4c4c43c24b17bc5d18bd9abe147e5e80ffc06ae845ca2ff0c325142fe94aa24ae4784a13b913a8f81a9add1eca6b958061e3e0414718937269068b43c8d016452738a3f591672eb7bc7bf6c9439079a800ae8a234d46c9fbb39aad97ec23b6d9994ad833ecbc0d78ed7ac08b6e9292ccb60184a1379786ebe98707eb180416458b5e7169c7edfa03bb0bd2bd82511bd88d5a32d69293a6728d2fe49a9ca80922032e03acd9c112b4ec4c4aadf5ee5f0adb8f48317bb3fe8a1b1bc3a0c2fe05afacb920ee01b50d657edcba0f6d16aef5a90e3ca7edab11c2d38f4a848bd44189af43696d58bf98d090120ae2abb6764f2c4dad16ad43c993e8d6562dab4df4524581239388dca10079c65d8ad4299a13d36f426e82c40be16f37ac2cc5fe472cf95c85135411abae1ffef63f2d1458c5b11083b922b1c83edf503fa548001a5c";
  const alphapi = "baf9c97d05b6057cd0bd25595c02e5a7ac9a0c5fbc75a857e0ebfd3270ec35526ba2c36e9c642e90f94ee5d15fa44f5bf8f4c6c44e6335671170e34a189e3d997b79292247a17322ed564608725237188705300a87d83cca806340b48db95958d3a25ab1812356fdece3066a28995276db72ec49a0df3569c8469c507fdf4f74e3a19621eb2e89a029a816d80884a77362484c297629c96d0a251ab49148eab343ba9a10b702f24a7dcbf7f416201295037e35172beacd1ec687a78a79cc54c83669183ccdd0b5c372499fda05398df8560149929414912ec657799b8975ffd8b05658ef1ab123456acb529c4b64db6a029a24cec55beb2b6ccca3ce0105ff8fe1b0bde847370ea9f6d41ca3e9a6f5e889b86cbee2cda49f6300a617fd3986cca3349616b043e951fea663f3d7c7f8fdd2621e715f2d612bec88c9c51e0ef7b0150ff0807d3f696a5e6a4a369580fa644969048e2ec9c441960c527d4f6d1dc93566e9c5bf497747f43459b51226df20de0171d95f4a5b126ee385830b7c60a8";
  if(!(addrQ === addrstr[1])){console.log("error2"); return;}
  const _gbetapi = await exchangeContract[0].getStrfromCommunicator(addrstr[1], 100);
  const _gv = await exchangeContract[0].getStrfromCommunicator(addrstr[1], 200);
  const _c1 = await exchangeContract[0].getStrfromCommunicator(addrstr[1], 300);
  const h1pi = await eP.multiplyAndPow(_gbetapi,_gv, alphapi,exKeysP2sk);
  const gvu = await eP.powSecret(_gv,exKeysP2sk);
  const hashforkey1 =  crypto.createHash('sha256');
  hashforkey1.update(h1pi + gvu + galphapi + exKeysP2pk + _gbetapi + _gv);
  const keystr1  = hashforkey1.digest('hex');
  const kP = keystr1.substring(0,180);
  const k1P = keystr1.substring(0,224);
  const pk1P = await eP.computePk(k1P);
  const k2P = keystr1.substring(0,256); 
  const pk2P = await eP.computePk(k2P);
  const ciphertext = _c1.split('||');
  
  const T = (await eP.decryptAsyncExt({'a':ciphertext[0],'b':ciphertext[1]},k1P,pk1P)).toString(16);
  const idQpi2 = (await eP.decryptAsyncExt({'a':ciphertext[2],'b':ciphertext[3]},k1P,pk1P)).toString(16);
  if(!(idQpi === idQpi2)) {console.log("error3"); return;}
  const gT = await eP.computePk(T);
  
  if(!((await eP.multiplyExt(gT,pkQ)) === _gbetapi)) {console.log("error4"); return;}
  //encrypt exKeysP1.sk  galpha idP
  const edelta = await eP.encryptAsyncExt(exKeysP1sk,pk2P);
  const eidP = await eP.encryptAsyncExt(idP,pk2P);
  const c2 = edelta.a.toString(16)+ '||' + edelta.b.toString(16) + "||" + eidP.a.toString(16)+ '||' + eidP.b.toString(16);
  //send c2 to Q
  ins = await exchangeContract[0].setStrforCommunicator(addrstr[0], c2, 300);

  console.log(kP);
  let time = Date.now() - start;
  console.log(`time for ex3 = ${time} MS`);

  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });


    