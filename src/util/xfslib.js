
import { BN } from "bn.js";
import { genRandomKey,hash256,_ripemd160,b582str,importKeyFromPrivate, signFromKey, stringhash256 } from "./crypto";
import { nano2atto } from "./xfslibutil";

const XFSVERSION = 1;
const XFS_KEY_VER = 1;
const XFS_KEY_PACK_VER = 1;
const KEY_PACK_TYPE_RAW = 1;

function array2hex(arr){
    if (!arr || !Array.isArray(arr)){
        return '';
    }
    let strbuf = '';
    for (let i=0;i < arr.length; i++){
        let hex = arr[i].toString(16).padStart(2,'0');
        strbuf += hex;
    }
    return strbuf;
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

function checksum(buf) {
    let first = hash256(array2hex(buf));
    let second = hash256(first);
    let secondbuf = hex2array(second);
    return secondbuf.slice(0, 4);
}

function publickey2address(version, publickey){
    let pubhex = array2hex(publickey);
    let pubhash256 = hash256(pubhex);
    let pubhash256arr = hex2array(pubhash256);
    let pubhash = _ripemd160(pubhash256arr);
    let payload = [version].concat(pubhash);
    let c = checksum(payload);
    return payload.concat(c);
}
function addrencode(addr){
    return b582str(addr);
}

function genRadmonAccount(version) {
    if (!version){
        version = XFS_KEY_VER;
    }
    let k = genRandomKey();
    let addrdata = publickey2address(version, k.pub);
    let addr = addrencode(addrdata);
    return {
        key: k,
        addr: addr
    }
}

function decodekey(str='') {
    if (str.length > 1 ) {
        if (str.startsWith('0x') || str.startsWith('0X')) {
            str = str.slice(2);
        }
    }
    if (!str||str.length <= 0){
        return;
    }
    let arr = [];
    try {
        arr = hex2array(str);
    }catch(e){
        throw(e);
    }
    if (arr.length < 2) {
        throw new Error(`parse key hex string length err`);
    }
    let version = arr[0];
    if (version != XFS_KEY_PACK_VER){
        throw new Error(`unknown key encode format version: ${version}`);
    }
    let ktype = arr[1];
    if (ktype === 1) {
        let payload = arr.slice(2);
        if (payload.length < 32){
            throw new Error(`parse key payload length err`);
        }
        let key = importKeyFromPrivate(payload);
        return {
            version: version,
            key: key.key,
            pub: key.pub,
        }
    }else {
        throw new Error(`unknown key pack type: ${ktype}`);
    }
}
function encodeprivatekey(key) {
    return [XFS_KEY_PACK_VER, KEY_PACK_TYPE_RAW].concat(key);
}
function exportKey(key) {
    let keydata = encodeprivatekey(key);
    return array2hex(keydata);
}
function importKey(keystr){
    try {
        let key = decodekey(keystr);
        let addrdata = publickey2address(XFS_KEY_VER, key.pub);
        let addr = addrencode(addrdata);
        return {
            key: {
                key: key.key,
                pub: key.pub,
            },
            addr: addr
        }
    }catch(e){
        throw(e);
    }
}

function sortAndEncodeObj(obj) {
    let objkeys = Object.keys(obj);
    objkeys = objkeys.sort();
    let strbuf = '';
    for (let i=0; i < objkeys.length; i++) {
        let key = objkeys[i];
        let val = obj[key];
        if (!val || typeof(val) == 'undefined') {
            val = parseInt(val);
            if (isNaN(val)){
                continue;
            }
        }
        val = String(val);
        if (val.length === 0){
            continue;
        }
        strbuf += `${key}=${val}`;
        if (i < objkeys.length-1){
            strbuf += '&';
        }
    }
    return strbuf;
}

const DEFAULT_TX_VER = 0;

class Transaction {
    constructor(params){
        this.version = DEFAULT_TX_VER;
        if (!params || typeof(params) == 'undefined'){
            return;
        }
        if (params.version && typeof(params.version) != 'undefined'){
            let version = parseInt(params.version);
            if (!isNaN(version)){
                this.version = version;
            }
        }
        this.to = params.to;
        this.gasPrice = params.gasPrice;
        this.gasLimit = params.gasLimit;
        this.data = params.data;
        this.nonce = params.nonce;
        this.value = params.value;
    }
    correctedObj(){
        let gasPriceatto = nano2atto(this.gasPrice);
        let gasPrice = new BN(gasPriceatto, 10);
        let gasLimit = new BN(this.gasLimit, 10);
        let value = new BN(this.value, 10);
        let valueStr = value.toString(10);
        let gasPriceStr = gasPrice.toString(10);
        let gasLimitStr = gasLimit.toString(10);
        let signature = array2hex(this.signature);
        let nonce = 0;
        if (this.nonce) {
            nonce = this.nonce;
        }
        return {
            version: String(this.version),
            to: this.to,
            gas_price: gasPriceStr,
            gas_limit: gasLimitStr,
            data: this.data,
            nonce: String(nonce),
            value: valueStr,
            signature: signature,
        };
    }
    signHash(){
        let obj = this.correctedObj();
        obj.signature = null;
        let enc = sortAndEncodeObj(obj);
        if (enc.length === 0){
            return [];
        }
        // console.log('enc', enc);
        let txsignhash = stringhash256(enc);
        return hex2array(txsignhash);
    }
    hash(){
        let obj = this.correctedObj();
        let enc = sortAndEncodeObj(obj);
        if (enc.length === 0){
            return '';
        }
        let txhash = stringhash256(enc);
        return txhash;
    }
    hashArr(){
        let hashhex = this.hash();
        return hex2array(hashhex);
    }
    signWithPrivateKey(privatekey){
        let signhash = this.signHash();
        if (signhash.length === 0){
            return;
        }
        this.signature = signFromKey(signhash, privatekey);
    }
    toJSON() {
        let obj = this.correctedObj();
        return JSON.stringify(obj);
    }
}

function signTransaction(tx, privatekey) {
    let signhash = tx.signHash();
    let sign = signFromKey(signhash, privatekey);
    return array2hex(sign);
}

export {
    publickey2address,
    addrencode,
    genRadmonAccount,
    decodekey,
    exportKey,
    importKey,
    signTransaction,
    Transaction,
    XFSVERSION
}