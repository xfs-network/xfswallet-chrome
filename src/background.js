import XFSWalletApiHanlder from './xfswallt';
import _ from 'lodash';
import { AccountDB, ExtraDB, GlobalDB } from "./storage";
import {WALLET_MAGIC} from './config';
let accountdb = new AccountDB('xfswalletacc');
let globaldb = new GlobalDB('xfswalletglobal');
let extradb = new ExtraDB('xfswalletextra');
const appdb = {accountdb, globaldb, extradb};

class WindowMgr {
    constructor({extradb}){
        this.wins = [];
        this.extradb = extradb;
    }
    onWindowClose(id, r){
        const target = _.find(this.wins, { winId: id });
        if(!target){
            return;
        }
        chrome.windows.remove(id);
        target.cb({
            data: r,
            reqId: target.reqId
        });
    }
    async openPoputWindow(opts, cb, reqId){
        const extradb = this.extradb;
        await extradb.setPageState({
            page: opts.page,
            state: opts.state,
        });
        chrome.windows.create({
            url: chrome.runtime.getURL("popup.html"),
            focused: true,
            height: 624,
            width: 392,
            type: "popup"
        }, (win)=>{
            const winId = win.id;
            this.wins.push({
                winId: winId,
                cb: cb,
                reqId: reqId
            });
        });
    }
}
const winmgr = new WindowMgr({
    extradb: extradb,
});
chrome.runtime.onConnect.addListener(function(port) {
    let handler = new XFSWalletApiHanlder({
        port: port,
        appdb: appdb, 
        winmgr: winmgr
    });
    port.onMessage.addListener(async (msg, sender, sendResponse) => {
        console.log('handleMessage', msg, sender, sendResponse);
        const {magic,method,reqId} = JSON.parse(msg);
        if (magic !== WALLET_MAGIC){
            return;
        }
        await handler.handle({
            method: method,
            reqId: reqId
        });
    });
});

chrome.runtime.onInstalled.addListener(() => {
    globaldb.initialSetup();
});

chrome.runtime.onMessage.addListener(
    function(msg, sender, sendResponse) {
        const {method,params} = msg;
        if (method === "closewin") {
            const winId = sender.tab.windowId;
            winmgr.onWindowClose(winId, params);
        }
    }
  );