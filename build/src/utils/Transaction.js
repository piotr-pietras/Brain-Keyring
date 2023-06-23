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
import { getParams } from "../api/params.js";
export class Transaction {
    constructor(tx, keys) {
        this.errors = "";
        this.txSeed = tx;
        this.keys = keys;
    }
    sign() {
        const { privKey, pubKey } = this.keys.keysHex;
        const { tosign, tx } = this.txSekeleton;
        const pubkeys = [];
        const signatures = tosign.map((msg) => {
            pubkeys.push(pubKey);
            const signature = secp256k1.sign(msg, privKey);
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
            this.txSekeleton = yield createTx(this.txSeed, getParams(this.keys));
            this.errorCheck();
            return Promise.resolve();
        });
    }
    send() {
        return __awaiter(this, void 0, void 0, function* () {
            this.txCompleted = yield sendTx(this.txSigned, getParams(this.keys));
            this.errorCheck();
            return Promise.resolve();
        });
    }
    validateSkeleton() {
        return __awaiter(this, void 0, void 0, function* () {
            const balance = yield this.keys.balance();
            const { inputAddress, outputAddress, value } = this.txSeed;
            const { fees } = this.txSekeleton.tx;
            let outputs = this.txSekeleton.tx.outputs;
            const to = outputs.find(({ addresses }) => addresses.find((v) => v === outputAddress));
            outputs = outputs.filter((output) => output === to);
            const from = outputs.find(({ addresses }) => addresses.find((v) => v === inputAddress));
            outputs = outputs.filter((output) => output === from);
            [
                !outputs.length,
                !!to,
                to.addresses.length === 1,
                to.value === value,
                from ? from.addresses.length === 1 : true,
                from ? from.value === balance - value - fees : true,
            ].forEach((correct) => {
                if (!correct)
                    throw "TX skeleton received from Block Cypher seems invalid...";
            });
            return {
                balance,
                value,
                fees,
            };
        });
    }
    errorCheck() {
        var _a, _b, _c, _d;
        if ((_a = this.txSekeleton) === null || _a === void 0 ? void 0 : _a.errors) {
            this.errors += JSON.stringify(this.txSekeleton.errors);
        }
        if ((_b = this.txSekeleton) === null || _b === void 0 ? void 0 : _b.error) {
            this.errors += JSON.stringify(this.txSekeleton.error);
        }
        if ((_c = this.txCompleted) === null || _c === void 0 ? void 0 : _c.errors) {
            this.errors += JSON.stringify(this.txCompleted.errors);
        }
        if ((_d = this.txCompleted) === null || _d === void 0 ? void 0 : _d.error) {
            this.errors += JSON.stringify(this.txCompleted.error);
        }
        if (this.errors)
            throw `Response error:\n ${this.errors}`;
    }
}
