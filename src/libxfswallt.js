function postAndCallMethod(msg){
    window.postMessage({type: "FROM_PAGE", text: msg}, "*");
}

class LibXFSWallet {
    constructor(){
    }
    connect(fn){
        postAndCallMethod('account.connect');
    }
}
export default LibXFSWallet;