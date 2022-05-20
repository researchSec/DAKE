var Promise = require('bluebird');
var crypto = require('crypto');
const { BigNumber } = require('ethers');
var BigInt = require('jsbn');
const { getHeapCodeStatistics } = require('v8');
Promise.promisifyAll(crypto,BigInt);

const BIG_TWO = new BigInt('2');

/**
 * Trims a BigInt to a specific length.
 * @param {BigInt} bi BigInt to be trimmed.
 * @param {number} bits Number of bits in the output.
 * @returns {BigInt}
 */
function trimBigInt(bi, bits) {
  const trimLength = bi.bitLength() - bits;
  return trimLength > 0 ? bi.shiftRight(trimLength) : bi;
}

/**
 * Returns a random BigInt with the given amount of bits.
 * @param {number} bits Number of bits in the output.
 * @returns {BigInt}
 */
async function getRandomNbitBigIntAsync(bits) {
  // Generate random bytes with the length of the range
  const buf = await crypto.randomBytesAsync(Math.ceil(bits / 8));
  const bi = new BigInt(buf.toString('hex'), 16);

  // Trim the result and then ensure that the highest bit is set
  return trimBigInt(bi, bits).setBit(bits - 1);
}

/**
 * Returns a random BigInt in the given range.
 * @param {BigInt} min Minimum value (included).
 * @param {BigInt} max Maximum value (excluded).
 * @returns {BigInt}
 */
async function getRandomBigIntAsync(min, max) {
  const range = max.subtract(min).subtract(BigInt.ONE);

  let bi;
  do {
    // Generate random bytes with the length of the range
    const buf = await crypto.randomBytesAsync(Math.ceil(range.bitLength() / 8));

    // Offset the result by the minimum value
    bi = new BigInt(buf.toString('hex'), 16).add(min);
  } while (bi.compareTo(max) >= 0);

  // Return the result which satisfies the given range
  return bi;
}

/**
 * Returns a random prime BigInt value.
 * @param {number} bits Number of bits in the output.
 * @returns {BigInt}
 */
async function getBigPrimeAsync(bits) {
  // Generate a random odd number with the given length
  let bi = (await getRandomNbitBigIntAsync(bits)).or(BigInt.ONE);

  while (!bi.isProbablePrime()) {
    bi = bi.add(BIG_TWO);
  }

  // Trim the result and then ensure that the highest bit is set
  return trimBigInt(bi, bits).setBit(bits - 1);
}

/**
 * Parses a BigInt.
 * @param {BigInt|string|number} obj Object to be parsed.
 * @returns {?BigInt}
 */
function parseBigInt(obj) {
  if (obj === undefined) return null;

  return obj instanceof Object ? obj : new BigInt(`${obj}`);
}


/*
**
 * Stores an ElGamal-encrypted value.
 */
class EncryptedValue {
  /**
   * @type BigInt
   * @memberof EncryptedValue
   */
  a;

  /**
   * @type BigInt
   * @memberof EncryptedValue
   */
  b;

  constructor(a, b) {
    this.a = a;
    this.b = b;
  }

  /**
   * Performs homomorphic multiplication of the current and the given value.
   * @param {EncryptedValue} encryptedValue Value to multiply the current value
   * with.
   * @returns {EncryptedValue}
   */
  multiply(encryptedValue) {
    return new EncryptedValue(
      this.a.multiply(encryptedValue.a),
      this.b.multiply(encryptedValue.b)
    );
  }
}


class DecryptedValue {
  /**
   * Decrypted message stored as a BigInt.
   * @type BigInt
   * @memberof DecryptedValue
   */
  bi;

  constructor(m) {
    switch (typeof m) {
      case 'string':
        this.bi = new BigInt(new Buffer(m).toString('hex'), 16);
        break;
      case 'number':
        this.bi = new BigInt(`${m}`);
        break;
      default:
        this.bi = m;
    }
  }

  toString() {
    return new Buffer(this.bi.toByteArray()).toString();
  }
}


/**
 * Provides methods for the ElGamal cryptosystem.
 */
class ElGamal {
  /**
   * Safe prime number.
   * @type {BigInt}
   * @memberof ElGamal
   */
  p;

