import { createTx } from "../api/transaction/createTx.api.js";
import { sendTx } from "../api/transaction/sendTx.api.js";
import {
  TXCompleted,
  TXSeed,
  TXSekeleton,
  TXSigned,
} from "./Transaction.types.js";
import { secp256k1 } from "@noble/curves/secp256k1";
import { checkBalance } from "../api/balance/checkBalance.api.js";
import { Keys } from "./Keys.js";

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
    this.txSekeleton = await createTx(this.txSeed, this.keys.net);
    this.errorCheck();
    return Promise.resolve();
  }

  async send() {
    this.txCompleted = await sendTx(this.txSigned, this.keys.net);
    this.errorCheck();
    return Promise.resolve();
  }

  async validateSkeleton() {
    const { balance } = await checkBalance(this.keys.addressHex, this.keys.net);
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
  }

  private errorCheck() {
    if (this.txSekeleton?.errors) {
      this.errors += JSON.stringify(this.txSekeleton.errors);
    }
    if (this.txCompleted?.errors) {
      this.errors += JSON.stringify(this.txCompleted.errors);
    }
    if (this.errors)
      throw `Block Cypher responses with error:\n ${this.errors}`;
  }
}
