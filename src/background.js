console.log('background.js');


import XFSWalletApiHanlder from './xfswallt';

import { AccountDB, ExtraDB, GlobalDB } from "./storage";

let accountdb = new AccountDB('xfswalletacc');
let globaldb = new GlobalDB('xfswalletglobal');
let extradb = new ExtraDB('xfswalletextra');
const appdb = {accountdb, globaldb, extradb};
chrome.runtime.onConnect.addListener(function(port) {
    let handler = new XFSWalletApiHanlder(port, appdb);
    port.onMessage.addListener(async (msg) => {
        await handler.handle(msg);
    });
});
