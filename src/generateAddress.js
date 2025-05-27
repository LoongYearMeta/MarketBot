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
exports.generateAddress = generateAddress;
exports.getAddress = getAddress;
exports.getPrivateKey = getPrivateKey;
const tbc = __importStar(require("tbc-lib-js"));
const fs = __importStar(require("fs"));
const config_1 = __importDefault(require("./config"));
function generateAddress() {
    let i = 0;
    while (i < config_1.default.KEYS_NUMBER) {
        const privateKey = tbc.PrivateKey.fromRandom();
        if (fs.existsSync('./keys.txt') && fs.statSync('./keys.txt').size > 0) {
            fs.appendFileSync('./keys.txt', '\n');
        }
        fs.appendFileSync('./keys.txt', privateKey.toString());
        if (fs.existsSync('./address.txt') && fs.statSync('./address.txt').size > 0) {
            fs.appendFileSync('./address.txt', '\n');
        }
        fs.appendFileSync('./address.txt', privateKey.toAddress().toString());
        i++;
    }
}
function getAddress() {
    const address = fs.readFileSync('./address.txt', 'utf-8').split('\n');
    const addresses = [];
    for (const addr of address) {
        if (addr.trim()) {
            try {
                addresses.push(addr);
            }
            catch (error) {
                console.error(`Invalid key skipped: ${addr}`, error.message);
            }
        }
    }
    return addresses;
}
function getPrivateKey() {
    const keys = fs.readFileSync('./keys.txt', 'utf-8').split('\n');
    const privateKeys = [];
    for (const key of keys) {
        if (key.trim()) { // Ensure the key is not empty or whitespace
            try {
                privateKeys.push(tbc.PrivateKey.fromWIF(key));
            }
            catch (error) {
                console.error(`Invalid key skipped: ${key}`, error.message);
            }
        }
    }
    return privateKeys;
}
