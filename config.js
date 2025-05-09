"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REQUST_URL_SELL = exports.REQUST_URL_BUY = exports.DEFAULT_SELL_INTERVAL = exports.DEFAULT_BUY_INTERVAL = exports.DEFAULT_TRANSFER_FT_FEE = exports.DEFAULT_TRANSFER_TOKEN_AMOUNT = exports.DEFAULT_TRANSFER_TBC_AMOUNT = exports.DEFAULT_BATCHTRANSFER_TBC_AMOUNT = exports.ADDRESS_RECEIVE_FT = exports.ADDRESS_RECEIVE_TBC = exports.POOL_CONTRACTID = exports.TOKEN_CONTRACTID = exports.ADDRESS_SUPPLY = exports.PRIVATEKEY_SUPPLY = exports.KEYS_NUMBER = exports.NETWORK = void 0;
exports.NETWORK = "mainnet";
exports.KEYS_NUMBER = 10; //机器人地址数量
exports.PRIVATEKEY_SUPPLY = "L4QWNAoThNxQLhWarLWaXQksRTyATENuHEgfkUbANoiPEKA92Ywo";
exports.ADDRESS_SUPPLY = "12Ex5VEWff744kUuHTj2Skwxjd93a3xHRc";
exports.TOKEN_CONTRACTID = "a2d772d61afeac6b719a74d87872b9bbe847aa21b41a9473db066eabcddd86f3"; //Token ID
exports.POOL_CONTRACTID = "a29c97547aaa6f1e9cda8e2b5d314e9626e63cfaf20b91416ebcc11c9fd783b4"; //Pool ID
// export const ADDRESS_RECEIVE_TBC = "1JUJPwmevxUNriQ8f8djPYnbrDhWguHQgZ";//聚合地址SHELL
// export const ADDRESS_RECEIVE_FT = "19Saoe2q39N6UmHa435Asqa2VBN9pSuELQ";//聚合地址SHELL
exports.ADDRESS_RECEIVE_TBC = "124kiUsxsrUqbPGhWAgPD1qLY2wXRMWSe8"; //聚合地址ONION
exports.ADDRESS_RECEIVE_FT = "124kiUsxsrUqbPGhWAgPD1qLY2wXRMWSe8"; //聚合地址ONION
exports.DEFAULT_BATCHTRANSFER_TBC_AMOUNT = 1; //向机器人地址批量转TBC
exports.DEFAULT_TRANSFER_TBC_AMOUNT = 0.1; //机器人地址向聚合地址转TBC
exports.DEFAULT_TRANSFER_TOKEN_AMOUNT = 300; //机器人地址向聚合地址转FT
exports.DEFAULT_TRANSFER_FT_FEE = 0.01;
exports.DEFAULT_BUY_INTERVAL = 60000; //买单间隔1分钟
exports.DEFAULT_SELL_INTERVAL = 300000; //卖单间隔5分钟
// export const REQUST_URL_BUY = "https://dev.shellswap.org/api/pool/buy";
// export const REQUST_URL_SELL = "https://dev.shellswap.org/api/pool/sell";
exports.REQUST_URL_BUY = "https://www.neww.site/v2/swapOne";
exports.REQUST_URL_SELL = "https://www.neww.site/v2/swapOne";
