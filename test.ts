import * as tbc from 'tbc-lib-js';
import { API } from 'tbc-contract';
import { getAddress, getPrivateKey } from "./src/generateAddress";
import { setAddressSatoshi, sendTBC } from "./src/sendTBC";
import { sendFT } from "./src/sendFT";
import { batchTransferTBC } from "./src/batchTransfer";
import { ExtendedAPI } from "./src/monitorUTXO";
import { buyFT, sellFT } from './src/buyAndSell';
import global from "./src/config";

export async function main() {
    try {
        // buyFT
        const buyLoop = async () => {
            while (true) {
                await batchTransferTBC();
                await new Promise(resolve => setTimeout(resolve, 5000));
                await buyFT();
            }
        };

        // sellFT
        const sellLoop = async () => {
            await sellFT();
        };

        await Promise.all([buyLoop(), sellLoop()]);
    } catch (error) {
        console.error("Error in main function:", error);
    }
}