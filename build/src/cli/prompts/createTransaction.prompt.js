var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import inq from "inquirer";
import { printWelcome } from "../printable.js";
import { Transaction } from "../../utils/Transaction.js";
import { promptSendTransaction } from "./sendTransaction.prompt.js";
import { log } from "../../common/log.js";
import { promptWalletMenu } from "./walletMenu.prompt.js";
export const createTransaction = (context) => {
    console.clear();
    printWelcome();
    inq
        .prompt([
        {
            name: "output",
            message: "Creating transaction \n1)Paste your output address",
            type: "input",
        },
        {
            name: "value",
            message: "How much do you want to send (in satoshi)",
            type: "input",
        },
    ])
        .then(({ output, value }) => __awaiter(void 0, void 0, void 0, function* () {
        log("Please wait... Block Cypher creates for you TX object to sign.");
        const { keys } = context.wallet;
        const txSeed = {
            inputAddress: keys.addressHex,
            outputAddress: output,
            value: parseInt(value),
        };
        const transaction = new Transaction(txSeed, keys);
        try {
            yield transaction.create();
            context.wallet.transaction = transaction;
            promptSendTransaction(context);
        }
        catch (err) {
            promptWalletMenu(context, () => log(err));
        }
    }));
};
