import { getInitContext } from "./cli/context.js";
import { promptMainMenu } from "./cli/prompts/mainMenu.prompt.js";
console.log("CRYPTO-KEYRING" + "\n");
promptMainMenu(getInitContext());
