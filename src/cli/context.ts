import { Blockchains, Net } from "../common/blockchain.types.js";
import { Keys } from "../utils/Keys.js";
import { Transaction } from "../utils/Transaction.js";

export type Context = {
  [key in Blockchains]: { keys?: Keys; net: Net; transactions: Transaction[] };
};

export const getInitContext = (): Context => ({
  "btc-main": {
    transactions: [],
    net: "MAIN_NET",
  },
  "btc-test": {
    transactions: [],
    net: "TEST_NET",
  },
});
