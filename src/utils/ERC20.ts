import { checkTokenBalance } from "../api/contract/checkTokenBalance.api.js";
import { getParams } from "../api/params.js";
import { KeysETH } from "./KeysETH.js";

export class ERC20 {
  contractAddress: string;
  keys: KeysETH;

  constructor(contractAddress: string, keys: KeysETH) {
    this.contractAddress = contractAddress;
    this.keys = keys;
  }

  async balance() {
    const res = await checkTokenBalance(
      this.keys.addressHex,
      this.contractAddress,
      getParams(this.keys)
    );
    return res.results[0][0];
  }
}
