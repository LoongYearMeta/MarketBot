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
exports.ExtendedAPI = void 0;
const tbc = __importStar(require("tbc-lib-js"));
const tbc_contract_1 = require("tbc-contract");
class ExtendedAPI extends tbc_contract_1.API {
    static mainnetURL = 'https://turingwallet.xyz/v1/tbc/main/';
    static testnetURL = 'https://tbcdev.org/v1/tbc/main/';
    static getBaseURL(network) {
        return network === "testnet" ? this.testnetURL : this.mainnetURL;
    }
    static async fetchFtUTXO_List(contractTxid, addressOrHash, network) {
        let base_url = network
            ? ExtendedAPI.getBaseURL(network)
            : ExtendedAPI.getBaseURL("mainnet");
        let hash = "";
        if (tbc.Address.isValid(addressOrHash)) {
            // If the recipient is an address
            const publicKeyHash = tbc.Address.fromString(addressOrHash).hashBuffer.toString("hex");
            hash = publicKeyHash + "00";
        }
        else {
            // If the recipient is a hash
            if (addressOrHash.length !== 40) {
                throw new Error("Invalid address or hash");
            }
            hash = addressOrHash + "01";
        }
        const url = base_url + `ft/utxo/combine/script/${hash}/contract/${contractTxid}`;
        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                throw new Error(`Failed to fetch from URL: ${url}, status: ${response.status}`);
            }
            const responseData = await response.json();
            const list = responseData.ftUtxoList;
            return list;
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
}
exports.ExtendedAPI = ExtendedAPI;
