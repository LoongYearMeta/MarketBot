import * as tbc from 'tbc-lib-js';
import * as fs from 'fs';
import global from "./config";

export function generateAddress() {
    let i = 0;
    while (i < global.KEYS_NUMBER) {
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

export function getAddress() {
    const address = fs.readFileSync('./address.txt', 'utf-8').split('\n');
    const addresses = [];
    for (const addr of address) {
        if (addr.trim()) {
            try {
                addresses.push(addr);
            } catch (error) {
                console.error(`Invalid key skipped: ${addr}`, error.message);
            }
        }
    }
    return addresses;
}

export function getPrivateKey() {
    const keys = fs.readFileSync('./keys.txt', 'utf-8').split('\n');
    const privateKeys = [];
    for (const key of keys) {
        if (key.trim()) { // Ensure the key is not empty or whitespace
            try {
                privateKeys.push(tbc.PrivateKey.fromWIF(key));
            } catch (error) {
                console.error(`Invalid key skipped: ${key}`, error.message);
            }
        }
    }
    return privateKeys;
}
