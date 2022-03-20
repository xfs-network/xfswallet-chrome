import axios from "axios";
const JSONRPC_VER = '2.0';
class HttpJsonRpcClient {
    constructor(opts = {url:''}){
        this.url = opts.url;
        this.axioscli = axios.create({
            baseURL: this.url,
            timeout: 1000
        });
    }
    async call(opts = {method:'', params: null}) {
        try {
            let resp = await this.axioscli.post('/', this.packreq(opts));
            if (Object.keys(resp.data).indexOf('error') === 0) {
                const {error: {code ,message}} = resp.data;
                throw new Error(message);
            }
            const {id, jsonrpc, result} = resp.data;
            if (id !== 1){
                throw new Error(`Unknown request id: ${id}`);
            }
            if (jsonrpc !== JSONRPC_VER){
                throw new Error(`Unknown jsonrpc version: ${jsonrpc}`);
            }
            return result;
        }catch (error) {
            throw(error);
        }
    }
    packreq({method,params}) {
        return {
            method: method,
            params: params,
            id: 1,
            jsonrpc: JSONRPC_VER
        }
    }
}
export default HttpJsonRpcClient;