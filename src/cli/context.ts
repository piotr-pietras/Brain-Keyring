import { ERC20 } from "../utils/ERC20.js";
import { Keys } from "../utils/Keys.js";
import { Transaction } from "../utils/Transaction.js";

export type Context = {
  wallet?: {
    keys: Keys;
    transaction?: Transaction;
    erc20?: ERC20;
  };
};

export const getInitContext = (): Context => ({});
