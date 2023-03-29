const ChainsqlAPI = require('chainsql');
const chainsql = new ChainsqlAPI();
const crypto  = require('crypto');
const secp256k1 = require('secp256k1');

async function start() {

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
  //DAEKeyexchange1
 // deploy the smart contract 
  const abi = '[{"inputs": [{"internalType": "uint256","name": "vnum","type": "uint256"}],"stateMutability": "nonpayable","type": "constructor"},{"inputs": [{"internalType": "address","name": "iUser","type": "address"},{"internalType": "string","name": "iID","type": "string"},{"internalType": "string","name": "iPK","type": "string"}],"name": "Initialization","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "address","name": "iUser","type": "address"}],"name": "getIdBasic","outputs": [{"internalType": "address","name": "","type": "address"},{"internalType": "string","name": "","type": "string"},{"internalType": "string","name": "","type": "string"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "address","name": "iQ","type": "address"},{"internalType": "address","name": "iP","type": "address"}],"name": "getRfromCommunicator","outputs": [{"internalType": "string","name": "","type": "string"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "address","name": "iP","type": "address"},{"internalType": "address","name": "iQ","type": "address"}],"name": "getsigfromCommunicator","outputs": [{"internalType": "string","name": "","type": "string"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "owner","outputs": [{"internalType": "address","name": "","type": "address"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "address","name": "iP","type": "address"},{"internalType": "address","name": "iQ","type": "address"},{"internalType": "string","name": "r","type": "string"}],"name": "setRforCommunicator","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "address","name": "iQ","type": "address"},{"internalType": "address","name": "iP","type": "address"},{"internalType": "string","name": "sig","type": "string"}],"name": "setSigforCommunicator","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "address","name": "iUser","type": "address"},{"internalType": "string","name": "iPK","type": "string"}],"name": "updateCert","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [],"name": "versionNum","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"}]';
  const contractObj = chainsql.contract(JSON.parse(abi));
  const deployBytecode = '0x60806040526101f460015534801561001657600080fd5b506040516115213803806115218339818101604052602081101561003957600080fd5b81019080805190602001909291905050508060008190555033600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505061147f806100a26000396000f3fe608060405234801561001057600080fd5b50600436106100935760003560e01c80636dd91d77116100665780636dd91d771461043e5780638da5cb5b1461051b5780639eda661e1461054f578063caf96d4a146105e8578063ef026ff31461060657610093565b806309caaad81461009857806319ba408a146101de57806331009c96146102975780633569a7c514610350575b600080fd5b6100da600480360360208110156100ae57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506106e3565b604051808473ffffffffffffffffffffffffffffffffffffffff1681526020018060200180602001838103835285818151815260200191508051906020019080838360005b8381101561013a57808201518184015260208101905061011f565b50505050905090810190601f1680156101675780820380516001836020036101000a031916815260200191505b50838103825284818151815260200191508051906020019080838360005b838110156101a0578082015181840152602081019050610185565b50505050905090810190601f1680156101cd5780820380516001836020036101000a031916815260200191505b509550505050505060405180910390f35b610295600480360360608110156101f457600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff1690602001909291908035906020019064010000000081111561025157600080fd5b82018360208201111561026357600080fd5b8035906020019184600183028401116401000000008311171561028557600080fd5b9091929391929390505050610a01565b005b61034e600480360360608110156102ad57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff1690602001909291908035906020019064010000000081111561030a57600080fd5b82018360208201111561031c57600080fd5b8035906020019184600183028401116401000000008311171561033e57600080fd5b9091929391929390505050610b30565b005b61043c6004803603606081101561036657600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001906401000000008111156103a357600080fd5b8201836020820111156103b557600080fd5b803590602001918460018302840111640100000000831117156103d757600080fd5b9091929391929390803590602001906401000000008111156103f857600080fd5b82018360208201111561040a57600080fd5b8035906020019184600183028401116401000000008311171561042c57600080fd5b9091929391929390505050610c5f565b005b6104a06004803603604081101561045457600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610ec6565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156104e05780820151818401526020810190506104c5565b50505050905090810190601f16801561050d5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b610523611082565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6105e66004803603604081101561056557600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001906401000000008111156105a257600080fd5b8201836020820111156105b457600080fd5b803590602001918460018302840111640100000000831117156105d657600080fd5b90919293919293905050506110a8565b005b6105f06111ea565b6040518082815260200191505060405180910390f35b6106686004803603604081101561061c57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506111f0565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156106a857808201518184015260208101905061068d565b50505050905090810190601f1680156106d55780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b6000606080600073ffffffffffffffffffffffffffffffffffffffff16600360008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16141580156107cc5750600154600360008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600301544303105b6107d557600080fd5b600360008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600360008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600101600360008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600201818054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156109515780601f1061092657610100808354040283529160200191610951565b820191906000526020600020905b81548152906001019060200180831161093457829003601f168201915b50505050509150808054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156109ed5780601f106109c2576101008083540402835291602001916109ed565b820191906000526020600020905b8154815290600101906020018083116109d057829003601f168201915b505050505090509250925092509193909250565b3373ffffffffffffffffffffffffffffffffffffffff16600360008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614610a9b57600080fd5b8181600360008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060040160008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000209190610b299291906113ac565b5050505050565b3373ffffffffffffffffffffffffffffffffffffffff16600360008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614610bca57600080fd5b8181600360008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060050160008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000209190610c589291906113ac565b5050505050565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16148015610d4a5750600073ffffffffffffffffffffffffffffffffffffffff16600360008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16145b610d5357600080fd5b84600360008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508181600360008873ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206001019190610e259291906113ac565b508383600360008873ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206002019190610e779291906113ac565b5043600360008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600301819055505050505050565b60603373ffffffffffffffffffffffffffffffffffffffff16600360008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614610f6257600080fd5b600360008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060040160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156110755780601f1061104a57610100808354040283529160200191611075565b820191906000526020600020905b81548152906001019060200180831161105857829003601f168201915b5050505050905092915050565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600360008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614801561118a5750600154600360008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600301544303115b61119357600080fd5b8181600360008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060010191906111e49291906113ac565b50505050565b60005481565b60603373ffffffffffffffffffffffffffffffffffffffff16600360008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161461128c57600080fd5b600360008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060050160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561139f5780601f106113745761010080835404028352916020019161139f565b820191906000526020600020905b81548152906001019060200180831161138257829003601f168201915b5050505050905092915050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106113ed57803560ff191683800117855561141b565b8280016001018555821561141b579182015b8281111561141a5782358255916020019190600101906113ff565b5b509050611428919061142c565b5090565b5b8082111561144557600081600090555060010161142d565b509056fea26469706673582212204663c0fbdef8648a2355ae5f170549e149f238c3a836930d92c086a71a14c79c64736f6c63430007000033';

  await contractObj.deploy({ContractData : deployBytecode,arguments:[40000]}).submit({Gas: '5000000',}).then(res => {
      console.log(res);
  }).catch(err => {
      console.error(err);
  });

}
start();






