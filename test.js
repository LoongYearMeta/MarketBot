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
const tbc = __importStar(require("tbc-lib-js"));
const generateAddress_1 = require("./src/generateAddress");
const buyAndSell_1 = require("./src/buyAndSell");
const global = __importStar(require("./config"));
const network = global.NETWORK;
const ftContractTxid = global.TOKEN_CONTRACTID;
const address_Receive_TBC = global.ADDRESS_RECEIVE_TBC;
const address_Receive_FT = global.ADDRESS_RECEIVE_FT;
const address_Supply = global.ADDRESS_SUPPLY;
const privateKey_Supply = tbc.PrivateKey.fromWIF(global.PRIVATEKEY_SUPPLY);
const basicTransferTBCAmount = global.DEFAULT_TRANSFER_TOKEN_AMOUNT * Math.pow(10, 6);
const basicTransferFTAmount = global.DEFAULT_TRANSFER_TOKEN_AMOUNT;
const privateKeys = (0, generateAddress_1.getPrivateKey)();
async function main() {
    try {
        // await batchTransferTBC();
        await Promise.all([(0, buyAndSell_1.buyFT)(), (0, buyAndSell_1.sellFT)()]);
    }
    catch (error) {
        console.error("Error in main function:", error);
    }
}
main();
