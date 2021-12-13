class XFSWalletApiHanlder {
    constructor(port, appdb){
        this.port = port;
        this.appdb = appdb;
    }
    sendTransaction(){

    }
    async handle(msg){
        console.log(this.appdb);
        console.log('handle msg', msg);
        const {extradb} = this.appdb;
        await extradb.setPageState({
            page: '/abc',
            state: {
                to: 'aaa'
            }
        });
        chrome.windows.create({
            url: chrome.runtime.getURL("popup.html"),
            focused: true,
            height: 624,
            width: 392,
            type: "popup"
        },(win)=>{
            const tab0 = win.tabs[0];
            console.log('win', win);
            console.log('tb0', tab0);
            
        });
    }
}

export default XFSWalletApiHanlder;