import axios from 'axios';
import global from "./config";
export async function postRequest(url: string, data: object): Promise<any> {
    try {
        const response = await axios.post(url, data, {
            headers: {
                'Content-Type': 'application/json',
            },
            proxy: false,
        });
        return response.data;
    } catch (error) {
        console.error('Error making POST request:', error);
        throw error;
    }
}

export function requstDataShell(txid: string, address: string, amount: number): { pool: string; hash: string; address: string; amount: number } {
    return {
        pool: global.POOL_CONTRACTID,
        hash: txid,
        address: address,
        amount: amount,
    };
}

export function requstDataOnion(txid: string, address: string, doType: 0 | 1): { coinContract: string; doType: 0 | 1; hash: string; canRec: string; address: string; } {
    return {
        coinContract: global.TOKEN_CONTRACTID,
        doType: doType,
        hash: txid,
        canRec: "0.1",
        address: address,
    };
}