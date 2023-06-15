import inq from "inquirer";
import { promptChooseBlockchain } from "./chooseBlockchain.prompt.js";
import { printWelcome } from "../welcoming.js";
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
                promptChooseBlockchain(context);
                break;
        }
    });
};
