import {WALLET_MAGIC} from './config';
import _ from 'lodash';

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