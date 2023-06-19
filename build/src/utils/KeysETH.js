import { sha256 } from "@noble/hashes/sha256";
import { secp256k1 } from "@noble/curves/secp256k1";
import { keccak_256 } from "@noble/hashes/sha3";
export class KeysETH {
    constructor(phrase, net) {
        this.net = net;
        this.privKey = this.phraseToPrivKey(phrase);
        this.pubKey = this.privKeyToPubKey(this.privKey);
        this.address = this.pubKeyToAddress(this.pubKey);
    }
    phraseToPrivKey(phrase) {
        return sha256(phrase);
    }
    privKeyToPubKey(privKey) {
        return secp256k1.getPublicKey(privKey, false);
    }
    pubKeyToAddress(pubKey) {
        const droppedByte = pubKey.slice(1);
        const hashed = keccak_256(Buffer.from(droppedByte));
        const sliced = hashed.slice(hashed.length - 20);
        return "0x" + Buffer.from(sliced).toString("hex");
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
