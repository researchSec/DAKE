const ChainsqlAPI = require('chainsql');
const chainsql = new ChainsqlAPI();
const crypto  = require('crypto');
const secp256k1 = require('secp256k1');
var eg = require('../scripts/elgamal.js')
var BigInt = require('jsbn');

async function start() {
  let N =256;//224;//160;// 256;
  let L = 3072;//2048;//1024;//2048;
  const versionNum = 10011;//10000;//10001;//10010;

  await chainsql.connect("ws://");
  
  const users = [
  {
    secret: "pwkpNabzRpiVVyoySFPYkE9tngvcokG3BFuEHXpv8hzz9JDbiZN",
    address: "znZq1NAg2qqHsFR6ymdE8pjKH7hKouVcUy",
    publicKey: "pYvGmm3LY8XGTEKNQYAxgFtACTaGWrB56bkhAEZ5sQpt6McPxq8p9n3b3B6Xhrcn1WVNN2BzuRUMiV3WbyAcUibvasd79CCQ"
  },
  {
    secret: "p9KVpT7s9Nen8zrE9ewvDT6XfA5Gq2zFnJToinSmJxxAaZiR1EV",
    address: "zKTVpwifYoNVSbKAgo4RB8WuKmSkoBQ3kQ",
    publicKey: "pYvEWveWAPgyG6MW9sgCC3y9HGg1JzqbLh7aZ22X4jNvcDQK7tFZ4NjQumoKxFqJjNLX9mgwsPHino7JW54zfrAbaF7hMvjy"
  },
  {
    secret: 'pwjuoFKmJxNBNhE9JD9QUhM1y1CuhujhepXPCVMpgB4XX9Cmgm7',
    address: 'zBuJrwhcgkRySBuFPDFQpncvAbgoPBpiZp',
    publicKey: 'pYvUQ42fnuGhYJoH5yR2rsjbbz6JSCxax2CugtAaBKzv9YCLtrEYo14gGPYioqgtMUj47iqLd5NJ9EdRQe8U6fQqyLPVeLHv'
  },
  {
    secret: 'pw6qoHoCZ1HTiCRZSX3RJAfkXc1Ko9ktQCZzjKT31H2udzw5QAC',
    address: 'zJ9gJNLrczh8JRi2evPTWrXJZcjxdZUBn8',
    publicKey: 'pYvpNMcNxxi7W1JcGpYyRAhiAp9AwdG6VqaWPQPvhE6HGkf4CzkpddvCWdK1mJ1e8mic16AVsHmvngSbpSKpzDURm3hQ7TNM'
  },
  {
    secret: 'pwocX7DL8GqFf8XwiW1AMneRQKTWAvX28wAeoKrJbooZszrLW7V',
    address: 'zwDQ3WwEuCNfzhVWMiymMHu23PtK6uciVa',
    publicKey: 'pYusnZCpzGeT8uiSSS5cahVTVDVYLESdUYa6WMt65RfeVGH5pr1dYw216drxxRhtCov3ZtijAep2dvU8n3Y9fQM7ECESBik7'
  },
  {
    secret: 'p9bTSKhfg3egR899VcgEYXEgzuCeyLPu93bBffnsN5C1KeJHrg8',
    address: 'zMFpoc1h8i6qkeMyWXqSXcpNZr8wwaeGEb',
    publicKey: 'pYvc4PJdPSmp3Vmyf75HxCsXNUDTDyN2epKXrb2UEcGborEkqXe6d73vzFNQNXBet5Wv8WpptShQKzw3Wi5qNjgMTo3XVdqq'
  },
  {
    secret: 'pwAgh8sTy9EaMSEbVtkw53cQnfZMB3QU5LCAkPuYiyuvGdZbmQy',
    address: 'z9Y2xn8gsDsGiN3BfmgYeH15jcPeYq1bxQ',
    publicKey: 'pYvx9WPbQdiWDbgDvbGdBZmjC5rJ8K2mdugx1u6ewbchPdPFrWGTQqXCCfjAW8DjxwLakk5qgaMWaWNSsGTDCYjPHydqdG79'
  },
  {
    secret: 'p9d4hvZZLhWmZ2Vg5LMPRSdEw3nnmgsqdDLZcJ73YEeiv5TmDcT',
    address: 'zwFaNGa3AJ3dfue8GEFeWZ3AjAQBypMB1Z',
    publicKey: 'pYvKkwDN7YbCJfNk9xzdq5NkCP7HV4NNnZEmfYPwzrfmi1Jy7x1doQHpyRTi237pfaaQMj99kSuFqXLMmAjCANRdR9JSzoso'
  },
  {
    secret: 'pwQppRpTohWXRGtjXdqEmYryCWmi24FuS8Qkt4Lkmj7Pu2fGurD',
    address: 'zJhBn3hHGUYgBvXWrgKLKemvgmqaYykQHc',
    publicKey: 'pYvLB3tvQsGQr9fivkCtcVG66Yxnw767i4eQFibfXnsb97B4sVFWi32xo6zprw995sEGeR7qXU6MTrknwsbhSCjRGJPbvP9f'
  },
  {
    secret: 'p9LU3c9SqQ7BoL9Dkun9dPVRdkQahNDSKtRMwx52SKfo2mpvLs9',
    address: 'zHibVreS9H4Vxf1sTX1Q1pqpZaWaTwNaDj',
    publicKey: 'pYvpz9Y8EhgKL24sASyQQVFswUMkAWtXPo179WGyvi3YMercj8E2gArc2VQ1Q2bYJRVcAkwA5VY21uzwnYrpq3SSRxVVidaH'
  },
  {
    secret: 'pwzuuSRCDnE9ToyKB3ZKQ3Zo3jEriNLFL8ncDqi27wCSUffUs5j',
    address: 'zJTX1VscHW82Xgm3Aq2mMCaYJaxzijW2MD',
    publicKey: 'pYvwSfvzirMzbcVs5fz2YQ3Gd7XdzaxDT7iTDtw9ChTSUR2wKN5ApKUwtTDBYXPK31Mr16t5zKCiANWRmU3DvV6ZkLExrqQy'
  },
  {
    secret: 'pwhZ662dwPkSPtQc5xCpFgubfzk8X8PKxbzxXhJeWM37xdrZzp8',
    address: 'z4W3suUrKJ8uDasxGbx8HwNpJVd3yACQSF',
    publicKey: 'pYvRRotEJfUww3AotqzEPaaUmHGvpTbcaA8aUYFLhtoVNL5FtcC3DAxuruvHDBEvpFk7MGm4FbNPv6XSkXj4Y5nBgy92fx4a'
  },
  {
    secret: 'p9Ba6J8qd7TYSxVtPiad559rkpRFkGAYgiqaWYuyQ1NxaikUpg6',
    address: 'zPwyraqUmzUJcTsJoBQ93YhbEiCFKfmdJx',
    publicKey: 'pYvE3kUX8grkhT3JLkdKG54Nko3CDmMXXPrN8dDjaknLebTobsQ2VoozPXp6oTJLrA8Nn751BpkcWXdoKfYdxdixF3HVQfFq'
  },
  {
    secret: 'pBzD13wH9ErWYKgDFif99QCXQD4Y9jhPUVAbJs688idsL6S3GZj',
    address: 'zKTPPwoE72MR8EeeJAdwEaZwHwbRaoS5xo',
    publicKey: 'pYv4qiG7GgdkRj91GWWWFE8Lw1p7xaLtx59QhfKB6qTH3xKfS3FifN5Q4juFprKCKc3tDon5EtTvFAnrcs43XL4Ku413KNZQ'
  },
  {
    secret: 'pwg3pAV9sx79f7BKvMmb4KpHFxdm2RAJNRsXS1Xm9M6TgRbjePF',
    address: 'zJyw2bNCrJwyw5UThdYSPFffuMriWHMSsP',
    publicKey: 'pYvNd2Fp8NA8gobCmCxb8DTX73gYtmpU77TBuUiYRoFGToqSkvurV5FsR18Vk8viMqDXM9jaEyK1CQ4VfTwnvwFf2eqp5Dqj'
  },
  {
    secret: 'p9XGnefcvEpsuzEPMt5tgta5XQMSC3i2KQ5HPj4cGAb9q2WtQaS',
    address: 'zB98LyRXifNpCeVBpA982zsqm6WRfcpv36',
    publicKey: 'pYvESdB98TnezADGoCrouqCzqt6ayVmh83xHJ1zG3MR7qXhcoPA7gcaU4ukhWiiSkNYEWc684AjjrUA51YCzu3p4mSBy7ja8'
  },
  {
    secret: 'p9qcu1tBL4GfYgGgPgWMfG8ci3u7CucsbdLkpcMRxBsyE15dDmZ',
    address: 'zntpvhs72odVigJY4iM34bgSTYJt5vjSxz',
    publicKey: 'pYvM2cu899iJRK38ULMmCAN42NTwcAMvND4e8WeGSmzgogAyYnt6HcghSoWMpaetrY8Sdz9vapCbUuaTdyR41tfTei18dma6'
  },
  {
    secret: 'pw92hApDjt73GWEvCSZwoF89AJf4mwd9gp72qwCnudk2kEvJzW7',
    address: 'zPcstaawyovoUgPoLoTXGrRsrWghTyPhqk',
    publicKey: 'pYvf7SzqscNgm8TCRuez27jbz8GJTH55qzeK35hma7D13Fn428ky3QfeDC7vGjH24wS4F2VTLbaTdEDx7jhMBUPCi8X2HSyZ'
  },
  {
    secret: 'p92zXYSY1k5fAwzK5GFnC6yFxsyFbyQPYEBSqX1JuTy7Vy2GTE5',
    address: 'zGNBNuXgYX4YbusXq3L11tL4NGm1m4WnCa',
    publicKey: 'pYvBLmR39BhD9Li1bK9xGqqZ48C1UVobBLjtqB6DkqypP8cQMrKCKxwhFvy7Vd8pAi1SYPrgzC2VTKBbBEkbzmoSeP9ERUP7'
  },
  {
    secret: 'p9bWU39we1L9c1DaeqWAtET4Z7mCQRzD5XbFQrJiieDh4djy15u',
    address: 'zfmrE29V1rncuRCP14wAX3vo3ntaHE9WYp',
    publicKey: 'pYvWRme86UVyqS9LmEuVgczbVyzbPChxcc8csxxJGxGGnAfjarq7pe9yZZKdtWXYWsnfaXD7i7jTSRBvxqU4wMsCkwyGwWv9'
  }
  ];

  await chainsql.as(users[0]);


  //load the deployed contract and call a function

  const abi = '[{"inputs": [{"internalType": "uint256","name": "vnum","type": "uint256"}],"stateMutability": "nonpayable","type": "constructor"},{"inputs": [{"internalType": "address","name": "iUser","type": "address"},{"internalType": "string","name": "iID","type": "string"},{"internalType": "string","name": "iPK","type": "string"}],"name": "Initialization","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "address","name": "iUser","type": "address"}],"name": "getIdBasic","outputs": [{"internalType": "address","name": "","type": "address"},{"internalType": "string","name": "","type": "string"},{"internalType": "string","name": "","type": "string"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "address","name": "iQ","type": "address"},{"internalType": "address","name": "iP","type": "address"}],"name": "getRfromCommunicator","outputs": [{"internalType": "string","name": "","type": "string"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "address","name": "iP","type": "address"},{"internalType": "address","name": "iQ","type": "address"}],"name": "getsigfromCommunicator","outputs": [{"internalType": "string","name": "","type": "string"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "owner","outputs": [{"internalType": "address","name": "","type": "address"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "address","name": "iP","type": "address"},{"internalType": "address","name": "iQ","type": "address"},{"internalType": "string","name": "r","type": "string"}],"name": "setRforCommunicator","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "address","name": "iQ","type": "address"},{"internalType": "address","name": "iP","type": "address"},{"internalType": "string","name": "sig","type": "string"}],"name": "setSigforCommunicator","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "address","name": "iUser","type": "address"},{"internalType": "string","name": "iPK","type": "string"}],"name": "updateCert","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [],"name": "versionNum","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"}]';
  const contractObj = chainsql.contract(JSON.parse(abi),"znEhSTjoLSCmfVCnQCK2jGfP3EcFkJBoTH");
  
  //-----------The initialization stage-------------------
  let begin = Date.now();
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

  ins = await contractObj.methods.Initialization(users[0].address,idP,uP).submit({
    Gas: 8000000,
    expect: "validate_success"
  }).then(res => {
      console.log(res);
  }).catch(err => {
      console.log(err);
  });

  ins = await contractObj.methods.Initialization(users[1].address,idQ,v).submit({
    Gas: 8000000,
    expect: "validate_success"
  }).then(res => {
      console.log(res);
  }).catch(err => {
      console.log(err);
  });

  timecost = Date.now() - begin;
  console.log(`time for initialization = ${timecost} MS`);


  //----------- stage 1-------------------
  begin = Date.now();
   //for P
  const r = crypto.randomBytes(32).toString('hex');
  ins = await contractObj.methods.setRforCommunicator(users[0].address,users[1].address,r).submit({
    Gas: 8000000,
    expect: "validate_success"
  }).then(res => {
      console.log(res);
  }).catch(err => {
      console.log(err);
  });
  timecost = Date.now() - begin;
  console.log(`time for P at stage 1 = ${timecost} MS`);

  //----------- stage 2-------------------
  await chainsql.as(users[1]);
  begin = Date.now();
  //for Q
  ins = await contractObj.methods.getIdBasic(users[0].address).call();
  const addrP = ins[0];
  const pkP = ins[1];
  const idPpi = ins[2]; 
  if(!(addrP == users[0].address)) {console.log("error1");return;}
  const rpi = await contractObj.methods.getRfromCommunicator(users[1].address,users[0].address).call();
  const hashforsig =  crypto.createHash('sha256');
  hashforsig.update(rpi + v + idPpi);
  const strTosig  = hashforsig.digest('hex');
  const delta = await eQ.signAsync(strTosig,N);
  const transdelta = delta.a.toString(16) + "||" + delta.b.toString(16);
  ins = await contractObj.methods.setSigforCommunicator(users[1].address,users[0].address,transdelta).submit({
    Gas: 8000000,
    expect: "validate_success"
  }).then(res => {
      console.log(res);
  }).catch(err => {
      console.log(err);
  });
  const uPbeta = await eQ.computeSecret(uP);
  const kstr = uP + v + uPbeta + idQ;
  const hashfork =  crypto.createHash('sha256');
  hashfork.update(kstr);
  const key1  = hashfork.digest('hex');
  timecost = Date.now() - begin;
  console.log(`time for Q at stage 2 = ${timecost} MS`);


  //----------- stage 3-------------------
  await chainsql.as(users[0]);
  begin = Date.now();
  //for P
  ins = await contractObj.methods.getIdBasic(users[1].address).call();
  const addrQ = ins[0];
  const pkQ = ins[1];
  const idQpi = ins[2];
  if(!(addrQ === users[1].address)) {console.log("error2");return;}
  const sig = await contractObj.methods.getsigfromCommunicator(users[0].address,users[1].address).call();
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
  timecost = Date.now() - begin;
  console.log(`time for P at stage 3 = ${timecost} MS`);
 

}
start();






