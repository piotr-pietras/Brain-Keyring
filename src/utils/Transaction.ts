import { createTx } from "../api/transaction/createTx.api.js";
import { sendTx } from "../api/transaction/sendTx.api.js";
import { Net } from "../common/blockchain.types.js";
import {
  TXCompleted,
  TXSeed,
  TXSekeleton,
  TXSigned,
} from "./Transaction.types.js";
import { KeysBTC } from "./KeysBTC.js";
import { secp256k1 } from "@noble/curves/secp256k1";
import { checkBalance } from "../api/balance/checkBalance.api.js";

export class Transaction {
  net: Net;
  errors: string = "";
  txSeed: TXSeed;
  txSekeleton: TXSekeleton;
  txSigned: TXSigned;
  txCompleted: TXCompleted;

  constructor(tx: TXSeed, net: Net) {
    this.txSeed = tx;
    this.net = net;
  }

  sign(keys: KeysBTC) {
    const { privKey, pubKey } = keys.keysHex;
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

  async create(keys: KeysBTC) {
    this.txSekeleton = await createTx(this.txSeed, this.net);
    this.errorCheck();
    await this.validateSkeleton(keys);
    return Promise.resolve();
  }

  async send() {
    this.txCompleted = await sendTx(this.txSigned, this.net);
    this.errorCheck();
    return Promise.resolve();
  }

  private async validateSkeleton(keys: KeysBTC) {
    const { balance } = await checkBalance(keys.addressHex, keys.net);
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
