import { keccak_256 } from "@noble/hashes/sha3";
import { Blockchains, Net } from "../common/blockchain.types.js";
import { Keys } from "./Keys.js";
import { KeysCore } from "./KeysCore.js";
export class KeysETH extends KeysCore implements Keys {
  decimals = 18;
  blockchain = Blockchains.ETH;
  net: Net;

  constructor(phrase: string, net: Net) {
    super();
    this.net = net;
    this.privKey = this.phraseToPrivKey(phrase);
    this.pubKey = this.privKeyToPubKey(this.privKey);
    this.address = this.pubKeyToAddress(this.pubKey);
  }

  private pubKeyToAddress(pubKey: Uint8Array) {
    const droppedByte = pubKey.slice(1);
    const hashed = keccak_256(Buffer.from(droppedByte));
    const sliced = hashed.slice(hashed.length - 20);
    return Buffer.from(sliced).toString("hex");
  }
}
