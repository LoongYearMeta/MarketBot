import * as tbc from 'tbc-lib-js';
import { API } from 'tbc-contract';

export class ExtendedAPI extends API {
    private static mainnetURL: string = 'https://turingwallet.xyz/v1/tbc/main/';
    private static testnetURL: string = 'https://tbcdev.org/v1/tbc/main/';

    private static getBaseURL(network: "testnet" | "mainnet"): string {
        return network === "testnet" ? this.testnetURL : this.mainnetURL;
    }

    static async fetchFtUTXO_List(
        contractTxid: string,
        addressOrHash: string,
        network?: "testnet" | "mainnet"
      ) {
        let base_url = network
          ? ExtendedAPI.getBaseURL(network)
          : ExtendedAPI.getBaseURL("mainnet");
        let hash = "";
        if (tbc.Address.isValid(addressOrHash)) {
          // If the recipient is an address
          const publicKeyHash =
            tbc.Address.fromString(addressOrHash).hashBuffer.toString("hex");
          hash = publicKeyHash + "00";
        } else {
          // If the recipient is a hash
          if (addressOrHash.length !== 40) {
            throw new Error("Invalid address or hash");
          }
          hash = addressOrHash + "01";
        }
        const url =
          base_url + `ft/utxo/combine/script/${hash}/contract/${contractTxid}`;
        try {
          const response = await fetch(url, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
          if (!response.ok) {
            throw new Error(
              `Failed to fetch from URL: ${url}, status: ${response.status}`
            );
          }
          const responseData = await response.json();

          const list = responseData.ftUtxoList
          return list;
        } catch (error: any) {
          throw new Error(error.message);
        }
      }
}