  /**
 * Safe prime number.
 * @type {BigInt}
 * @memberof ElGamal
 */
  q;


  /**
   * Generator.
   * @type {BigInt}
   * @memberof ElGamal
   */
  g;

  /**
   * Public key.
   * @type {BigInt}
   * @memberof ElGamal
   */
  h;

  /**
   * Private key.
   * @type {BigInt}
   * @memberof ElGamal
   */
  x;

  /**
   * Private key.
   * @type {BigInt}
   * @memberof ElGamal
   */
   y;
  static async initialParametersAsync(N, L) {
   let p,q,g,h;
      if(N ==160 && L == 1024){
        p = new BigInt('E0A67598CD1B763BC98C8ABB333E5DDA0CD3AA0E5E1FB5BA8A7B4EABC10BA338FAE06DD4B90FDA70D7CF0CB0C638BE3341BEC0AF8A7330A3307DED2299A0EE606DF035177A239C34A912C202AA5F83B9C4A7CF0235B5316BFC6EFB9A248411258B30B839AF172440F32563056CB67A861158DDD90E6A894C72A5BBEF9E286C6B', 16);
        q = new BigInt('E950511EAB424B9A19A2AEB4E159B7844C589C4F', 16);
        g = new BigInt('D29D5121B0423C2769AB21843E5A3240FF19CACC792264E3BB6BE4F78EDD1B15C4DFF7F1D905431F0AB16790E1F773B5CE01C804E509066A9919F5195F4ABC58189FD9FF987389CB5BEDF21B4DAB4F8B76A055FFE2770988FE2EC2DE11AD92219F0B351869AC24DA3D7BA87011A701CE8EE7BFE49486ED4527B7186CA4610A75', 16);
        h = new BigInt('0002', 16);
      }
      if(N ==224 && L == 2048){
        p = new BigInt('C196BA05AC29E1F9C3C72D56DFFC6154A033F1477AC88EC37F09BE6C5BB95F51C296DD20D1A28A067CCC4D4316A4BD1DCA55ED1066D438C35AEBAABF57E7DAE428782A95ECA1C143DB701FD48533A3C18F0FE23557EA7AE619ECACC7E0B51652A8776D02A425567DED36EABD90CA33A1E8D988F0BBB92D02D1D20290113BB562CE1FC856EEB7CDD92D33EEA6F410859B179E7E789A8F75F645FAE2E136D252BFFAFF89528945C1ABE705A38DBC2D364AADE99BE0D0AAD82E5320121496DC65B3930E38047294FF877831A16D5228418DE8AB275D7D75651CEFED65F78AFC3EA7FE4D79B35F62A0402A1117599ADAC7B269A59F353CF450E6982D3B1702D9CA83', 16);
        q = new BigInt('90EAF4D1AF0708B1B612FF35E0A2997EB9E9D263C9CE659528945C0D', 16);
        g = new BigInt('A59A749A11242C58C894E9E5A91804E8FA0AC64B56288F8D47D51B1EDC4D65444FECA0111D78F35FC9FDD4CB1F1B79A3BA9CBEE83A3F811012503C8117F98E5048B089E387AF6949BF8784EBD9EF45876F2E6A5A495BE64B6E770409494B7FEE1DBB1E4B2BC2A53D4F893D418B7159592E4FFFDF6969E91D770DAEBD0B5CB14C00AD68EC7DC1E5745EA55C706C4A1C5C88964E34D09DEB753AD418C1AD0F4FDFD049A955E5D78491C0B7A2F1575A008CCD727AB376DB6E695515B05BD412F5B8C2F4C77EE10DA48ABD53F5DD498927EE7B692BBBCDA2FB23A516C5B4533D73980B2A3B60E384ED200AE21B40D273651AD6060C13D97FD69AA13C5611A51B9085', 16);
        h = new BigInt('0002', 16);
      }
      if(N ==256 && L == 2048){
        p = new BigInt('F56C2A7D366E3EBDEAA1891FD2A0D099436438A673FED4D75F594959CFFEBCA7BE0FC72E4FE67D91D801CBA0693AC4ED9E411B41D19E2FD1699C4390AD27D94C69C0B143F1DC88932CFE2310C886412047BD9B1C7A67F8A25909132627F51A0C866877E672E555342BDF9355347DBD43B47156B2C20BAD9D2B071BC2FDCF9757F75C168C5D9FC43131BE162A0756D1BDEC2CA0EB0E3B018A8B38D3EF2487782AEB9FBF99D8B30499C55E4F61E5C7DCEE2A2BB55BD7F75FCDF00E48F2E8356BDB59D86114028F67B8E07B127744778AFF1CF1399A4D679D92FDE7D941C5C85C5D7BFF91BA69F9489D531D1EBFA727CFDA651390F8021719FA9F7216CEB177BD75', 16);
        q = new BigInt('C24ED361870B61E0D367F008F99F8A1F75525889C89DB1B673C45AF5867CB467', 16);
        g = new BigInt('8DC6CC814CAE4A1C05A3E186A6FE27EABA8CDB133FDCE14A963A92E809790CBA096EAA26140550C129FA2B98C16E84236AA33BF919CD6F587E048C52666576DB6E925C6CBE9B9EC5C16020F9A44C9F1C8F7A8E611C1F6EC2513EA6AA0B8D0F72FED73CA37DF240DB57BBB27431D618697B9E771B0B301D5DF05955425061A30DC6D33BB6D2A32BD0A75A0A71D2184F506372ABF84A56AEEEA8EB693BF29A640345FA1298A16E85421B2208D00068A5A42915F82CF0B858C8FA39D43D704B6927E0B2F916304E86FB6A1B487F07D8139E428BB096C6D67A76EC0B8D4EF274B8A2CF556D279AD267CCEF5AF477AFED029F485B5597739F5D0240F67C2D948A6279', 16);
        h = new BigInt('0002', 16);
      }

      if(N ==256 && L == 3072){
        p = new BigInt('90066455B5CFC38F9CAA4A48B4281F292C260FEEF01FD61037E56258A7795A1C7AD46076982CE6BB956936C6AB4DCFE05E6784586940CA544B9B2140E1EB523F009D20A7E7880E4E5BFA690F1B9004A27811CD9904AF70420EEFD6EA11EF7DA129F58835FF56B89FAA637BC9AC2EFAAB903402229F491D8D3485261CD068699B6BA58A1DDBBEF6DB51E8FE34E8A78E542D7BA351C21EA8D8F1D29F5D5D15939487E27F4416B0CA632C59EFD1B1EB66511A5A0FBF615B766C5862D0BD8A3FE7A0E0DA0FB2FE1FCB19E8F9996A8EA0FCCDE538175238FC8B0EE6F29AF7F642773EBE8CD5402415A01451A840476B2FCEB0E388D30D4B376C37FE401C2A2C2F941DAD179C540C1C8CE030D460C4D983BE9AB0B20F69144C1AE13F9383EA1C08504FB0BF321503EFE43488310DD8DC77EC5B8349B8BFE97C2C560EA878DE87C11E3D597F1FEA742D73EEC7F37BE43949EF1A0D15C3F3E3FC0A8335617055AC91328EC22B50FC15B941D3D1624CD88BC25F3E941FDDC6200689581BFEC416B4B2CB73', 16);
        q = new BigInt('CFA0478A54717B08CE64805B76E5B14249A77A4838469DF7F7DC987EFCCFB11D', 16);
        g = new BigInt('5E5CBA992E0A680D885EB903AEA78E4A45A469103D448EDE3B7ACCC54D521E37F84A4BDD5B06B0970CC2D2BBB715F7B82846F9A0C393914C792E6A923E2117AB805276A975AADB5261D91673EA9AAFFEECBFA6183DFCB5D3B7332AA19275AFA1F8EC0B60FB6F66CC23AE4870791D5982AAD1AA9485FD8F4A60126FEB2CF05DB8A7F0F09B3397F3937F2E90B9E5B9C9B6EFEF642BC48351C46FB171B9BFA9EF17A961CE96C7E7A7CC3D3D03DFAD1078BA21DA425198F07D2481622BCE45969D9C4D6063D72AB7A0F08B2F49A7CC6AF335E08C4720E31476B67299E231F8BD90B39AC3AE3BE0C6B6CACEF8289A2E2873D58E51E029CAFBD55E6841489AB66B5B4B9BA6E2F784660896AFF387D92844CCB8B69475496DE19DA2E58259B090489AC8E62363CDF82CFD8EF2A427ABCD65750B506F56DDE3B988567A88126B914D7828E2B63A6D7ED0747EC59E0E0A23CE7D8A74C1D2C2A7AFB6A29799620F00E11C33787F7DED3B30E1A22D09F1FBDA1ABBBFBF25CAE05A13F812E34563F99410E73B', 16);
        h = new BigInt('0002', 16);
      }

      return new ElGamal(p, g, q, h)
     

   
  }

