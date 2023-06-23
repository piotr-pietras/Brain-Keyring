import { createTx } from "../api/transaction/createTx.api.js";
import { sendTx } from "../api/transaction/sendTx.api.js";
import {
  TXCompleted,
  TXSeed,
  TXSekeleton,
  TXSigned,
} from "./Transaction.types.js";
import { secp256k1 } from "@noble/curves/secp256k1";
import { Keys } from "./Keys.js";
import { getParams } from "../api/params.js";

export class Transaction {
  errors: string = "";
  keys: Keys;
  txSeed: TXSeed;
  txSekeleton: TXSekeleton;
  txSigned: TXSigned;
  txCompleted: TXCompleted;

  constructor(tx: TXSeed, keys: Keys) {
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
    this.errorCheck();
    return Promise.resolve();
  }

  async send() {
    this.txCompleted = await sendTx(this.txSigned, getParams(this.keys));
    this.errorCheck();
    return Promise.resolve();
  }

  async validateSkeleton() {
    const balance = await this.keys.balance();
    const { inputAddress, outputAddress, value } = this.txSeed;
    const { fees } = this.txSekeleton.tx;
    let outputs = this.txSekeleton.tx.outputs;

    const to = outputs.find(({ addresses }) =>
      addresses.find((v) => v === outputAddress)
    );
    outputs = outputs.filter((output) => output === to);
    const from = outputs.find(({ addresses }) =>
      addresses.find((v) => v === inputAddress)
    );
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
  }

  private errorCheck() {
    if (this.txSekeleton?.errors) {
      this.errors += JSON.stringify(this.txSekeleton.errors);
    }
    if (this.txSekeleton?.error) {
      this.errors += JSON.stringify(this.txSekeleton.error);
    }
    if (this.txCompleted?.errors) {
      this.errors += JSON.stringify(this.txCompleted.errors);
    }
    if (this.txCompleted?.error) {
      this.errors += JSON.stringify(this.txCompleted.error);
    }
    if (this.errors) throw `Response error:\n ${this.errors}`;
  }
}
