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
  //DAEKeyexchange2
 // deploy the smart contract 
  const abi = '[{"inputs": [{"internalType": "uint256","name": "vnum","type": "uint256"}],"stateMutability": "nonpayable","type": "constructor"},{"inputs": [{"internalType": "address","name": "iUser","type": "address"},{"internalType": "string","name": "iID","type": "string"},{"internalType": "string","name": "iPK","type": "string"}],"name": "Initialization","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "address","name": "iUser","type": "address"}],"name": "getIdBasic","outputs": [{"internalType": "address","name": "","type": "address"},{"internalType": "string","name": "","type": "string"},{"internalType": "string","name": "","type": "string"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "address","name": "iUser","type": "address"},{"internalType": "uint256","name": "strtype","type": "uint256"}],"name": "getStrfromCommunicator","outputs": [{"internalType": "string","name": "","type": "string"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "owner","outputs": [{"internalType": "address","name": "","type": "address"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "address","name": "iUser","type": "address"},{"internalType": "string","name": "str","type": "string"},{"internalType": "uint256","name": "strtype","type": "uint256"}],"name": "setStrforCommunicator","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "address","name": "iUser","type": "address"},{"internalType": "string","name": "iPK","type": "string"}],"name": "updateCert","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [],"name": "versionNum","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"}]'
  const contractObj = chainsql.contract(JSON.parse(abi));
  const deployBytecode = '0x60806040526101f460015534801561001657600080fd5b506040516111f33803806111f38339818101604052602081101561003957600080fd5b81019080805190602001909291905050508060008190555033600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050611151806100a26000396000f3fe608060405234801561001057600080fd5b506004361061007d5760003560e01c80638da5cb5b1161005b5780638da5cb5b1461037d5780639eda661e146103b1578063a12a76511461044a578063caf96d4a146104ed5761007d565b806305d9f0a31461008257806309caaad8146101495780633569a7c51461028f575b600080fd5b6100ce6004803603604081101561009857600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291908035906020019092919050505061050b565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561010e5780820151818401526020810190506100f3565b50505050905090810190601f16801561013b5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b61018b6004803603602081101561015f57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506107d6565b604051808473ffffffffffffffffffffffffffffffffffffffff1681526020018060200180602001838103835285818151815260200191508051906020019080838360005b838110156101eb5780820151818401526020810190506101d0565b50505050905090810190601f1680156102185780820380516001836020036101000a031916815260200191505b50838103825284818151815260200191508051906020019080838360005b83811015610251578082015181840152602081019050610236565b50505050905090810190601f16801561027e5780820380516001836020036101000a031916815260200191505b509550505050505060405180910390f35b61037b600480360360608110156102a557600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001906401000000008111156102e257600080fd5b8201836020820111156102f457600080fd5b8035906020019184600183028401116401000000008311171561031657600080fd5b90919293919293908035906020019064010000000081111561033757600080fd5b82018360208201111561034957600080fd5b8035906020019184600183028401116401000000008311171561036b57600080fd5b9091929391929390505050610af4565b005b610385610d5b565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b610448600480360360408110156103c757600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291908035906020019064010000000081111561040457600080fd5b82018360208201111561041657600080fd5b8035906020019184600183028401116401000000008311171561043857600080fd5b9091929391929390505050610d81565b005b6104eb6004803603606081101561046057600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291908035906020019064010000000081111561049d57600080fd5b8201836020820111156104af57600080fd5b803590602001918460018302840111640100000000831117156104d157600080fd5b909192939192939080359060200190929190505050610ec3565b005b6104f5611078565b6040518082815260200191505060405180910390f35b606081606414156105f857600360008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206004018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156105ec5780601f106105c1576101008083540402835291602001916105ec565b820191906000526020600020905b8154815290600101906020018083116105cf57829003601f168201915b505050505090506107d0565b8160c814156106e357600360008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206005018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156106d75780601f106106ac576101008083540402835291602001916106d7565b820191906000526020600020905b8154815290600101906020018083116106ba57829003601f168201915b505050505090506107d0565b8161012c14156107cf57600360008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206006018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156107c35780601f10610798576101008083540402835291602001916107c3565b820191906000526020600020905b8154815290600101906020018083116107a657829003601f168201915b505050505090506107d0565b5b92915050565b6000606080600073ffffffffffffffffffffffffffffffffffffffff16600360008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16141580156108bf5750600154600360008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600301544303105b6108c857600080fd5b600360008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600360008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600101600360008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600201818054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610a445780601f10610a1957610100808354040283529160200191610a44565b820191906000526020600020905b815481529060010190602001808311610a2757829003601f168201915b50505050509150808054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610ae05780601f10610ab557610100808354040283529160200191610ae0565b820191906000526020600020905b815481529060010190602001808311610ac357829003601f168201915b505050505090509250925092509193909250565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16148015610bdf5750600073ffffffffffffffffffffffffffffffffffffffff16600360008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16145b610be857600080fd5b84600360008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508181600360008873ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206001019190610cba92919061107e565b508383600360008873ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206002019190610d0c92919061107e565b5043600360008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600301819055505050505050565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600360008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16148015610e635750600154600360008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600301544303115b610e6c57600080fd5b8181600360008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206001019190610ebd92919061107e565b50505050565b3373ffffffffffffffffffffffffffffffffffffffff16600360008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614610f5d57600080fd5b8060641415610fb9578282600360008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206004019190610fb792919061107e565b505b8060c81415611015578282600360008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600501919061101392919061107e565b505b8061012c1415611072578282600360008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600601919061107092919061107e565b505b50505050565b60005481565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106110bf57803560ff19168380011785556110ed565b828001600101855582156110ed579182015b828111156110ec5782358255916020019190600101906110d1565b5b5090506110fa91906110fe565b5090565b5b808211156111175760008160009055506001016110ff565b509056fea26469706673582212205c07f0e1ba70bec686edc144ac16162d205cb27edf784c4c49dea5cbe04eb5ef64736f6c63430007000033';

  await contractObj.deploy({ContractData : deployBytecode,arguments:[50000]}).submit({Gas: '5000000',}).then(res => {
      console.log(res);
  }).catch(err => {
      console.error(err);
  });

}
start();






