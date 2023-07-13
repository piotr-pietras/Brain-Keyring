import { sha256 } from "@noble/hashes/sha256";
import bs58 from "bs58";
import ripemd160 from "ripemd160";
import { Blockchains, Net } from "../common/blockchain.types.js";
import { Keys } from "./Keys.js";
import { KeysCore } from "./KeysCore.js";

const ADR_MAIN_NET_PREFIX = "00";
const ADR_TEST_NET_PREFIX = "6F";

export class KeysBTC extends KeysCore implements Keys {
  decimals = 8;
  blockchain = Blockchains.BTC;
  net: Net;

  constructor(phrase: string, net: Net) {
    super();
    this.net = net;
    this.privKey = this.phraseToPrivKey(phrase);
    this.pubKey = this.privKeyToPubKey(this.privKey);
    this.address = this.pubKeyToAddress(this.pubKey);
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
}
