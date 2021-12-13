function postMsg(msg){
    window.postMessage({type: "FROM_PAGE", text: msg}, "*");
}

class LibXFSWallet {
    constructor(){
    }
    sayhello(){
        postMsg('abc');
    }
}
export default LibXFSWallet;