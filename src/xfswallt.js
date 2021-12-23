class XFSWalletApiHanlder {
    constructor({port, appdb, winmgr}){
        this.port = port;
        this.appdb = appdb;
        this.winmgr = winmgr;
    }
    sendTransaction(){

    }
    async openPopupWindow({page,state}){
        
    }
    async handle({method,reqId}){
        const {extradb} = this.appdb;
        await this.winmgr.openPoputWindow({
            page: '/autha',
            state: {
                
            }
        }, (data)=>{
            this.port.postMessage(data);
        }, reqId);
    }
}

export default XFSWalletApiHanlder;