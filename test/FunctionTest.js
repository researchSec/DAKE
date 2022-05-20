// We import Chai to use its asserting functions here.
const { expect } = require("chai");
var crypto = require('crypto');
var eg = require('../scripts/elgamal.js')
var BigInt = require('jsbn');
const { execPath } = require("process");




function serialize(u8a){
  return Buffer.from(u8a,'hex').toString('hex');
}
function unserialize(str){
  return new Uint8Array(Buffer.from(str,'hex'));
}

describe("DAKE", function () {
  
  describe("Function Tests", function () {
    

    it("DAEK1", async function () {

      let N = 160;
      let L = 1024;

      //DAEK1
      let idPseed = "just a test1";
      let idQseed = "just a test2";
      let hashid =  crypto.createHash('sha256');
      hashid.update(idPseed);
      const idP  = hashid.digest('hex');
      const r = crypto.randomBytes(32).toString('hex');
      const eP = await eg.ElGamal.initialParametersAsync(N,L);
      let ins = await eP.generateKeyAsync();
      const uP = eP.y.toString(16);

      const eQ = await eg.ElGamal.initialParametersAsync(N,L);
      ins = await eQ.generateKeyAsync();
      const v = eQ.y.toString(16);
      const hashforsig =  crypto.createHash('sha256');
      hashforsig.update(r + v + idP);
      const strTosig  = hashforsig.digest('hex');
      const delta = await eQ.signAsync(strTosig,N);
      const transdelta = delta.a.toString(16) + "||" + delta.b.toString(16);
      hashid =  crypto.createHash('sha256');
      hashid.update(idQseed);
      const idQ  = hashid.digest('hex');

      //for Q
      const uPbeta = eQ.computeSecret(uP);
      const kstr = uP + v + uPbeta + idQ;
      const hashfork =  crypto.createHash('sha256');
      hashfork.update(kstr);
      const key1  = hashfork.digest('hex');

      //for P
      const tmptransdelta = transdelta.split("||");
      const sdelta = {'a':new BigInt(tmptransdelta[0],16),'b':new BigInt(tmptransdelta[1],16)}
      expect(await eP.verifyAsync(strTosig, sdelta, v, N));
      const vAlphaP = eP.computeSecret(v);
      const kstr1 = uP + v + vAlphaP + idQ;
      const hashfork1 =  crypto.createHash('sha256');
      hashfork1.update(kstr1);
      const key2  = hashfork1.digest('hex');

      expect(key1 === key2);

    });

    it("DAEK2", async function () {


      let N = 160;
      let L = 1024;

      //DAEK2
      let idPseed = "just a test1";
      let idQseed = "just a test2";
      let hashid =  crypto.createHash('sha256');
      hashid.update(idPseed);
      const idP  = hashid.digest('hex');
      const eP = await eg.ElGamal.initialParametersAsync(N,L);
      let ins = await eP.generateKeyAsync();
      const uP = eP.y.toString(16);
      const secret = await eP.generateKeyAsyncExt();
      const u = secret.pk;
      const hashforsig =  crypto.createHash('sha256');
      hashforsig.update(u);
      const strTosig  = hashforsig.digest('hex');
      const delta1 = await eP.signAsync(strTosig,N);
      let transdelta = delta1.a.toString(16) + "||" + delta1.b.toString(16);

      //for Q
      const eQ = await eg.ElGamal.initialParametersAsync(N,L);
      let tmptransdelta = transdelta.split("||");
      let sdelta = {'a':new BigInt(tmptransdelta[0],16),'b':new BigInt(tmptransdelta[1],16)}
      expect(await eQ.verifyAsync(strTosig, sdelta, uP, N));
      ins = await eQ.generateKeyAsync();
      const v = eQ.y.toString(16);
      let hashid2 =  crypto.createHash('sha256');
      hashid2.update(idQseed);
      const idQ  = hashid2.digest('hex');
      const hashforsig2 =  crypto.createHash('sha256');
      hashforsig2.update(u+v+idP);
      const strTosig2  = hashforsig2.digest('hex');
      const delta2 = await eQ.signAsync(strTosig2,N);
      transdelta = delta2.a.toString(16) + "||" + delta2.b.toString(16);
      const kstr = u+v+eQ.computeSecret(u)+idQ;
      const hashfork =  crypto.createHash('sha256');
      hashfork.update(kstr);
      const key1  = hashfork.digest('hex');


      //for P
      tmptransdelta = transdelta.split("||");
      sdelta = {'a':new BigInt(tmptransdelta[0],16),'b':new BigInt(tmptransdelta[1],16)}
      expect(await eP.verifyAsync(strTosig, sdelta, v, N));
      const kstr2 = u+v+eP.computeSecretExt(v,secret.sk)+idQ;
      const hashfork2 =  crypto.createHash('sha256');
      hashfork2.update(kstr2);
      const key2  = hashfork2.digest('hex');
      expect(key1 === key2);




  
    });

 
    it("DAEK3", async function () {


      let N = 160;
      let L = 1024;

      //for P 
      let idPseed = "just a test1";
      let hashid =  crypto.createHash('sha256');
      hashid.update(idPseed);
      const idP  = hashid.digest('hex');
      const eP = await eg.ElGamal.initialParametersAsync(N,L);
      let ins = await eP.generateKeyAsync();
      const u = eP.y.toString(16);


      //for Q
      let idQseed = "just a test2";
      hashid =  crypto.createHash('sha256');
      hashid.update(idQseed);
      const idQ  = hashid.digest('hex');
      const eQ = await eg.ElGamal.initialParametersAsync(N,L);
      ins = await eQ.generateKeyAsync();
      const v = eQ.y.toString(16);
      const com = await eQ.computeSecret(u);
      const hashforkey =  crypto.createHash('sha256');
      hashforkey.update(u + v + com);
      const keystr  = hashforkey.digest('hex');
      const kQ = keystr.substring(0,180);
      const k1Q = keystr.substring(0,224);
      const pk1Q = await eQ.computePk(k1Q);
      const k2Q = keystr.substring(0,256);
      const pk2Q = await eQ.computePk(k2Q);
      const hashforsig =  crypto.createHash('sha256');
      hashforsig.update('1'+ u + v);
      const sigstr  = hashforsig.digest('hex');
      const delta1 = await eQ.signAsync(sigstr,N);
      
      const d1a = await eQ.encryptAsyncExt(delta1.a.toString(16),pk1Q);
      const d1b = await eQ.encryptAsyncExt(delta1.b.toString(16),pk1Q);
      const ev = await eQ.encryptAsyncExt(v,pk1Q);
      const eidQ = await eQ.encryptAsyncExt(idQ,pk1Q);

      const c1 = d1a.a.toString(16)+ '||' + d1a.b.toString(16) + '||' + d1b.a.toString(16)+ '||' + d1b.b.toString(16)+"||"
                + ev.a.toString(16)+ '||' + ev.b.toString(16)  + '||' +eidQ.a.toString(16)+ '||' + eidQ.b.toString(16);
                
      //for P
      const com1 = await eP.computeSecret(v);
      const hashforkey1 =  crypto.createHash('sha256');
      hashforkey1.update(u + v + com1);
      const keystr1  = hashforkey1.digest('hex');
      const kP = keystr1.substring(0,180);
      const k1P = keystr1.substring(0,224);
      const pk1P = await eP.computePk(k1P);
      const k2P = keystr1.substring(0,256); 
      const pk2P = await eP.computePk(k2P);
      expect(kQ === kP);

 
      const ciphertext = c1.split('||');
      const d1api = (await eP.decryptAsyncExt({'a':ciphertext[0],'b':ciphertext[1]},k1P,pk1P)).toString(16);
      const d1bpi = (await eP.decryptAsyncExt({'a':ciphertext[2],'b':ciphertext[3]},k1P,pk1P)).toString(16);
     
      const delta1pi = {'a':new BigInt(d1api,16),'b':new BigInt(d1bpi,16)};
      
      
      const vpi =  await eP.decryptAsyncExt({'a':ciphertext[4],'b':ciphertext[5]},k1P,pk1P);
      
    
      const idQpi =  await eP.decryptAsyncExt({'a':ciphertext[6],'b':ciphertext[7]},k1P,pk1P);
   
      expect(idQ === idQpi.toString(16));
      expect(await eP.verifyAsync(sigstr,delta1pi,vpi.toString(16),N));
      
      const hashforsig2 =  crypto.createHash('sha256');
      hashforsig2.update('2'+ u + vpi);
      const sigstr2 = hashforsig2.digest('hex');
      const delta2 = await eP.signAsync(sigstr2,N);
      const d2a = await eP.encryptAsyncExt(delta2.a,pk2P);
      const d2b = await eP.encryptAsyncExt(delta2.b,pk2P);
      const eu = await eP.encryptAsyncExt(u,pk2P)
      const eidP = await eP.encryptAsyncExt(idP,pk2P)

      const c2 = d2a.a.toString(16)+ '||' + d2a.b.toString(16) + '||' + d2b.a.toString(16)+ '||' + d2b.b.toString(16) + "||"
                + eu.a.toString(16)+ '||' + eu.b.toString(16)+  '||' + eidP.a.toString(16)+ '||' + eidP.b.toString(16);

     

      //for Q
      const ciphertext2 = c2.split('||');
      const d2api = (await eQ.decryptAsyncExt({'a':ciphertext2[0],'b':ciphertext2[1]},k2Q,pk2Q)).toString(16);
      const d2bpi = (await eQ.decryptAsyncExt({'a':ciphertext[2],'b':ciphertext[3]},k2Q,pk2Q)).toString(16);
      const delta2pi = {'a':new BigInt(d2api,16),'b':new BigInt(d2bpi,16)};
      const upi =  (await eQ.decryptAsyncExt({'a':ciphertext[4],'b':ciphertext[5]},k2Q,pk2Q)).toString(16);
      const idPpi=  (await eQ.decryptAsyncExt({'a':ciphertext[6],'b':ciphertext[7]},k2Q,pk2Q)).toString(16);

      expect(idP === idPpi);
      expect(await eQ.verifyAsync(sigstr2,delta2pi,upi,N));

    });


    it("DAEK4", async function () {
      let N = 160;
      let L = 1024;

      //for P
      let idPseed = "just a test1";
      let hashid =  crypto.createHash('sha256');
      hashid.update(idPseed);
      const idP  = hashid.digest('hex');
      const eP = await eg.ElGamal.initialParametersAsync(N,L);
      let ins = await eP.generateKeyAsync();
      const galpha = eP.y.toString(16);
      const exKeysP = await eP.generateKeyAsyncExt();
      const gu = exKeysP.pk;
      //send galpha idP and gu to Q


      //for Q
      let idQseed = "just a test2";
      hashid =  crypto.createHash('sha256');
      hashid.update(idQseed);
      const idQ  = hashid.digest('hex');
      const eQ = await eg.ElGamal.initialParametersAsync(N,L);
      ins = await eQ.generateKeyAsync();
      const gbeta = eQ.y.toString(16);
      const exKeysQ = await eQ.generateKeyAsyncExt();
      const gv = exKeysQ.pk;

      const h1 = await eQ.multiplyAndPow(galpha,gu,eQ.x.toString(16),exKeysQ.sk);

      const guv = await eQ.powSecret(gu,exKeysQ.sk);
      const hashforkey =  crypto.createHash('sha256');
      hashforkey.update(h1 + guv + galpha + gu + gbeta + gv + idP + idQ);
      const keystr  = hashforkey.digest('hex');
      const kQ = keystr.substring(0,180);
      const k1Q = keystr.substring(0,224);
      const pk1Q = await eQ.computePk(k1Q);
      const k2Q = keystr.substring(0,256);
      const pk2Q = await eQ.computePk(k2Q);
     //send gv , k1Q,  idQ and gbeta to P


     //for P
     const h1pi = await eP.multiplyAndPow(gv,gbeta,eP.x.toString(16),exKeysP.sk);
     const gvu = await eQ.powSecret(gv,exKeysP.sk);
     const hashforkey1 =  crypto.createHash('sha256');
     hashforkey1.update(h1pi + gvu + galpha + gu + gbeta + gv + idP + idQ);
     const keystr1  = hashforkey1.digest('hex');
     const kP = keystr1.substring(0,180);
     const k1P = keystr1.substring(0,224);
     const pk1P = await eP.computePk(k1P);
     const k2P = keystr1.substring(0,256); 
     const pk2P = await eP.computePk(k2P);
     expect(k1Q === k1P);
     //send k2P to Q

     //for Q
     expect(k2P === k2Q);


     expect(kP === kQ);


    });


    it("DAEK5", async function () {




      let N = 160;
      let L = 1024;

      //for P
      let idPseed = "just a test1";
      let hashid =  crypto.createHash('sha256');
      hashid.update(idPseed);
      const idP  = hashid.digest('hex');
      const eP = await eg.ElGamal.initialParametersAsync(N,L);
      
      let ins = await eP.generateKeyAsync();

      const galpha = eP.y.toString(16);
      const exKeysP1 = await eP.generateKeyAsyncExt();
      const exKeysP2 = await eP.generateKeyAsyncExt();
      const galphapi = await eP.addAndPow(eP.x.toString(16),exKeysP1.sk);
      const gu = exKeysP2.pk;
      //send galphapi and gu to Q


      //for Q
      let idQseed = "just a test2";
      hashid =  crypto.createHash('sha256');
      hashid.update(idQseed);
      const idQ  = hashid.digest('hex');
      const eQ = await eg.ElGamal.initialParametersAsync(N,L);
      ins = await eQ.generateKeyAsync();
      const exKeysQ1 = await eQ.generateKeyAsyncExt();
      const exKeysQ2 = await eQ.generateKeyAsyncExt();
      const betapi = await eQ.addExt(eQ.x.toString(16),exKeysQ1.sk);
      const gbetapi = await eQ.computePk(betapi);

      const h1 = await eQ.multiplyAndPow(galphapi,gu,betapi,exKeysQ2.sk);
      const guv = await eQ.powSecret(gu,exKeysQ2.sk);
      const hashforkey =  crypto.createHash('sha256');
      hashforkey.update(h1 + guv + galphapi + gu + gbetapi + exKeysQ2.pk);
      const keystr  = hashforkey.digest('hex');
      const kQ = keystr.substring(0,180);
      const k1Q = keystr.substring(0,224);
      const pk1Q = await eQ.computePk(k1Q);
      const k2Q = keystr.substring(0,256);
      const pk2Q = await eQ.computePk(k2Q);

      //encrypt exKeysQ1.sk  eQ.y.toString(16) idQ
      const eT = await eQ.encryptAsyncExt(exKeysQ1.sk,pk1Q);
      const egbeta = await eQ.encryptAsyncExt(eQ.y.toString(16),pk1Q);
      const eidQ = await eQ.encryptAsyncExt(idQ,pk1Q);
      const c1 = eT.a.toString(16)+ '||' + eT.b.toString(16) + '||' + egbeta.a.toString(16)+ '||' + egbeta.b.toString(16) + "||"
                + eidQ.a.toString(16)+ '||' + eidQ.b.toString(16);
      //send gbetapi , exKeysQ2.pk ,c1 to P


      //for P

      const h1pi = await eP.multiplyAndPow(gbetapi,exKeysQ2.pk, galphapi,exKeysP2.sk);
      const gvu = await eQ.powSecret(exKeysQ2.pk,exKeysP2.sk);
      const hashforkey1 =  crypto.createHash('sha256');
      hashforkey1.update(h1pi + gvu + galphapi + gu + gbetapi + exKeysQ2.pkQ);
      const keystr1  = hashforkey1.digest('hex');
      const kP = keystr1.substring(0,180);
      const k1P = keystr1.substring(0,224);
      const pk1P = await eP.computePk(k1P);
      const k2P = keystr1.substring(0,256); 
      const pk2P = await eP.computePk(k2P);
      
      const ciphertext = c1.split('||');
      const T = (await eP.decryptAsyncExt({'a':ciphertext[0],'b':ciphertext[1]},k1P,pk1P)).toString(16);
      const gbeta = (await eP.decryptAsyncExt({'a':ciphertext[2],'b':ciphertext[3]},k1P,pk1P)).toString(16);
      const idQpi = (await eP.decryptAsyncExt({'a':ciphertext[4],'b':ciphertext[5]},k1P,pk1P)).toString(16);
      const gT = await eP.computePk(T);
      expect((await eP.multiplyExt(gT,gbeta)) === gbetapi);

      //encrypt exKeysP1.sk  galpha idP
      const edelta = await eP.encryptAsyncExt(exKeysP1.sk,pk2P);
      const egalpha = await eP.encryptAsyncExt(galpha,pk2P);
      const eidP = await eP.encryptAsyncExt(idP,pk2P);
      const c2 = edelta.a.toString(16)+ '||' + edelta.b.toString(16) + '||' + egalpha.a.toString(16)+ '||' + egalpha.b.toString(16) + "||"
                + eidP.a.toString(16)+ '||' + eidP.b.toString(16);
      //send c2 to Q


      //for Q
      const ciphertext2 = c2.split('||');
      const delta = (await eQ.decryptAsyncExt({'a':ciphertext2[0],'b':ciphertext2[1]},k2Q,pk2Q)).toString(16);
      const galpha_ = (await eQ.decryptAsyncExt({'a':ciphertext2[2],'b':ciphertext2[3]},k2Q,pk2Q)).toString(16);
      const idPpi = (await eQ.decryptAsyncExt({'a':ciphertext2[4],'b':ciphertext2[5]},k2Q,pk2Q)).toString(16);
      const gdelta= await eQ.computePk(delta);
      expect((await eQ.multiplyExt(gdelta,galpha_)) === galphapi);
      expect(kP === kQ);
      

    });

  });


});