  async generateKeyAsyncExt() {
   
 
    // Generate one-time private key
    const x = await getRandomBigIntAsync(
      BIG_TWO,
      this.p.subtract(BigInt.ONE)
    );

    // Generate one-time public key
    const y = this.g.modPow(x, this.p);
    
    return {'sk':x.toString(16), 'pk':y.toString(16)};
    
  }

  async generateKeyAsync() {
   
 
    // Generate private key
    const x = await getRandomBigIntAsync(
      BIG_TWO,
      this.p.subtract(BigInt.ONE)
    );

    // Generate public key
    const y = this.g.modPow(x, this.p);
    this.x = x;
    this.y = y;
    
  }

  async assignKeyAsync(sk,pk) {
   
    const x = new BigInt(sk,16);
    const y = new BigInt(pk,16);
    if(!this.g.modPow(x, this.p).equals(y)){
      return 0;
    }
   
    this.x = x;
    this.y = y;
    return 1;
    
  }

  /**
   * Creates a new ElGamal instance.
   * @param {BigInt|string|number} p Safe prime number.
   * @param {BigInt|string|number} g Generator.
   * @param {BigInt|string|number} y Public key.
   * @param {BigInt|string|number} x Private key.
   */
  constructor(p, g, q, h){
    this.p = parseBigInt(p);
    this.g = parseBigInt(g);
    this.q = parseBigInt(q);
    this.h = parseBigInt(h);
  }

