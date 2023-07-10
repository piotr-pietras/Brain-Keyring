import https from "https";
import { HOST, BLOCK_CYPHER_TOKEN } from "../index.js";
import { TXSeed, TXSekeleton } from "../../utils/Transaction.types.js";

export const createTx = (
  txSeed: TXSeed,
  params: [string, string]
): Promise<TXSekeleton | undefined> => {
  const formattedTx = JSON.stringify({
    inputs: [{ addresses: [txSeed.inputAddress] }],
    outputs: [{ addresses: [txSeed.outputAddress], value: txSeed.value }],
  });
  const options: https.RequestOptions = {
    ...HOST,
    path: `/v1/${params[0]}/${params[1]}/txs/new?token=${BLOCK_CYPHER_TOKEN}`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": formattedTx.length,
    },
  };
  return new Promise((resolver, reject) => {
    const req = https.request(options, (res) => {
      let data = Buffer.from([]);
      res.on("data", (chunk) => (data = Buffer.concat([data, chunk])));
      res.on("end", () => resolver(JSON.parse(data.toString())));
    });

    req.on("error", (err) => reject(`Request error: \n${err}`));
    req.write(formattedTx);
    req.end();
  });
};
