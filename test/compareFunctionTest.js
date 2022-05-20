// We import Chai to use its asserting functions here.
const { expect } = require("chai");
var SEEDS = require("./seeds.js");



describe("SmartDiffieHellman", function () {

  let bn = 2;
  let SmartDiffieHellmanFC = new Array(bn);
  let SmartDiffieHellman = new Array(bn);
  let addr = new Array(bn);
  let exchangeContract = new Array(bn);

  before(async function () {
    for(let i=0; i< bn; i++){
    SmartDiffieHellmanFC[i] = await ethers.getContractFactory("SmartDiffieHellman");
    SmartDiffieHellman[i] = await SmartDiffieHellmanFC[i].deploy();
    }
    
  });

  describe("Function Tests", function () {
    

    it("should be differenct contracts", async function () {
      

      for(let i = 0; i < bn; i++) {
        console.log(SmartDiffieHellman[i].address, "Contract " + i );
  
        for(let j = i + 1; j < bn; j++) 
          expect(await (SmartDiffieHellman[i].address == (SmartDiffieHellman[j].address)));
        }

    });

    it("should exchange one and the same key between two clients", async function () {
    
  
      let aA = await SmartDiffieHellman[0].generateA([SEEDS.SEED1]);
      
      await SmartDiffieHellman[0].transmitA(SmartDiffieHellman[1].address, aA["_A"]);
  
  
      let bB = await SmartDiffieHellman[1].generateA([SEEDS.SEED2]);
      await SmartDiffieHellman[1].transmitA(SmartDiffieHellman[0].address, bB["_A"]);

  
      let AB1 = await SmartDiffieHellman[0].generateAB(aA["_a"]);
      let AB2 = await SmartDiffieHellman[1].generateAB(bB["_a"]);
  
      expect(AB1.toString() == AB2.toString());
      

    });


  


  });


});