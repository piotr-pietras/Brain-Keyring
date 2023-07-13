import { sha256 } from "@noble/hashes/sha256";
import { secp256k1 } from "@noble/curves/secp256k1";

export class KeysCore {
  protected privKey: Uint8Array;
  protected pubKey: Uint8Array;
  protected address: string;

  protected phraseToPrivKey(phrase: string) {
    return sha256(phrase);
  }

  protected privKeyToPubKey(privKey: Uint8Array) {
    return secp256k1.getPublicKey(privKey, false);
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
