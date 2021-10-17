import { ec } from 'elliptic';
import CryptoJS from 'crypto-js';
import { SHA256 } from 'crypto-js';
// import RIPEMD160 from 'noble-ripemd160';
import ripemd160 from 'noble-ripemd160';
import { binary_to_base58 } from 'base58-js';

const secp256r1 = ec('p256');
const secp256k1 = ec('secp256k1');


function hash256(hex) {
    let pubTxt = CryptoJS.enc.Hex.parse(hex);
    return SHA256(pubTxt).toString(CryptoJS.enc.Hex);
}
function stringhash256(str) {
    return SHA256(str).toString(CryptoJS.enc.Hex);
}
function _ripemd160(data){
    let d = ripemd160(Uint8Array.from(data));
    return coverUint8Arr(d);
}
function coverUint8Arr(data){
    let arr = new Array(data.length);
    for (let i=0; i<data.length; i++){
        arr[i] = parseInt(data[i]);
    }
    return arr;
}
function hex2array(hexstr){
    let all = [];
    for (let i=0, j=1; j < hexstr.length; i++, j+=2){
        let an = parseInt(hexstr[j - 1], 16);
        if (isNaN(an)){
            throw new Error(`parse number error '${hexstr[j - 1]}'`);
        }
        let bn = parseInt(hexstr[j], 16);
        if (isNaN(bn)){
            throw new Error(`parse number error '${hexstr[j]}'`);
        }
        all[i] = (an << 4) | bn;
    }
    if (hexstr.length % 2  === 1 ){
        throw new Error(`parse hex string length error`);
    }
    return all;
} 

function array2hex(arr){
    let strbuf = '';
    for (let i=0;i < arr.length; i++){
        let hex = arr[i].toString(16).padStart(2,'0');
        strbuf += hex;
    }
    return strbuf;
}

class PrivateKey {
    constructor(key, pub){
        this.key = key
        this.pub = pub;
    }
}

function publicKeyEncode(pubkey) {
    const x = pubkey.getX();
    const y = pubkey.getY();
    let xarr = x.toArray();
    let yarr = y.toArray();
    let all = xarr.concat(yarr);
    return all;
}
function b582str(data){
    return binary_to_base58(data);
}
function genRandomKey() {
    let keypair = secp256k1.genKeyPair();
    let key = keypair.getPrivate('hex');
    let keyarr = hex2array(key);
    let pubkey = keypair.getPublic();
    let pubarr = publicKeyEncode(pubkey);
    return new PrivateKey(keyarr, pubarr);
}

function importKeyFromPrivate(arr){
    let keypair = secp256k1.keyFromPrivate(arr);
    let key = keypair.getPrivate('hex');
    let keyarr = hex2array(key);
    let pubKey = keypair.getPublic();
    let pubarr = publicKeyEncode(pubKey);
    return new PrivateKey(keyarr, pubarr);
}

function signFromKey(data, key) {
    let keypair = secp256k1.keyFromPrivate(key);
    let signature = keypair.sign(data, {canonical: true});
    let signaturer = signature.r.toArray();
    let signatures = signature.s.toArray();
    let signaturersr = signaturer.concat(signatures)
    .concat([signature.recoveryParam]);
    return signaturersr;
}

export {
    stringhash256,
    hash256,
    _ripemd160,
    genRandomKey,
    b582str,
    signFromKey,
    importKeyFromPrivate,
}