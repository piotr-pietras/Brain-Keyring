import { sha256 } from "@noble/hashes/sha256";
import { secp256k1 } from "@noble/curves/secp256k1";
import bs58 from "bs58";
import ripemd160 from "ripemd160";
import { Blockchains, Net } from "../common/blockchain.types.js";
import { Keys } from "./Keys.js";
import { checkBalance } from "../api/balance/checkBalance.api.js";
import { getParams } from "../cli/params.js";

const ADR_MAIN_NET_PREFIX = "00";
const ADR_TEST_NET_PREFIX = "6F";

export class KeysBTC implements Keys {
  blockchain = Blockchains.BTC;
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
    const prefix =
      this.net === Net.MAIN ? ADR_MAIN_NET_PREFIX : ADR_TEST_NET_PREFIX;
    const base = sha256(Buffer.from(pubKey));

    const ripemd = new ripemd160().update(Buffer.from(base)).digest();
    const ripemdPrefixed = Buffer.concat([Buffer.from(prefix, "hex"), ripemd]);

    const checksum = Buffer.from(sha256(sha256(ripemdPrefixed)).slice(0, 4));
    const ripemdChecksum = Buffer.concat([ripemdPrefixed, checksum]);

    return bs58.encode(ripemdChecksum);
  }

  async balance() {
    const res = await checkBalance(this.addressHex, getParams(this));
    return res.balance;
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
