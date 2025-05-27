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
exports.batchTransferTBC = batchTransferTBC;
const tbc = __importStar(require("tbc-lib-js"));
const tbc_contract_1 = require("tbc-contract");
const sendTBC_1 = require("./sendTBC");
const config_1 = __importDefault(require("./config"));
const generateAddress_1 = require("./generateAddress");
const network = config_1.default.NETWORK;
const privateKey_Supply = tbc.PrivateKey.fromWIF(config_1.default.PRIVATEKEY_SUPPLY);
const address_Supply = config_1.default.ADDRESS_SUPPLY;
const batchTransferTBCSatoshi = Math.ceil(config_1.default.DEFAULT_BATCHTRANSFER_TBC_AMOUNT * Math.pow(10, 6));
// const privateKey_Supply = tbc.PrivateKey.fromWIF("L4QWNAoThNxQLhWarLWaXQksRTyATENuHEgfkUbANoiPEKA92Ywo");
// const address_Supply = privateKey_Supply.toAddress().toString();//12Ex5VEWff744kUuHTj2Skwxjd93a3xHRc
const addresses = (0, generateAddress_1.getAddress)();
const receiveAddressAmount = (0, sendTBC_1.setAddressSatoshi)(addresses, batchTransferTBCSatoshi);
async function batchTransferTBC() {
    try {
        const utxo = await tbc_contract_1.API.fetchUTXOs(address_Supply, network);
        const sendTBCtx = (0, sendTBC_1.sendTBC)(privateKey_Supply, receiveAddressAmount, utxo);
        await tbc_contract_1.API.broadcastTXraw(sendTBCtx, network);
    }
    catch (error) {
        console.error(error);
    }
}
