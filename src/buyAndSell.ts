import * as tbc from 'tbc-lib-js';
import { API } from 'tbc-contract';
import { getAddress, getPrivateKey } from "./generateAddress";
import { setAddressSatoshi, sendTBC } from "./sendTBC";
import { sendFT } from "./sendFT";
import { batchTransferTBC } from "./batchTransfer";
import { ExtendedAPI } from "./monitorUTXO";
import { postRequest, requstDataShell, requstDataOnion } from './requst';
import { logToFile } from './log';
import * as global from "../config";

const network = global.NETWORK;
const ftContractTxid = global.TOKEN_CONTRACTID;
const address_Receive_TBC = global.ADDRESS_RECEIVE_TBC;
const address_Receive_FT = global.ADDRESS_RECEIVE_FT;
const address_Supply = global.ADDRESS_SUPPLY;
const privateKey_Supply = tbc.PrivateKey.fromWIF(global.PRIVATEKEY_SUPPLY);
const basicTransferTBCAmount = global.DEFAULT_TRANSFER_TBC_AMOUNT * Math.pow(10, 6);
const basicTransferFTAmount = global.DEFAULT_TRANSFER_TOKEN_AMOUNT;
const buyInterval = global.DEFAULT_BUY_INTERVAL;
const sellInterval = global.DEFAULT_SELL_INTERVAL;
const requstUrlBuy = global.REQUST_URL_BUY;
const requstUrlSell = global.REQUST_URL_SELL;

const privateKeys = getPrivateKey();

export async function buyFT() {
    const logFile = './logs/buy.log';
    for (const privateKey of privateKeys) {
        try {
            logToFile("buy:", logFile);
            const utxo = await API.fetchUTXOs(privateKey.toAddress().toString(), network);
            const randomAdjustment = Math.floor(Math.random() * (basicTransferTBCAmount / 2)) - (basicTransferTBCAmount / 4);
            const receiveAddressSatoshi = setAddressSatoshi(address_Receive_TBC, basicTransferTBCAmount + randomAdjustment);
            logToFile(`receiveAddressSatoshi: ${JSON.stringify(Object.fromEntries(receiveAddressSatoshi))}`, logFile);
            const sendTBCtx = sendTBC(privateKey, receiveAddressSatoshi, utxo);
            const txid = await API.broadcastTXraw(sendTBCtx, network);
            logToFile(`txid: ${txid}`, logFile);

            // const requstDataBuy = requstDataShell(txid, privateKey.toAddress().toString(), parseFloat(((basicTransferTBCAmount + randomAdjustment) / Math.pow(10, 6)).toFixed(6)));
            const requstDataBuy = requstDataOnion(txid, privateKey.toAddress().toString(), 0);
            logToFile(`requstDataBuy: ${JSON.stringify(requstDataBuy)}`, logFile);
            const response = await postRequest(requstUrlBuy, requstDataBuy);
            logToFile(`Http Requst response: ${JSON.stringify(response)}`, logFile);

            await new Promise(resolve => setTimeout(resolve, 10000));
            const ftutxoList = await ExtendedAPI.fetchFtUTXO_List(ftContractTxid, privateKey.toAddress().toString(), network);
            if (ftutxoList.length > 0) {
                logToFile("sendFT:", logFile);
                const totalFtAmount = parseFloat(ftutxoList.reduce((sum, data) => sum + data.ftBalance / Math.pow(10, data.ftDecimal), 0).toFixed(6));
                const sendFTtx = await sendFT(privateKey, address_Supply, totalFtAmount);
                logToFile(`sendAddressFT:${address_Supply} => ${totalFtAmount}`, logFile);
                const txid = await API.broadcastTXraw(sendFTtx, network);
                logToFile(`txid: ${txid}`, logFile);
            }
            await new Promise(resolve => setTimeout(resolve, buyInterval - 10000));
        } catch (innerError) {
            logToFile(`Error processing: ${innerError}`, logFile);
            await new Promise(resolve => setTimeout(resolve, buyInterval));
            continue;
        }
    }
}

export async function sellFT() {
    const logFile = './logs/sell.log';
    while (true) {
        try {
            await new Promise(resolve => setTimeout(resolve, sellInterval));
            logToFile("sell:", logFile);
            const randomAdjustment = Math.floor(Math.random() * (basicTransferFTAmount / 2)) - (basicTransferFTAmount / 4);
            logToFile(`receiveAddressFT:${address_Receive_FT} => ${basicTransferFTAmount + randomAdjustment}`, logFile);
            const sendFTtx = await sendFT(privateKey_Supply, address_Receive_FT, basicTransferFTAmount + randomAdjustment);
            const txid = await API.broadcastTXraw(sendFTtx, network);
            logToFile(`txid: ${txid}`, logFile);

            // const requstDataSell = requstDataShell(txid, privateKey_Supply.toAddress().toString(), basicTransferFTAmount + randomAdjustment);
            const requstDataSell = requstDataOnion(txid, privateKey_Supply.toAddress().toString(), 1);
            logToFile(`requstDataSell: ${JSON.stringify(requstDataSell)}`, logFile);
            const response = await postRequest(requstUrlSell, requstDataSell);
            logToFile(`Http Requst response: ${JSON.stringify(response)}`, logFile);
        } catch (innerError) {
            logToFile(`Error processing: ${innerError}`, logFile);
            continue;
        }
    }
}