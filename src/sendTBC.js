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
exports.setAddressSatoshi = setAddressSatoshi;
exports.sendTBC = sendTBC;
const tbc = __importStar(require("tbc-lib-js"));
function setAddressSatoshi(address, amount) {
    const receiveAddressSatoshi = new Map();
    if (typeof address === 'string') {
        receiveAddressSatoshi.set(address, amount);
    }
    else {
        for (const addr of address) {
            receiveAddressSatoshi.set(addr, amount);
        }
    }
    return receiveAddressSatoshi;
}
function sendTBC(privateKey, receiveAddressSatoshi, utxo) {
    const tx = new tbc.Transaction().from(utxo);
    receiveAddressSatoshi.forEach((tbcSatoshi, address) => {
        tx.to(address, tbcSatoshi);
    });
    tx.change(privateKey.toAddress());
    const txSize = tx.getEstimateSize();
    tx.fee(txSize < 1000 ? 80 : Math.ceil(txSize / 1000) * 80);
    tx.sign(privateKey).seal();
    const txraw = tx.uncheckedSerialize();
    // console.log(tx.toObject());
    return txraw;
}
