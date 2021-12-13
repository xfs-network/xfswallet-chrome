
import localforage from "localforage";

const KEY_PASSWORD = 'password';

const KEY_NETWORK_PRE = 'net:';
const KEY_NETWORK_STATUS_PRE = 'net-status:';
const KEY_DEFAULT_NET = 'defaultnet';
const DEFAULT_NETS = [
    {
        id: 1,
        name: 'LocalHost 9012',
        rpcurl: 'http://localhost:9012',
        lock: false,
        default: true,
    },
];
class GlobalDB {
    constructor(dbname){
        this.dbname = dbname;
        this.db = localforage.createInstance({
            name: dbname,
            driver: localforage.INDEXEDDB,
        });
    }
    async initialSetup(){
        for (let i = 0; i < DEFAULT_NETS.length; i++){
            let item = DEFAULT_NETS[i];
            await this.setNetwork(item);
            if (item.default){
                await this.setDefaultNet(item.id);
            }
        }
    }
    setPassword(pass) {
        return this.db.setItem(KEY_PASSWORD, pass);
    }
    getPassword(){
        return this.db.getItem(KEY_PASSWORD);
    }
    async verifyPassword(pass){
        let got = await this.getPassword();
        if (got === pass){
            return true;
        }
        return false;
    }
    async setNetwork(item) {
        let t = new Date().getTime();
        item.ctime = t;
        await this.db.setItem(KEY_NETWORK_PRE.concat(item.id), item);
        return item;
    }
    setNetworkStatus(id, status) {
        return this.db.setItem(KEY_NETWORK_STATUS_PRE.concat(id), status);
    }
    getNetworkStatus(id) {
        return this.db.getItem(KEY_NETWORK_STATUS_PRE.concat(id));
    }
    getNetwork(id) {
        return this.db.getItem(KEY_NETWORK_PRE.concat(id));
    }
    sortByTime(list=[]) {
        for (let i = 0; i < list.length - 1; i++){
            for (let j = 0; j < list.length - 1 - i; j++) {
                let c = list[j];
                let n = list[j + 1];
                if (c.ctime > n.ctime){
                    list[j] = n;
                    list[j + 1] = c;
                }
            }
        }
        return list;
    }
    async listAllNetwork(){
        let data = await this.listNetworkIds();
        let nets = new Array(data.length);
        for (let i=0; i<data.length; i++){
            let net = await this.getNetwork(data[i]);
            nets[i] = net;
        }
        return this.sortByTime(nets);
    }
    async networkCount(){
        let nets = await this.listNetworkName();
        return nets.length;
    }

    async listNetworkIds(){
        let keys = await this.db.keys();
        let data = [];
        for (let i=0; i<keys.length; i++){
            let key = keys[i];
            if (!key.startsWith(KEY_NETWORK_PRE)){
                continue;
            }
            let id = key.slice(KEY_NETWORK_PRE.length, key.length);
            data.push(id);
        }
        return data;
    }
    getDefaultNet(){
        return this.db.getItem(KEY_DEFAULT_NET);
    }
    async setDefaultNet(id){
        let data = await this.getNetwork(id);
        if (!data){
            return;
        }
        return this.db.setItem(KEY_DEFAULT_NET, id);
    }
    async delNet(id){
        return  this.db.removeItem(KEY_NETWORK_PRE.concat(id));
    }
    dropDB(){
        return this.db.dropInstance();
    }
    
}
export default GlobalDB;