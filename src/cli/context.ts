import { Keys } from "../utils/Keys.js";
import { Transaction } from "../utils/Transaction.js";

export type Context = {
  wallet?: {
    keys: Keys;
    transaction?: Transaction;
  };
};

export const getInitContext = (): Context => ({});
