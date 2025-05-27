"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRequest = postRequest;
exports.requstDataShell = requstDataShell;
exports.requstDataOnion = requstDataOnion;
const axios_1 = __importDefault(require("axios"));
const config_1 = __importDefault(require("./config"));
async function postRequest(url, data) {
    try {
        const response = await axios_1.default.post(url, data, {
            headers: {
                'Content-Type': 'application/json',
            },
            proxy: false,
        });
        return response.data;
    }
    catch (error) {
        console.error('Error making POST request:', error);
        throw error;
    }
}
function requstDataShell(txid, address, amount) {
    return {
        pool: config_1.default.POOL_CONTRACTID,
        hash: txid,
        address: address,
        amount: amount,
    };
}
function requstDataOnion(txid, address, doType) {
    return {
        coinContract: config_1.default.TOKEN_CONTRACTID,
        doType: doType,
        hash: txid,
        canRec: "0.1",
        address: address,
    };
}
