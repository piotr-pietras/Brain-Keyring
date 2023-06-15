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
  net: Net;
  errors?: string;
  txSeed: TXSeed;
  txSekeleton: TXSekeleton;
  txSigned: TXSigned;
  txCompleted: TXCompleted;

  constructor(tx: TXSeed, net: Net) {
    this.txSeed = tx;
    this.net = net;
  }

  async create() {
    this.txSekeleton = await createTx(this.txSeed, this.net);
    if (this.txSekeleton.errors) {
      this.errors = JSON.stringify(this.txSekeleton.errors);
      throw `Block Cypher responses with error:\n${this.errors}`;
    }

    return Promise.resolve();
  }

  sign(keys: Keys) {
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
    this.txCompleted = await sendTx(this.txSigned, this.net);
    if (this.txCompleted.errors) {
      this.errors = JSON.stringify(this.txCompleted.errors);
      throw `Block Cypher responses with error:\n ${this.errors}`;
    }

    return Promise.resolve();
  }
}
