import inq from "inquirer";
import { Net } from "../../common/blockchain.types.js";
import { KeysBTC } from "../../utils/KeysBTC.js";
import { promptWalletMenu } from "./walletMenu.prompt.js";
import { printWelcome } from "../printable.js";
import { KeysETH } from "../../utils/KeysETH.js";
var ChoicesBlockchain;
(function (ChoicesBlockchain) {
    ChoicesBlockchain["BTC"] = "btc";
    ChoicesBlockchain["ETH"] = "eth";
})(ChoicesBlockchain || (ChoicesBlockchain = {}));
var ChoicesNet;
(function (ChoicesNet) {
    ChoicesNet["MAIN"] = "main";
    ChoicesNet["TEST"] = "test";
})(ChoicesNet || (ChoicesNet = {}));
export const promptLoginToWallet = (context) => {
    console.clear();
    printWelcome();
    inq
        .prompt([
        {
            name: "blockchain",
            message: "Login to a wallet: \n1)Choose blockchain wallet",
            type: "list",
            choices: Object.values(ChoicesBlockchain),
        },
        {
            name: "net",
            message: "2)Choose net",
            type: "list",
            choices: Object.values(ChoicesNet),
        },
        {
            name: "phrase",
            message: "3)Type phrases",
            type: "input",
        },
    ])
        .then(({ blockchain, net, phrase }) => {
        switch (blockchain) {
            case ChoicesBlockchain.BTC:
                switch (net) {
                    case ChoicesNet.MAIN:
                        context.wallet = {
                            keys: new KeysBTC(phrase, Net.MAIN),
                        };
                        break;
                    case ChoicesNet.TEST:
                        context.wallet = {
                            keys: new KeysBTC(phrase, Net.TEST),
                        };
                        break;
                }
                break;
            case ChoicesBlockchain.ETH:
                switch (net) {
                    case ChoicesNet.MAIN:
                        context.wallet = {
                            keys: new KeysETH(phrase, Net.MAIN),
                        };
                        break;
                    case ChoicesNet.TEST:
                        context.wallet = {
                            keys: new KeysETH(phrase, Net.TEST),
                        };
                        break;
                }
                break;
        }
        promptWalletMenu(context);
    });
};
