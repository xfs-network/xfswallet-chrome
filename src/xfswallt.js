class XFSWalletApiHanlder {
    constructor({port, appdb, winmgr}){
        this.port = port;
        this.appdb = appdb;
        this.winmgr = winmgr;
    }
    async onSendTransaction(reqId, params){
        await this.winmgr.openPoputWindow({
            page: '/sendtx',
            state: params
        }, (data)=>{
            this.port.postMessage(data);
        }, reqId);
    }
    async onTransfer(reqId, params){
        await this.winmgr.openPoputWindow({
            page: '/sendtx',
            state: params
        }, (data)=>{
            this.port.postMessage(data);
        }, reqId);
    }
    async onConnect(reqId, params){
        await this.winmgr.openPoputWindow({
            page: '/connect',
            state: params
        }, (data)=>{
            this.port.postMessage(data);
        }, reqId);
    }
    async handle({method,params,reqId}){
        let methodName = method.replace(/^\S/, s => s.toUpperCase());
        const fn = Reflect.get(this, `on${methodName}`);
        await fn.bind(this,reqId,params)();
    }
}

export default XFSWalletApiHanlder;