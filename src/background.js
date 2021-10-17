import {
    AccountDB,
    GlobalDB
} from "./storage";

const globaldb = new GlobalDB('xfswalletglobal');

chrome.runtime.onInstalled.addListener(() => {
    globaldb.initialSetup();
});
