import { getInitContext } from "./cli/context.js";
import { promptMainMenu } from "./cli/prompts/mainMenu.prompt.js";
import { Net } from "./common/blockchain.types.js";
import { KeysETH } from "./utils/KeysETH.js";

console.clear();
// promptMainMenu(getInitContext());
const a = new KeysETH("test", Net.TEST3);
console.log(a.keysHex);
console.log(a.addressHex);
