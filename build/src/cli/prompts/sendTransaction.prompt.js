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
import { boxedLog, printTransactionInfo, printWelcome } from "../printable.js";
import { promptWalletMenu } from "./walletMenu.prompt.js";
export const promptSendTransaction = (context) => __awaiter(void 0, void 0, void 0, function* () {
    console.clear();
    printWelcome();
    try {
        const { transaction } = context.wallet;
        const validatedInfo = yield transaction.validateSkeleton();
        printTransactionInfo(validatedInfo);
        inq
            .prompt([
            {
                name: "confirm",
                message: "Are you sure to sign this transaction?",
                type: "confirm",
            },
        ])
            .then(({ confirm }) => __awaiter(void 0, void 0, void 0, function* () {
            if (confirm) {
                try {
                    context.wallet.transaction.sign();
                    yield context.wallet.transaction.send();
                }
                catch (err) {
                    promptWalletMenu(context, () => boxedLog(err));
                }
                promptWalletMenu(context, () => boxedLog("Transaction signed!"));
            }
            else {
                promptWalletMenu(context, () => boxedLog("Transaction canceled"));
            }
        }));
    }
    catch (err) {
        promptWalletMenu(context, () => boxedLog(err));
    }
});
