import { createTx } from "../api/transaction/createTx.api.js";
import { sendTx } from "../api/transaction/sendTx.api.js";
import { TXCompleted, TXSeed, TXSekeleton, TXSigned } from "../types.js";
import { Keys } from "./Keys.js";
import { secp256k1 } from "@noble/curves/secp256k1";

export class Transaction {
  txSeed: TXSeed;
  txSekeleton: TXSekeleton;
  txSigned: TXSigned;
  txCompleted: TXCompleted;

  constructor(tx: TXSeed) {
    this.txSeed = tx;
  }

  async create() {
    if (this.txSekeleton) throw "Tx already created...";
    this.txSekeleton = await createTx(this.txSeed);
    if (this.txSekeleton.errors) throw "Errors occured...";
    return Promise.resolve();
  }

  sign(keys: Keys) {
    if (!this.txSekeleton) throw "Tx skeleton does not exist...";
    if (!this.txSekeleton.tosign) throw "Nothing to sign...";
    if (this.txSigned) throw "Tx were already signed...";
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

  async send() {
    if (!this.txSigned) throw "Tx is not signed...";
    if (this.txCompleted) throw "Tx already performed...";
    this.txCompleted = await sendTx(this.txSigned);
    if (this.txCompleted.errors) throw "Errors occured...";
    return Promise.resolve();
  }
}
