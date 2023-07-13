import { getCurrentBlockNumber } from "../api/blocks/getCurrentBlockNumber.js";
import { getParams } from "../api/params.js";
import { createUnsignedTx } from "../api/transactions/createUnsignedTransaction.js";
import { getListOfTransactions } from "../api/transactions/getListOfTransactions.js";
import { Net } from "../common/blockchain.types.js";
import { Keys } from "./Keys.js";
import btc, { networks } from "bitcoinjs-lib";

interface TxSeed {
  destination: string;
  amount: number;
}
interface UTXO {
  id: string;
  index: number;
  amount: number;
}

export class Transaction {
  errors: string = "";
  keys: Keys;
  txSeed: TxSeed;

  constructor(tx: TxSeed, keys: Keys) {
    this.txSeed = tx;
    this.keys = keys;
  }

  private async findUtxos() {
    let utxo: UTXO | undefined;
    let pageToken;

    while (!utxo) {
      const currentBlock = await getCurrentBlockNumber(getParams(this.keys));
      const list = await getListOfTransactions(getParams(this.keys), pageToken);
      pageToken = list.meta.paging.next_page_token;
      for (const data of list.data) {
        for (const { type, meta, amount, transaction_id } of data.events) {
          if (
            type === "utxo_output" &&
            meta.script_type === "pubkeyhash" &&
            amount > this.txSeed.amount
          ) {
            utxo = { id: transaction_id, index: meta.index, amount };
            break;
          }
        }

        if (utxo) break;
        if (data.block_number < currentBlock)
          throw "No valid utxos for current block";
      }
    }
    return utxo;
  }

  async build() {
    const utxo = await this.findUtxos();
    const { net, keysHex } = this.keys;
    const network = net === Net.MAIN ? networks.bitcoin : networks.testnet;
    console.log(network);
    const builder = new btc.TransactionBuilder(network);

    builder.addInput(utxo.id, utxo.index);

    const script = btc.address.toOutputScript(this.txSeed.destination, network);
    builder.addOutput(script, this.txSeed.amount);

    const privKey = btc.ECPair.fromPrivateKey(
      Buffer.from(keysHex.privKey, "hex")
    );
    builder.sign(0, privKey);

    return builder.build().toHex();
    // const { unsigned_tx } = await createUnsignedTx(
    //   { to: [this.txSeed], from: utxo.id, index: utxo.index },
    //   getParams(this.keys)
    // );

    // const tx = btc.Transaction.fromHex(unsigned_tx);
    // console.log(tx);
    // const builder = btc.TransactionBuilder.fromTransaction(tx);
    // console.log(builder);
    // tx.ins.forEach((_, i) => {
    //   const { privKey } = this.keys.keysHex;
    //   builder.sign(i, btc.ECPair.fromPrivateKey(Buffer.from(privKey, "hex")));
    // });

    // return builder.build().toHex();
  }
}
