import { Blockchains, Net } from "../common/blockchain.types.js";
import { Keys } from "../utils/Keys.js";
import { Transaction } from "../utils/Transaction.js";

export type Context = {
  wallet?: {
    blockchain: Blockchains;
    keys: Keys;
    net: Net;
    transaction?: Transaction;
  };
};

export const getInitContext = (): Context => ({});
