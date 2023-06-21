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
import bs58 from "bs58";
import ripemd160 from "ripemd160";
import { Blockchains, Net } from "../common/blockchain.types.js";
import { checkBalance } from "../api/balance/checkBalance.api.js";
import { getParams } from "../cli/params.js";
const ADR_MAIN_NET_PREFIX = "00";
const ADR_TEST_NET_PREFIX = "6F";
export class KeysBTC {
    constructor(phrase, net) {
        this.blockchain = Blockchains.BTC;
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
        const prefix = this.net === Net.MAIN ? ADR_MAIN_NET_PREFIX : ADR_TEST_NET_PREFIX;
        const base = sha256(Buffer.from(pubKey));
        const ripemd = new ripemd160().update(Buffer.from(base)).digest();
        const ripemdPrefixed = Buffer.concat([Buffer.from(prefix, "hex"), ripemd]);
        const checksum = Buffer.from(sha256(sha256(ripemdPrefixed)).slice(0, 4));
        const ripemdChecksum = Buffer.concat([ripemdPrefixed, checksum]);
        return bs58.encode(ripemdChecksum);
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
