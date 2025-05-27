import * as tbc from 'tbc-lib-js';
import { API } from 'tbc-contract'
import { setAddressSatoshi, sendTBC } from "./sendTBC";
import global from "./config";
import { getAddress } from './generateAddress';

const network = global.NETWORK;
const privateKey_Supply = tbc.PrivateKey.fromWIF(global.PRIVATEKEY_SUPPLY);
const address_Supply = global.ADDRESS_SUPPLY;
const batchTransferTBCSatoshi = Math.ceil(global.DEFAULT_BATCHTRANSFER_TBC_AMOUNT * Math.pow(10, 6));
// const privateKey_Supply = tbc.PrivateKey.fromWIF("L4QWNAoThNxQLhWarLWaXQksRTyATENuHEgfkUbANoiPEKA92Ywo");
// const address_Supply = privateKey_Supply.toAddress().toString();//12Ex5VEWff744kUuHTj2Skwxjd93a3xHRc

const addresses = getAddress();
const receiveAddressAmount = setAddressSatoshi(addresses, batchTransferTBCSatoshi);

export async function batchTransferTBC() {
    try {
        const utxo = await API.fetchUTXOs(address_Supply, network);
        const sendTBCtx = sendTBC(privateKey_Supply, receiveAddressAmount, utxo);
        await API.broadcastTXraw(sendTBCtx, network);
    } catch (error) {
        console.error(error);
    }
}