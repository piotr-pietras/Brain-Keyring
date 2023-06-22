import { log } from "../common/log.js";
export const boxedLog = (line) => {
    log("\n-------------------------------------------");
    log(`${line} `);
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
export const printKeys = (keys) => {
    const { privKey, pubKey } = keys.keysHex;
    log("\n-------------------------------------------");
    log(`Private Key: \n->${privKey} `);
    log(`Public Key (uncompressed): \n->${pubKey}`);
    log("-------------------------------------------\n");
};
export const printBalance = (balance) => {
    log("\n-------------------------------------------");
    log(`Balance Key: ${balance} `);
    log("-------------------------------------------\n");
};
export const printTransactionInfo = (info) => {
    const { balance, value, fees } = info;
    log("Your TX object was created successfully!");
    log("Check address, value and fees TWICE!");
    log("-------------------------------------------");
    log(`Current balance: \n->${balance}`);
    log(`Output: \n->${value}`);
    log(`Fees: \n->${fees}`);
    log(`Balance after transaction: \n->${balance - value - fees}`);
    log("-------------------------------------------");
};
