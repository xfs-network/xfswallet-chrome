
import localforage from "localforage";

const KEY_ADDR_PRE = 'addr:';

const KEY_DEFAULT_ADDR = 'defaultaddr';

const KEY_ADDR_NAME_PRE = 'addr-name:';
const KEY_ADDR_BALANCE_PRE = 'addr-balance:';
const KEY_ADDR_TX_PRE = 'addr-tx:';

class AccountDB {
    constructor(dbname){
        this.dbname = dbname;
        this.db = localforage.createInstance({
            name: dbname,
            driver: localforage.INDEXEDDB,
          });
    }
    async addAccount(name, acc) {
        let oldacc = await this.getAccount(acc.addr);
        if (oldacc){
            return;
        }
        let t = new Date().getTime();
        let account = {
            name: name,
            addr: acc.addr,
            key: acc.key,
            ctime: t,
        };
        return Promise.all([
            this.db.setItem(KEY_ADDR_PRE.concat(acc.addr), account),
            this.db.setItem(KEY_ADDR_NAME_PRE.concat(acc.addr), name),
            this.db.setItem(KEY_DEFAULT_ADDR, acc.addr),
        ]);
    }
    getAccount(addr) {
        return Promise.all([
            this.db.getItem(KEY_ADDR_PRE.concat(addr)),
            this.getAddressName(addr),
        ]).then(function(all){
            if (all.length < 2){
                return;
            }
            if (!(all[0] || all[1])){
                return;
            }
            return {
                addr: all[0].addr,
                key: all[0].key,
                ctime: all[0].ctime?all[0].ctime:0,
                name: all[1]?all[1]:'Unkonw',
            }
        });
    }
    setAddressName(addr, name){
        return this.db.setItem(KEY_ADDR_NAME_PRE.concat(addr), name);
    }
    getAddressName(addr){
        return this.db.getItem(KEY_ADDR_NAME_PRE.concat(addr));
    }
    setAddressBalance(addr, networkid, balance){
        // addr-balance:<address>:<networkid>
        return this.db.setItem(KEY_ADDR_BALANCE_PRE.concat(addr)
        .concat(`:${networkid}`), balance);
    }
    getAddressBalance(addr, networkid){
        // addr-balance:<address>:<networkid>
        return this.db.getItem(KEY_ADDR_BALANCE_PRE.concat(addr)
        .concat(`:${networkid}`));
    }
    getAddressTx(addr, networkid, hash){
        // addr-tx:<address>:<networkid>:<txhash>
        return this.db.getItem(KEY_ADDR_TX_PRE.concat(addr)
        .concat(`:${networkid}:`).concat(hash));
    }
    setAddressTx(addr, networkid, tx){
        const txhash = tx.hash();
        let txobj = tx.correctedObj();
        txobj.hash = txhash;
        // addr-tx:<address>:<networkid>:<txhash>
        return this.db.setItem(KEY_ADDR_TX_PRE.concat(addr)
        .concat(`:${networkid}:`).concat(txhash), txobj);
    }
    async getAddressTxCount(addr, networkid){
        let txs = await this.getAddressTxs(addr, networkid);
        return txs.length;
    }
    async getAddressTxs(addr, networkid){
        let keys = await this.db.keys();
        let txs = [];
        for (let i=0; i<keys.length; i++){
            let key = keys[i];
            // addr-tx:<address>:<networkid>:
            let want = KEY_ADDR_TX_PRE.concat(addr)
            .concat(`:${networkid}:`);
            if (!key.startsWith(want)){
                continue;
            }
            let txhash = key.slice(want.length, key.length);
            txs.push(txhash);
        }
        return txs;
    }
    async getAddressAllTxs(addr){
        let keys = await this.db.keys();
        let txs = [];
        for (let i=0; i<keys.length; i++){
            let key = keys[i];
            // addr-tx:<address>:
            let want = KEY_ADDR_TX_PRE.concat(`${addr}:`);
            if (!key.startsWith(want)){
                continue;
            }
            let txhash = key.slice(want.length, key.length);
            txs.push(txhash);
        }
        return txs;
    }
    sortAccountsByTime(accounts=[]) {
        for (let i = 0; i < accounts.length - 1; i++){
            for (let j = 0; j < accounts.length - 1 - i; j++) {
                let c = accounts[j];
                let n = accounts[j + 1];
                if (c.ctime > n.ctime){
                    accounts[j] = n;
                    accounts[j + 1] = c;
                }
            }
        }
        return accounts;
    }
    async listAllAccount(){
        let addrs = await this.listAddress();
        let lans = new Array(addrs.length);
        for (let i=0; i<addrs.length; i++){
            let acc = await this.getAccount(addrs[i]);
            lans[i] = acc;
        }
        return this.sortAccountsByTime(lans);
    }
    async addressCount(){
        let addrs = await this.listAddress();
        return addrs.length;
    }

    async listAddress(){
        let keys = await this.db.keys();
        let addrs = [];
        for (let i=0; i<keys.length; i++){
            let key = keys[i];
            if (!key.startsWith(KEY_ADDR_PRE)){
                continue;
            }
            let addr = key.slice(KEY_ADDR_PRE.length, key.length);
            addrs.push(addr);
        }
        return addrs;
    }
    getDefault(){
        return this.db.getItem(KEY_DEFAULT_ADDR);
    }
    async setDefault(addr){
        let acc = await this.getAccount(addr);
        if (!acc){
            return;
        }
        return this.db.setItem(KEY_DEFAULT_ADDR, addr);
    }
    async delAddressTxs(addr){
        let txs = await this.getAddressAllTxs(addr);
        let rmp = [];
        if (!txs) {
            for (let i=0;i<txs.length;i++){
                let key = KEY_ADDR_TX_PRE.concat(addr).concat(`:${txs[i]}`);
                rmp.push(this.db.removeItem(key));
            }
        }
        return  Promise.all(rmp);
    }
    async delAddress(addr){
        let txs = await this.getAddressAllTxs(addr);
        let rmp = [];
        if (!txs) {
            for (let i=0;i<txs.length;i++){
                let key = KEY_ADDR_TX_PRE.concat(addr).concat(`:${txs[i]}`);
                rmp.push(this.db.removeItem(key));
            }
        }
        return  Promise.all([
            this.db.removeItem(KEY_ADDR_PRE.concat(addr)),
            this.db.removeItem(KEY_ADDR_NAME_PRE.concat(addr)),
            this.db.removeItem(KEY_ADDR_BALANCE_PRE.concat(addr)),
        ].concat(rmp));
    }
    dropDB(){
        return this.db.dropInstance();
    }
    
}
export default AccountDB;