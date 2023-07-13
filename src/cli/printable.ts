import { Keys } from "../utils/Keys.js";

export const log = console.log;

export const boxedLog = (line: any) => {
  log("\n-------------------------------------------");
  log(line);
  log("-------------------------------------------\n");
};

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
  log(`Private Key: \n->${privKey} `);
  log(`Public Key (uncompressed): \n->${pubKey}`);
  log("-------------------------------------------\n");
};

export const printBalance = (
  balance: number,
  decimals: number,
  name: string
) => {
  log("\n-------------------------------------------");
  log(`Balance: ${balance} (${balance / Math.pow(10, decimals)} ${name})`);
  log("-------------------------------------------\n");
};
