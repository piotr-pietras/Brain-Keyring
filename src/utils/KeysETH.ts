import { sha256 } from "@noble/hashes/sha256";
import { secp256k1 } from "@noble/curves/secp256k1";
import { keccak_256 } from "@noble/hashes/sha3";
import { Blockchains, Net } from "../common/blockchain.types.js";
import { Keys } from "./Keys.js";
import { getParams } from "../api/params.js";
import { getListOfBalances } from "../api/accounts/getListOfBalances.js";

export class KeysETH implements Keys {
  blockchain = Blockchains.ETH;
  net: Net;
  private privKey: Uint8Array;
  private pubKey: Uint8Array;
  private address: string;

  constructor(phrase: string, net: Net) {
    this.net = net;
    this.privKey = this.phraseToPrivKey(phrase);
    this.pubKey = this.privKeyToPubKey(this.privKey);
    this.address = this.pubKeyToAddress(this.pubKey);
  }

  private phraseToPrivKey(phrase: string) {
    return sha256(phrase);
  }

  private privKeyToPubKey(privKey: Uint8Array) {
    return secp256k1.getPublicKey(privKey, false);
  }

  private pubKeyToAddress(pubKey: Uint8Array) {
    const droppedByte = pubKey.slice(1);
    const hashed = keccak_256(Buffer.from(droppedByte));
    const sliced = hashed.slice(hashed.length - 20);
    return Buffer.from(sliced).toString("hex");
  }

  async balance() {
    const res = await getListOfBalances(this.addressHex, getParams(this));
    if (res.length) return res[0].confirmed_balance;
    return 0;
  }

  get keysHex() {
    return {
      privKey: Buffer.from(this.privKey).toString("hex"),
      pubKey: Buffer.from(this.pubKey).toString("hex"),
    };
  }

  get addressHex() {
    return this.address;
  }
}
