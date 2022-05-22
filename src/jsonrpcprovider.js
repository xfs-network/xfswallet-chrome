const JSONRPC_VER = '2.0';
import axios from "axios";

class JsonRpcProvider {
    constructor(args) {
       this.args = args; 
    }
    packreq({ method, params }) {
        return {
            method: method,
            params: params,
            id: 1,
            jsonrpc: JSONRPC_VER
        };
    }

    async call(opts) {
        console.log('call', opts);
        return;
        try {
            const cli = axios.create({
                baseURL: baseurl,
                timeout: 1000,
            });
            const requestdata = this.packreq(opts);
            console.log(`RPC Request: >> ${JSON.stringify(requestdata)}`);
            let resp = await cli.post('/', this.packreq(opts));
            console.log(`RPC Result: << ${JSON.stringify(resp.data)}`);
            if (Object.keys(resp.data).indexOf('error') === 0) {
                const { error: { code, message } } = resp.data;
                throw new Error(`Code=${code}, Message='${message}'`);
            }
            const { id, jsonrpc, result } = resp.data;
            if (id !== 1) {
                throw new Error(`Unknown request id: ${id}`);
            }
            if (jsonrpc !== JSONRPC_VER) {
                throw new Error(`Unknown jsonrpc version: ${jsonrpc}`);
            }
            return result;
        } catch (error) {
            throw error;
        }
    }
}

export default JsonRpcProvider;