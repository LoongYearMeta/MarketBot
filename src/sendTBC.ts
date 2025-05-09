import * as tbc from 'tbc-lib-js';

export function setAddressSatoshi(address: string | string[], amount: number) {
    const receiveAddressSatoshi = new Map<string, number>();
    if (typeof address === 'string') {
        receiveAddressSatoshi.set(address, amount);
    } else{
        for (const addr of address) {
            receiveAddressSatoshi.set(addr, amount);
        }
    }
    return receiveAddressSatoshi;
}

export function sendTBC(privateKey: tbc.PrivateKey, receiveAddressSatoshi: Map<string, number>, utxo: tbc.Transaction.IUnspentOutput[]) {
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