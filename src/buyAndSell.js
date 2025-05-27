"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buyFT = buyFT;
exports.sellFT = sellFT;
const tbc = __importStar(require("tbc-lib-js"));
const tbc_contract_1 = require("tbc-contract");
const generateAddress_1 = require("./generateAddress");
const sendTBC_1 = require("./sendTBC");
const sendFT_1 = require("./sendFT");
const monitorUTXO_1 = require("./monitorUTXO");
const requst_1 = require("./requst");
const log_1 = require("./log");
const config_1 = __importDefault(require("./config"));
const network = config_1.default.NETWORK;
const ftContractTxid = config_1.default.TOKEN_CONTRACTID;
const address_Receive_TBC = config_1.default.ADDRESS_RECEIVE_TBC;
const address_Receive_FT = config_1.default.ADDRESS_RECEIVE_FT;
const address_Supply = config_1.default.ADDRESS_SUPPLY;
const privateKey_Supply = tbc.PrivateKey.fromWIF(config_1.default.PRIVATEKEY_SUPPLY);
const basicTransferTBCAmount = config_1.default.DEFAULT_TRANSFER_TBC_AMOUNT * Math.pow(10, 6);
const basicTransferFTAmount = config_1.default.DEFAULT_TRANSFER_TOKEN_AMOUNT;
const buyInterval = config_1.default.DEFAULT_BUY_INTERVAL;
const sellInterval = config_1.default.DEFAULT_SELL_INTERVAL;
const requstUrlBuy = config_1.default.REQUST_URL_BUY;
const requstUrlSell = config_1.default.REQUST_URL_SELL;
const privateKeys = (0, generateAddress_1.getPrivateKey)();
async function buyFT() {
    const logFile = './logs/buy.log';
    for (const privateKey of privateKeys) {
        try {
            (0, log_1.logToFile)("buy:", logFile);
            const utxo = await tbc_contract_1.API.fetchUTXOs(privateKey.toAddress().toString(), network);
            const randomAdjustment = Math.floor(Math.random() * (basicTransferTBCAmount / 2)) - (basicTransferTBCAmount / 4);
            const receiveAddressSatoshi = (0, sendTBC_1.setAddressSatoshi)(address_Receive_TBC, basicTransferTBCAmount + randomAdjustment);
            (0, log_1.logToFile)(`receiveAddressSatoshi: ${JSON.stringify(Object.fromEntries(receiveAddressSatoshi))}`, logFile);
            const sendTBCtx = (0, sendTBC_1.sendTBC)(privateKey, receiveAddressSatoshi, utxo);
            const txid = await tbc_contract_1.API.broadcastTXraw(sendTBCtx, network);
            (0, log_1.logToFile)(`txid: ${txid}`, logFile);
            let requstDataBuy;
            if (requstUrlBuy === "https://dev.shellswap.org/api/pool/buy") {
                requstDataBuy = (0, requst_1.requstDataShell)(txid, privateKey.toAddress().toString(), parseFloat(((basicTransferTBCAmount + randomAdjustment) / Math.pow(10, 6)).toFixed(6)));
            }
            else if (requstUrlBuy === "https://www.neww.site/v2/swapOne") {
                requstDataBuy = (0, requst_1.requstDataOnion)(txid, privateKey.toAddress().toString(), 0);
            }
            else {
                throw new Error("Invalid requstUrlBuy");
            }
            (0, log_1.logToFile)(`requstDataBuy: ${JSON.stringify(requstDataBuy)}`, logFile);
            const response = await (0, requst_1.postRequest)(requstUrlBuy, requstDataBuy);
            (0, log_1.logToFile)(`Http Requst response: ${JSON.stringify(response)}`, logFile);
            await new Promise(resolve => setTimeout(resolve, 10000));
            const ftutxoList = await monitorUTXO_1.ExtendedAPI.fetchFtUTXO_List(ftContractTxid, privateKey.toAddress().toString(), network);
            if (ftutxoList.length > 0) {
                (0, log_1.logToFile)("sendFT:", logFile);
                const totalFtAmount = parseFloat(ftutxoList.reduce((sum, data) => sum + data.ftBalance / Math.pow(10, data.ftDecimal), 0).toFixed(6));
                const sendFTtx = await (0, sendFT_1.sendFT)(privateKey, address_Supply, totalFtAmount);
                (0, log_1.logToFile)(`sendAddressFT:${address_Supply} => ${totalFtAmount}`, logFile);
                const txid = await tbc_contract_1.API.broadcastTXraw(sendFTtx, network);
                (0, log_1.logToFile)(`txid: ${txid}`, logFile);
            }
            await new Promise(resolve => setTimeout(resolve, buyInterval - 10000));
        }
        catch (innerError) {
            (0, log_1.logToFile)(`Error processing: ${innerError}`, logFile);
            await new Promise(resolve => setTimeout(resolve, buyInterval));
            continue;
        }
    }
}
async function sellFT() {
    const logFile = './logs/sell.log';
    while (true) {
        try {
            await new Promise(resolve => setTimeout(resolve, sellInterval));
            (0, log_1.logToFile)("sell:", logFile);
            const randomAdjustment = Math.floor(Math.random() * (basicTransferFTAmount / 2)) - (basicTransferFTAmount / 4);
            (0, log_1.logToFile)(`receiveAddressFT:${address_Receive_FT} => ${basicTransferFTAmount + randomAdjustment}`, logFile);
            const sendFTtx = await (0, sendFT_1.sendFT)(privateKey_Supply, address_Receive_FT, basicTransferFTAmount + randomAdjustment);
            const txid = await tbc_contract_1.API.broadcastTXraw(sendFTtx, network);
            (0, log_1.logToFile)(`txid: ${txid}`, logFile);
            let requstDataSell;
            if (requstUrlSell === "https://dev.shellswap.org/api/pool/sell") {
                requstDataSell = (0, requst_1.requstDataShell)(txid, privateKey_Supply.toAddress().toString(), basicTransferFTAmount + randomAdjustment);
            }
            else if (requstUrlSell === "https://www.neww.site/v2/swapOne") {
                requstDataSell = (0, requst_1.requstDataOnion)(txid, privateKey_Supply.toAddress().toString(), 1);
            }
            else {
                throw new Error("Invalid requstUrlSell");
            }
            (0, log_1.logToFile)(`requstDataSell: ${JSON.stringify(requstDataSell)}`, logFile);
            const response = await (0, requst_1.postRequest)(requstUrlSell, requstDataSell);
            (0, log_1.logToFile)(`Http Requst response: ${JSON.stringify(response)}`, logFile);
        }
        catch (innerError) {
            (0, log_1.logToFile)(`Error processing: ${innerError}`, logFile);
            continue;
        }
    }
}
