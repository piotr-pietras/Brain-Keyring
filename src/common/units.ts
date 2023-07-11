export const gweiToWei = (gwei: number) => gwei * Math.pow(10, 9);
export const ethToWei = (eth: number) => eth * Math.pow(10, 18);
export const weiToEth = (eth: number) => eth / Math.pow(10, 18);
export const btcToSatoshi = (btc: number) => btc * Math.pow(10, 8);
export const satoshiToBtc = (btc: number) => btc / Math.pow(10, 8);
