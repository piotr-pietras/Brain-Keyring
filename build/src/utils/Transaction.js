var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { createTx } from "../api/transaction/createTx.api.js";
import { sendTx } from "../api/transaction/sendTx.api.js";
import { secp256k1 } from "@noble/curves/secp256k1";
export class Transaction {
    constructor(tx, net) {
        this.errors = "";
        this.txSeed = tx;
        this.net = net;
    }
    sign(keys) {
        const { privKey, pubKey } = keys;
        const { tosign, tx } = this.txSekeleton;
        const pubkeys = [];
        const signatures = tosign.map((msg) => {
            const pubKeyHex = Buffer.from(pubKey).toString("hex");
            const privKeyHex = Buffer.from(privKey).toString("hex");
            pubkeys.push(pubKeyHex);
            const signature = secp256k1.sign(msg, privKeyHex);
            return signature.toDERHex();
        });
        this.txSigned = {
            tx,
            tosign,
            pubkeys,
            signatures,
        };
    }
    create() {
        return __awaiter(this, void 0, void 0, function* () {
            this.txSekeleton = yield createTx(this.txSeed, this.net);
            this.errorCheck();
            return Promise.resolve();
        });
    }
    send() {
        return __awaiter(this, void 0, void 0, function* () {
            this.txCompleted = yield sendTx(this.txSigned, this.net);
            this.errorCheck();
            return Promise.resolve();
        });
    }
    errorCheck() {
        var _a, _b;
        if ((_a = this.txSekeleton) === null || _a === void 0 ? void 0 : _a.errors) {
            this.errors += JSON.stringify(this.txSekeleton.errors);
        }
        if ((_b = this.txCompleted) === null || _b === void 0 ? void 0 : _b.errors) {
            this.errors += JSON.stringify(this.txCompleted.errors);
        }
        throw `Block Cypher responses with error:\n ${this.errors}`;
    }
}
