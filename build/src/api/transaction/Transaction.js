var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getSignature } from "../../crypto/signature.js";
import { createTx } from "./createTx.api.js";
import { sendTx } from "./sendTx.api.js";
export class Transaction {
    constructor(tx) {
        this.txSeed = tx;
    }
    create() {
        return __awaiter(this, void 0, void 0, function* () {
            this.txSekeleton = yield createTx(this.txSeed);
            return Promise.resolve();
        });
    }
    sign(pubKey, privKey) {
        if (!this.txSekeleton.tosign.length)
            throw "Nothing to sign...";
        const { tosign, tx } = this.txSekeleton;
        const pubkeys = [];
        const signatures = tosign.map((msg) => {
            pubkeys.push(Buffer.from(pubKey).toString("hex"));
            return getSignature(msg, privKey).toDERHex();
        });
        const signed = {
            tx,
            tosign,
            pubkeys,
            signatures,
        };
        this.txSigned = signed;
    }
    send() {
        return __awaiter(this, void 0, void 0, function* () {
            yield sendTx(this.txSigned);
            return Promise.resolve();
        });
    }
}
