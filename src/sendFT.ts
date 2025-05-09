import * as tbc from 'tbc-lib-js';
import { API, FT } from 'tbc-contract'
import * as global from "../config";

const network = global.NETWORK;
const fee = global.DEFAULT_TRANSFER_FT_FEE;
const ftContractTxid = global.TOKEN_CONTRACTID;

export async function sendFT(privateKey: tbc.PrivateKey, receiveAddress: string, receiveAmount: number) {
    try {
        const addressFrom = privateKey.toAddress().toString();
        const Token = new FT(ftContractTxid);
        const TokenInfo = await API.fetchFtInfo(Token.contractTxid, network);//获取FT信息
        Token.initialize(TokenInfo);
        const tbc_amount = 0;  //如果同时转tbc和ft可设置此值,只转ft可忽略
        const utxo = await API.fetchUTXO(privateKey, tbc_amount + fee, network);//准备utxo 不转tbc可忽略 tbc_amount
        const transferTokenAmountBN = BigInt(Math.ceil(receiveAmount * Math.pow(10, Token.decimal)));
        const ftutxo_codeScript = FT.buildFTtransferCode(Token.codeScript, addressFrom).toBuffer().toString('hex');
        const ftutxos = await API.fetchFtUTXOs(Token.contractTxid, addressFrom, ftutxo_codeScript, network, transferTokenAmountBN);//准备ft utxo
        let preTXs: tbc.Transaction[] = [];
        let prepreTxDatas: string[] = [];
        for (let i = 0; i < ftutxos.length; i++) {
            preTXs.push(await API.fetchTXraw(ftutxos[i].txId, network));//获取每个ft输入的父交易
            prepreTxDatas.push(await API.fetchFtPrePreTxData(preTXs[i], ftutxos[i].outputIndex, network));//获取每个ft输入的爷交易
        }
        const transferTX = Token.transfer(privateKey, receiveAddress, receiveAmount, ftutxos, utxo, preTXs, prepreTxDatas);//组装交易
        return transferTX;
        // await API.broadcastTXraw(transferTX, network);
    } catch (error) {
        console.error(error);
    }
}