  /**
   * Encrypts a message.
   * @param {string|BigInt|number} m Piece of data to be encrypted, which must
   * be numerically smaller than `p`.
   * @param {BigInt|string|number} [k] A secret number, chosen randomly in the
   * closed range `[1, p-2]`.
   * @returns {EncryptedValue}
   */
  async encryptAsync(m) {
    const k =  await getRandomBigIntAsync(
      BigInt.ONE,
      this.p.subtract(BigInt.ONE)
    );
    const mBi = new DecryptedValue(m).bi;
    const p = this.p;

    const a = this.g.modPow(k, p);
    const b = this.y.modPow(k, p).multiply(mBi).remainder(p);

    return new EncryptedValue(a, b);
  }

  
  /**
   * Decrypts a message.
   * @param {EncryptedValue} m Piece of data to be decrypted.
   * @throws {MissingPrivateKeyError}
   * @returns {DecryptedValue}
   */
  async decryptAsync(m) {
    // TODO: Use a custom error object
    if (!this.x) throw new Errors.MissingPrivateKeyError();

    const p = this.p;
    const r = await getRandomBigIntAsync(
      BIG_TWO,
      this.p.subtract(BigInt.ONE)
    );

    const aBlind = this.g.modPow(r, p).multiply(m.a).remainder(p);
    const ax = aBlind.modPow(this.x, p);

    const plaintextBlind = ax.modInverse(p).multiply(m.b).remainder(p);
    const plaintext = this.y.modPow(r, p).multiply(plaintextBlind).remainder(p);

    return new DecryptedValue(plaintext);
  }

  async encryptAsyncExt(m,pk) {
    const k =  await getRandomBigIntAsync(
      BigInt.ONE,
      this.p.subtract(BigInt.ONE)
    );
    const y = new BigInt(pk,16);
    const mBi = new BigInt(m,16);//new DecryptedValue(m).bi;
    const p = this.p;

    const a = this.g.modPow(k, p);
    const b = y.modPow(k, p).multiply(mBi).remainder(p);

    return new EncryptedValue(a, b);
  }

