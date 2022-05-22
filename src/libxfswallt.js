import {WALLET_MAGIC} from './config';
import _ from 'lodash';
import { AccountDB, ExtraDB, GlobalDB } from "./storage";
import JsonRpcProvider from './jsonrpcprovider';
import KeyStoreProvider from './keystoreprovider';

function postAndCallMethod({reqId,method, params}){
    const obj = {
        magic: WALLET_MAGIC,
        reqId: reqId,
        method: method,
        params: params

    };
    let objJson = JSON.stringify(obj);
    window.postMessage({type: "FROM_PAGE", text: objJson}, "*");
}

class LibXFSWallet {
    constructor(){
        this.reqId = 0;
        this.reqCall = [];
        this.dbs = {
            accountdb: new AccountDB('xfswalletacc'),
            globaldb: new GlobalDB('xfswalletglobal'),
            extradb: new ExtraDB('xfswalletextra'),
        };
        this.rpcProvider = new JsonRpcProvider({globaldb: this.dbs.globaldb}); 
        this.keyStoreProvider = new KeyStoreProvider({accountdb: this.dbs.accountdb, wallet: this}); 
    }
    initial(){
        if (!window.xfsgojs){
            return;
        }
        const {XFSGO} = window.xfsgojs;
        this.xfsgo = new XFSGO({
            rpcProvider: this.rpcProvider,
            keyStoreProvider: this.keyStoreProvider,
        });
    }
    requestSignData(opts, fn){
        this.reqCall.push({
            reqId: this.reqId,
            call: fn,
        });
        postAndCallMethod({
            reqId: this.reqId,
            method: 'connect',
            params: {...opts},
        });
        this.reqId += 1;
    }
    connect(fn){
        this.reqCall.push({
            reqId: this.reqId,
            call: fn
        });
        postAndCallMethod({
            reqId: this.reqId,
            method: 'connect',
            params: {},
        });
        this.reqId += 1;
    }
    sendTransaction(opts,fn){
        this.reqCall.push({
            reqId: this.reqId,
            call: fn
        });
        postAndCallMethod({
            reqId: this.reqId,
            method: 'sendTransaction',
            params: opts,
        });
        this.reqId += 1;
    }
    transfer(opts,fn){
        this.reqCall.push({
            reqId: this.reqId,
            call: fn
        });
        postAndCallMethod({
            reqId: this.reqId,
            method: 'transfer',
            params: opts,
        });
        this.reqId += 1;
    }
    onMessage(msg){
        const {data, reqId} = msg;
        const target = _.find(this.reqCall, { reqId: reqId });
        if(!target){
            return;
        }
        target.call(data);
    }
}
export default LibXFSWallet;