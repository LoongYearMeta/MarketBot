## 配置文件各参数：
```ts
const NETWORK = "mainnet";//接入网络
const KEYS_NUMBER = 10;//机器人地址数量
const PRIVATEKEY_SUPPLY = "L4QWNAoThNxQLhWarLWaXQksRTyATENuHEgfkUbANoiPEKA92Ywo";//机器人主私钥
const ADDRESS_SUPPLY = "12Ex5VEWff744kUuHTj2Skwxjd93a3xHRc";//主私钥地址

//池和Token合约id
const TOKEN_CONTRACTID = "a2d772d61afeac6b719a74d87872b9bbe847aa21b41a9473db066eabcddd86f3";//Token ID
const POOL_CONTRACTID = "a29c97547aaa6f1e9cda8e2b5d314e9626e63cfaf20b91416ebcc11c9fd783b4";//Pool ID

//SHELLe聚合地址
//  const ADDRESS_RECEIVE_TBC = "1JUJPwmevxUNriQ8f8djPYnbrDhWguHQgZ";//聚合地址SHELL
//  const ADDRESS_RECEIVE_FT = "19Saoe2q39N6UmHa435Asqa2VBN9pSuELQ";//聚合地址SHELL

//ONION聚合地址
const ADDRESS_RECEIVE_TBC = "124kiUsxsrUqbPGhWAgPD1qLY2wXRMWSe8";//聚合地址ONION
const ADDRESS_RECEIVE_FT = "124kiUsxsrUqbPGhWAgPD1qLY2wXRMWSe8";//聚合地址ONION

//交易相关
const DEFAULT_BATCHTRANSFER_TBC_AMOUNT = 0.1;//向机器人地址批量转TBC
const DEFAULT_TRANSFER_TBC_AMOUNT = 0.1;//机器人地址向聚合地址转TBC，买单数额
const DEFAULT_TRANSFER_TOKEN_AMOUNT = 300;//机器人地址向聚合地址转FT，卖单数额
const DEFAULT_TRANSFER_FT_FEE = 0.01;//非必要不修改

const DEFAULT_BUY_INTERVAL = 60000//买单间隔1分钟
const DEFAULT_SELL_INTERVAL = 300000//卖单间隔5分钟

//SHELL后台请求
//  const REQUST_URL_BUY = "https://dev.shellswap.org/api/pool/buy";
//  const REQUST_URL_SELL = "https://dev.shellswap.org/api/pool/sell";

//ONION后台请求
const REQUST_URL_BUY = "https://www.neww.site/v2/swapOne";
const REQUST_URL_SELL = "https://www.neww.site/v2/swapOne";
```

## 机器人使用
- 修改项目下config.json文件完成机器人配置

- npm run build 编译项目

- 执行generateAddress.sh，生成机器人地址

- 运行run.sh启动机器人