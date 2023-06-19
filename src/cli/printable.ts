import { log } from "../common/log.js";
import { KeysBTC } from "../utils/KeysBTC.js";

export const printWelcome = () => {
  log("Welcome to TinyBrainWallet");
  log(`
    /\\_____/\\
   /  o   o  \\
  ( ==  ^  == )
   )         (
  (           )
 ( (  )   (  ) )
(__(__)___(__)__)`);
  log("");
};

export const printKeys = (keys: KeysBTC) => {
  const { privKey, pubKey } = keys.keysHex;
  log("\n-------------------------------------------");
  log(`| Private Key: \n| ${privKey} `);
  log(`| Public Key (uncompressed): \n| ${pubKey}`);
  log("-------------------------------------------\n");
};