  async decryptAsyncExt(m,sk,pk) {

    const x = new BigInt(sk,16);
    const y = new BigInt(pk,16);
    const a = new BigInt(m.a,16);
    const b = new BigInt(m.b,16);
    // TODO: Use a custom error object
    if (!x) throw new Errors.MissingPrivateKeyError();

    const p = this.p;
    const r = await getRandomBigIntAsync(
      BIG_TWO,
      this.p.subtract(BigInt.ONE)
    );

    const aBlind = this.g.modPow(r, p).multiply(a).remainder(p);
    const ax = aBlind.modPow(x, p);

    const plaintextBlind = ax.modInverse(p).multiply(b).remainder(p);
    const plaintext = y.modPow(r, p).multiply(plaintextBlind).remainder(p);

   // return new DecryptedValue(plaintext);
   return plaintext.toString(16);
  }


  async signAsync(m,N) {

    const p = this.p;
    const q = this.q;
    let r,s;
    do{
    let k = await getRandomBigIntAsync(
        BigInt.ONE,
        q);

    const inverk = k.modInverse(q);
    const z = new BigInt(m.substring(0,N),16);

    r = this.g.modPow(k, p).remainder(q);
  

    s = (z.add((this.x).multiply(r))).multiply(inverk).remainder(q);
 
  
    }while(r.equals(BigInt.ZERO) || s.equals(BigInt.ZERO));
    return new EncryptedValue(r, s);
  }

  async signAsyncExt(m,N) {

    const p = this.p;
    const q = this.q;
    let r,s;
    do{
    let k = await getRandomBigIntAsync(
        BigInt.ONE,
        q);

    const inverk = k.modInverse(q);
    const z = new BigInt(m.substring(0,N),16);

    r = this.g.modPow(k, p).remainder(q);
  

    s = (z.add((this.x).multiply(r))).multiply(inverk).remainder(q);
 
  
    }while(r.equals(BigInt.ZERO) || s.equals(BigInt.ZERO));
    return r.toString(16)+'||'+s.toString(16);
  }


  async verifyAsync(m,sig,pk, N) {
    const z = new BigInt(m.substring(0,N),16);
    const y = new BigInt(pk, 16);
    const p = this.p;
    const q = this.q
    const rr = sig.a;
    const ss = sig.b;
 
    const w = ss.modInverse(q);

    const u1 = z.multiply(w).remainder(q);
    const u2 = rr.multiply(w).remainder(q);
    const v = (this.g.modPow(u1,p)).multiply(y.modPow(u2,p)).remainder(p).remainder(q);

    //console.log(rr.toString(16));
    //console.log(v.toString(16));

    return (v.toString() === rr.toString())
  }

  async computeSecret(pk) {
    const z = new BigInt(pk,16);
    const r = z.modPow(this.x, this.p);

    return r.toString(16);
  }

  async powSecret(pk,sk) {
    const base = new BigInt(pk,16);
    const exp = new BigInt(sk,16);
    const r = base.modPow(exp, this.p);

    return r.toString(16);
  }

  async multiplyAndPow(pk1,pk2,sk1,sk2) {
    const a = new BigInt(pk1,16);
    const b = new BigInt(pk2,16);
    const c = new BigInt(sk1,16);
    const d = new BigInt(sk2,16);

    const r = (a.multiply(b)).modPow(c.add(d),this.p);

    return r.toString(16);
  }

  async addAndPow(sk1,sk2) {
    const c = new BigInt(sk1,16);
    const d = new BigInt(sk2,16);

    const r = this.g.modPow(c.add(d),this.p);

    return r.toString(16);
  }
  async addExt(sk1,sk2) {
    const c = new BigInt(sk1,16);
    const d = new BigInt(sk2,16);

    const r = c.add(d);

    return r.toString(16);
  }

  async multiplyExt(pk1,pk2) {
    const a = new BigInt(pk1,16);
    const b = new BigInt(pk2,16);


    const r = (a.multiply(b)).remainder(this.p);

    return r.toString(16);
  }


  async computePk(sk) {
    const z = new BigInt(sk,16);
    const y = this.g.modPow(z, this.p);

    return y.toString(16);
  }



  async computeSecretExt(pk, sk){
    const z = new BigInt(pk,16);
    const r = new BigInt(sk,16);
    const s = z.modPow(r,this.p);
    return s.toString(16);
  }
}
module.exports = {
	ElGamal,
	BigInt,
};