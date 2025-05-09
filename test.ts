import * as tbc from 'tbc-lib-js';
import { API } from 'tbc-contract';
import { getAddress, getPrivateKey } from "./src/generateAddress";
import { setAddressSatoshi, sendTBC } from "./src/sendTBC";
import { sendFT } from "./src/sendFT";
import { batchTransferTBC } from "./src/batchTransfer";
import { ExtendedAPI } from "./src/monitorUTXO";
import { buyFT, sellFT } from './src/buyAndSell';
import * as global from "./config";

const network = global.NETWORK;
const ftContractTxid = global.TOKEN_CONTRACTID;
const address_Receive_TBC = global.ADDRESS_RECEIVE_TBC;
const address_Receive_FT = global.ADDRESS_RECEIVE_FT;
const address_Supply = global.ADDRESS_SUPPLY;
const privateKey_Supply = tbc.PrivateKey.fromWIF(global.PRIVATEKEY_SUPPLY);
const basicTransferTBCAmount = global.DEFAULT_TRANSFER_TOKEN_AMOUNT * Math.pow(10, 6);
const basicTransferFTAmount = global.DEFAULT_TRANSFER_TOKEN_AMOUNT;

const privateKeys = getPrivateKey();


async function main() {
    try {
        // await batchTransferTBC();

        await Promise.all([buyFT(), sellFT()]);

    } catch (error) {
        console.error("Error in main function:", error);
    }
}

main();