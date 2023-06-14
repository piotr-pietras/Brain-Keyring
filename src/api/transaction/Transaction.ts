import { getSignature } from "../../crypto/signature.js";
import { createTx } from "./createTx.api.js";
import { sendTx } from "./sendTx.api.js";

export interface TXSeed {
  inputAddress: string;
  outputAddress: string;
  value: number;
}

export interface TXSekeleton {
  tx: unknown;
  tosign: string[];
}

export interface TXSigned extends TXSekeleton {
  pubkeys: string[];
  signatures: string[];
}

export class Transaction {
  txSeed: TXSeed;
  txSekeleton: TXSekeleton;
  txSigned: TXSigned;

  constructor(tx: TXSeed) {
    this.txSeed = tx;
  }

  async create() {
    this.txSekeleton = await createTx(this.txSeed);
    return Promise.resolve();
  }

  sign(pubKey: Uint8Array, privKey: Uint8Array) {
    if (!this.txSekeleton.tosign.length) throw "Nothing to sign...";

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

  async send() {
    await sendTx(this.txSigned);
    return Promise.resolve();
  }
}
