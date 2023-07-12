import { createTx } from "../api/transaction/createTx.api.js";
import { sendTx } from "../api/transaction/sendTx.api.js";
import {
  TxCompleted,
  TxSeed,
  TxSekeleton,
  TxSigned,
} from "./Transaction.types.js";
import { secp256k1 } from "@noble/curves/secp256k1";
import { Keys } from "./Keys.js";
import { getParams } from "../api/params.js";

export class Transaction {
  errors: string = "";
  keys: Keys;
  txSeed: TxSeed;
  txSekeleton: TxSekeleton;
  txSigned: TxSigned;
  txCompleted: TxCompleted;

  constructor(tx: TxSeed, keys: Keys) {
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

  async create() {
    this.txSekeleton = await createTx(this.txSeed, getParams(this.keys));
    return Promise.resolve();
  }

  async send() {
    this.txCompleted = await sendTx(this.txSigned, getParams(this.keys));
    return Promise.resolve();
  }
}
