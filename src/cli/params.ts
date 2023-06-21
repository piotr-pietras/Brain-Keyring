import { Blockchains, Net } from "../common/blockchain.types.js";
import { Keys } from "../utils/Keys.js";

const params: { [key in Blockchains]: { [key in Net]: [string, string] } } = {
  btc: {
    main: ["btc", "main"],
    test: ["btc", "test3"],
  },
  eth: {
    main: ["eth", "main"],
    test: ["beth", "test"],
  },
};

export const getParams = (keys: Keys) => {
  return params[keys.blockchain][keys.net];
};
