var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { sha256 } from "@noble/hashes/sha256";
import { secp256k1 } from "@noble/curves/secp256k1";
import { keccak_256 } from "@noble/hashes/sha3";
import { Blockchains } from "../common/blockchain.types.js";
import { checkBalance } from "../api/balance/checkBalance.api.js";
import { getParams } from "../cli/params.js";
export class KeysETH {
    constructor(phrase, net) {
        this.blockchain = Blockchains.ETH;
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
    balance() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield checkBalance(this.addressHex, getParams(this));
            return res.balance;
        });
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
