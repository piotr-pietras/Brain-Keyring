import { createTx } from "../api/transaction/createTx.api.js";
import { sendTx } from "../api/transaction/sendTx.api.js";
import { Net } from "../common/blockchain.types.js";
import {
  TXCompleted,
  TXSeed,
  TXSekeleton,
  TXSigned,
} from "../common/transaction.types.js";
import { Keys } from "./Keys.js";
import { secp256k1 } from "@noble/curves/secp256k1";

export class Transaction {
  netParam: string;
  errors?: string;
  txSeed: TXSeed;
  txSekeleton: TXSekeleton;
  txSigned: TXSigned;
  txCompleted: TXCompleted;

  constructor(tx: TXSeed, net: Net) {
    this.txSeed = tx;
    this.netParam = net === "MAIN_NET" ? "main" : "test3";
  }

  async create() {
    if (this.txSekeleton) throw "Tx already created...";
    this.txSekeleton = await createTx(this.txSeed, this.netParam);
    if (this.txSekeleton.errors) {
      this.errors = JSON.stringify(this.txSekeleton.errors);
      throw `BlockCypher api error: \n ${this.errors} ...`;
    }
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
    this.txCompleted = await sendTx(this.txSigned, this.netParam);
    if (this.txCompleted.errors) {
      this.errors = JSON.stringify(this.txCompleted.errors);
      throw `BlockCypher api error: \n ${this.errors} ...`;
    }
    return Promise.resolve();
  }
}
