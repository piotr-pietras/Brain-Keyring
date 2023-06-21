import { log } from "../common/log.js";
import { Keys } from "../utils/Keys.js";

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

export const printKeys = (keys: Keys) => {
  const { privKey, pubKey } = keys.keysHex;
  log("\n-------------------------------------------");
  log(`| Private Key: \n| ${privKey} `);
  log(`| Public Key (uncompressed): \n| ${pubKey}`);
  log("-------------------------------------------\n");
};

export const printBalance = (balance: number) => {
  log("\n-------------------------------------------");
  log(`| Balance Key: ${balance} `);
  log("-------------------------------------------\n");
}
