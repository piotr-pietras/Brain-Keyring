import inq from "inquirer";
import { Context } from "../context.js";
import { promptChooseBlockchain } from "./chooseBlockchain.prompt.js";

enum Choices {
  LOGIN = "login",
  EXIT = "exit",
}

export const promptMainMenu = (context: Context) => {
  inq
    .prompt<{ MainMenu: Choices }>([
      { name: "MainMenu", type: "list", choices: Object.values(Choices) },
    ])
    .then((a) => {
      switch (a.MainMenu) {
        case Choices.EXIT:
          break;
        case Choices.LOGIN:
          console.log('login')
          promptChooseBlockchain(context);
          break;
      }
    });
};
