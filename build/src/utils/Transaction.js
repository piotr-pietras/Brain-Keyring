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
import { checkBalance } from "../api/balance/checkBalance.api.js";
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
            this.txSekeleton = yield createTx(this.txSeed, this.keys.net);
            this.errorCheck();
            return Promise.resolve();
        });
    }
    send() {
        return __awaiter(this, void 0, void 0, function* () {
            this.txCompleted = yield sendTx(this.txSigned, this.keys.net);
            this.errorCheck();
            return Promise.resolve();
        });
    }
    validateSkeleton() {
        return __awaiter(this, void 0, void 0, function* () {
            const { balance } = yield checkBalance(this.keys.addressHex, this.keys.net);
            const { inputAddress, outputAddress, value } = this.txSeed;
            const { addresses, fees, outputs } = this.txSekeleton.tx;
            const to = outputs.find(({ addresses }) => addresses[0] === outputAddress);
            const back = outputs.find(({ addresses }) => addresses[0] === inputAddress);
            [
                addresses.length === 2,
                !!addresses.find((v) => v === inputAddress),
                !!addresses.find((v) => v === outputAddress),
                !!to,
                !!back,
                to.value === value,
                back.value === balance - value - fees,
            ].forEach((correct) => {
                if (!correct)
                    throw "TX skeletotn received from Block Cypher seems invalid...";
            });
            return {
                balance,
                value,
                fees,
            };
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
        if (this.errors)
            throw `Block Cypher responses with error:\n ${this.errors}`;
    }
}
