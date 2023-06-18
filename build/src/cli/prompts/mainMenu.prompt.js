import inq from "inquirer";
import { promptLoginToWallet } from "./loginToWallet.prompt.js";
import { printWelcome } from "../printable.js";
var Choices;
(function (Choices) {
    Choices["LOGIN"] = "Login to a wallet";
    Choices["EXIT"] = "Exit";
})(Choices || (Choices = {}));
export const promptMainMenu = (context) => {
    console.clear();
    printWelcome();
    inq
        .prompt([
        {
            name: "menu",
            message: "What do you want to do?",
            type: "list",
            choices: Object.values(Choices),
        },
    ])
        .then(({ menu }) => {
        switch (menu) {
            case Choices.EXIT:
                break;
            case Choices.LOGIN:
                promptLoginToWallet(context);
                break;
        }
    });
};
