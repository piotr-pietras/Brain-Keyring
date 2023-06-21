import { Blockchains, Net } from "../common/blockchain.types.js";

export class Keys {
  chain: Blockchains;
  net: Net;
  keysHex: { privKey: string; pubKey: string };
  addressHex: string;
}
