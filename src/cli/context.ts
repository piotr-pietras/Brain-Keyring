import { Keys } from "../utils/Keys.js";

export type Context = {
  wallet?: {
    keys: Keys;
  };
};

export const getInitContext = (): Context => ({});
