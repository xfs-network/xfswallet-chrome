import React from "react";
import ReactDOM from "react-dom";
import './index.css';

import { Router } from "react-router-dom";

import { createMemoryHistory /* , createBrowserHistory */ } from 'history';
import { AccountDB, ExtraDB, GlobalDB } from "./storage";
import App from "./App";
import HttpJsonRpcClient from "./util/jsonrpcclient";

const history = createMemoryHistory();
let accountdb = new AccountDB('xfswalletacc');
let globaldb = new GlobalDB('xfswalletglobal');
let extradb = new ExtraDB('xfswalletextra');
class BackgroundService {
  constructor(params) {
    this.run = false;
    this.db = params.db;
  }
  async netstatuscheck() {
    const { globaldb } = this.db;
    while (this.run) {
      let defnet = await globaldb.getDefaultNet();
      if (!defnet){
        continue;
      }
      let netitem = await globaldb.getNetwork(defnet);
      if (!netitem){
        continue;
      }
      let client = new HttpJsonRpcClient({ url: netitem.rpcurl });
      try {
        let result = await client.call({
          method: 'Chain.Head',
          params: null
        });
        globaldb.setNetworkStatus(defnet, 1);
      } catch (e) {
        globaldb.setNetworkStatus(defnet, 0);
      }
      await sleep(5000);
    }
  }
  async syncbalance() {
    const { accountdb,globaldb } = this.db;
    while (this.run) {
      let defnet = await globaldb.getDefaultNet();
      if (!defnet){
        continue;
      }
      let netitem = await globaldb.getNetwork(defnet);
      if (!defnet){
        continue;
      }
      let defaddr = await accountdb.getDefault();
      if (!defnet){
        continue;
      }
      let client = new HttpJsonRpcClient({ url: netitem.rpcurl });
      try {
        let result = await client.call({
          method: 'State.GetBalance',
          params: {
            address: defaddr
          }
        });
        accountdb.setAddressBalance(defaddr, defnet, result);
      } catch (e) {
      }
      await sleep(5000);
    }
  }
  async synctxs() {
    const { accountdb,globaldb } = this.db;
    while (this.run) {
      let defnet = await globaldb.getDefaultNet();
      let netitem = await globaldb.getNetwork(defnet);
      let defaddr = await accountdb.getDefault();
      let txs = await accountdb.getAddressTxs(defaddr, defnet);
      let client = new HttpJsonRpcClient({ url: netitem.rpcurl });
      for (let i=0;i<txs.length;i++){
      }
      
      await sleep(5000);
    }
  }
  start() {
    this.run = true;
    this.netstatuscheck();
    this.syncbalance();
    // this.synctxs();
  }
}

const bs = new BackgroundService({
  db: {
    accountdb,
    globaldb
  }
});
function sleep(t) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, t);
  })
}

bs.start();

ReactDOM.render(
  <Router history={history} db={{
    accountdb: accountdb,
    globaldb: globaldb,
    extradb: extradb,
  }}>
    <App history={history} db={{
      accountdb: accountdb,
      globaldb: globaldb,
      extradb: extradb,
    }} />
  </Router>, document.getElementById("root"));
