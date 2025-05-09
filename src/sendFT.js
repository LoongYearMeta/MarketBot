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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendFT = sendFT;
const tbc_contract_1 = require("tbc-contract");
const global = __importStar(require("../config"));
const network = global.NETWORK;
const fee = global.DEFAULT_TRANSFER_FT_FEE;
const ftContractTxid = global.TOKEN_CONTRACTID;
async function sendFT(privateKey, receiveAddress, receiveAmount) {
    try {
        const addressFrom = privateKey.toAddress().toString();
        const Token = new tbc_contract_1.FT(ftContractTxid);
        const TokenInfo = await tbc_contract_1.API.fetchFtInfo(Token.contractTxid, network); //获取FT信息
        Token.initialize(TokenInfo);
        const tbc_amount = 0; //如果同时转tbc和ft可设置此值,只转ft可忽略
        const utxo = await tbc_contract_1.API.fetchUTXO(privateKey, tbc_amount + fee, network); //准备utxo 不转tbc可忽略 tbc_amount
        const transferTokenAmountBN = BigInt(Math.ceil(receiveAmount * Math.pow(10, Token.decimal)));
        const ftutxo_codeScript = tbc_contract_1.FT.buildFTtransferCode(Token.codeScript, addressFrom).toBuffer().toString('hex');
        const ftutxos = await tbc_contract_1.API.fetchFtUTXOs(Token.contractTxid, addressFrom, ftutxo_codeScript, network, transferTokenAmountBN); //准备ft utxo
        let preTXs = [];
        let prepreTxDatas = [];
        for (let i = 0; i < ftutxos.length; i++) {
            preTXs.push(await tbc_contract_1.API.fetchTXraw(ftutxos[i].txId, network)); //获取每个ft输入的父交易
            prepreTxDatas.push(await tbc_contract_1.API.fetchFtPrePreTxData(preTXs[i], ftutxos[i].outputIndex, network)); //获取每个ft输入的爷交易
        }
        const transferTX = Token.transfer(privateKey, receiveAddress, receiveAmount, ftutxos, utxo, preTXs, prepreTxDatas); //组装交易
        return transferTX;
        // await API.broadcastTXraw(transferTX, network);
    }
    catch (error) {
        console.error(error);
    }
}
