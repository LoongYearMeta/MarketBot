"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendFT = sendFT;
const tbc_contract_1 = require("tbc-contract");
const config_1 = __importDefault(require("./config"));
const network = config_1.default.NETWORK;
const fee = config_1.default.DEFAULT_TRANSFER_FT_FEE;
const ftContractTxid = config_1.default.TOKEN_CONTRACTID;
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
