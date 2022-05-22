class KeyStoreProvider {
    constructor(args) {
       this.args = args; 
    }
    getPrivateKeyByAddress(addr){
        const {wallet} = this.args;
        return new Promise((resolve, reject)=>{
            console.log('get key', addr);
            wallet.requestSignData({addr}, (key)=>{
                console.log('key', key);
            });
        })
    }
}

export default KeyStoreProvider;