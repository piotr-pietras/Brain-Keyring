import { Blockchains, Net } from "../common/blockchain.types.js";

export class Keys {
  decimals: number;
  blockchain: Blockchains;
  net: Net;
  keysHex: { privKey: string; pubKey: string };
  addressHex: string;
  balance: () => Promise<number>;
}
