"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = main;
const batchTransfer_1 = require("./src/batchTransfer");
const buyAndSell_1 = require("./src/buyAndSell");
async function main() {
    try {
        // buyFT
        const buyLoop = async () => {
            while (true) {
                await (0, batchTransfer_1.batchTransferTBC)();
                await new Promise(resolve => setTimeout(resolve, 5000));
                await (0, buyAndSell_1.buyFT)();
            }
        };
        // sellFT
        const sellLoop = async () => {
            await (0, buyAndSell_1.sellFT)();
        };
        await Promise.all([buyLoop(), sellLoop()]);
    }
    catch (error) {
        console.error("Error in main function:", error);
    }
}
