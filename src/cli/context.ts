import { Blockchains, Net } from "../common/blockchain.types.js";
import { KeysBTC } from "../utils/KeysBTC.js";
import { Transaction } from "../utils/Transaction.js";

export type Context = {
  wallet?: {
    blockchain: Blockchains;
    keys: KeysBTC;
    net: Net;
    transaction?: Transaction;
  };
};

export const getInitContext = (): Context => ({});
