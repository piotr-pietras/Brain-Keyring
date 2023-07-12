import { TxSeed, TxUnsigned, UTXO } from "./Transaction.types.js";
import { secp256k1 } from "@noble/curves/secp256k1";
import { Keys } from "./Keys.js";
import { getListOfTransactions } from "../api/transactions/getListOfTransactions.js";
import { getParams } from "../api/params.js";
import { createUnsignedTransaction } from "../api/transactions/createUnsignedTransaction.js";
import { sendTransaction } from "../api/transactions/sendTransaction.js";

export class Transaction {
  errors: string = "";
  keys: Keys;
  txSeed: TxSeed;
  txUsigned: TxUnsigned;
  txSigned: any;

  constructor(tx: TxSeed, keys: Keys) {
    this.txSeed = tx;
    this.keys = keys;
  }

  private async findUtxo() {
    const list = await getListOfTransactions(getParams(this.keys));
    let utxo: UTXO = { id: "", index: -1, amount: 0 };
    list.data.forEach(({ events }) =>
      events.forEach(({ amount, transaction_id, type, meta, decimals }) => {
        if (utxo.id) return;
        if (
          type === "utxo_output" &&
          meta.script_type === "pubkeyhash" &&
          amount / Math.pow(10, decimals) > parseInt(this.txSeed.amount)
        ) {
          utxo = { id: transaction_id, index: meta.index, amount };
        }
      })
    );
    return utxo;
  }

  async create() {
    const utxo = await this.findUtxo();
    this.txUsigned = await createUnsignedTransaction(
      this.txSeed,
      utxo,
      getParams(this.keys)
    );
    return this.txUsigned;
  }

  async sign() {
    // const signature = secp256k1.sign(msg, privKey);
    // return signature.toDERHex();
  }
  //mpyWAWGZEWycXSK7ofgDtFEoYQkWV4hb6S
  async send() {
    const { privKey } = this.keys.keysHex;
    console.log(await this.findUtxo());
    const signature = secp256k1
      .sign(this.txUsigned.unsigned_tx, privKey)
      .toDERHex();
    const tx = this.txUsigned.unsigned_tx;
    console.log(tx);
    console.log(signature);
    this.txSigned = await sendTransaction(tx, getParams(this.keys));
    return this.txSigned;
  }
}
