import https from "https";
import { HOST, BLOCK_CYPHER_TOKEN } from "../index.js";
import { TxCompleted, TxSigned } from "../../utils/Transaction.types.js";

export const sendTx = (
  txSigned: TxSigned,
  params: [string, string]
): Promise<TxCompleted> => {
  const toSend = JSON.stringify(txSigned);
  const options: https.RequestOptions = {
    ...HOST,
    path: `/v1/${params[0]}/${params[1]}/txs/send?token=${BLOCK_CYPHER_TOKEN}`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": toSend.length,
    },
  };
  return new Promise((resolver, reject) => {
    const req = https.request(options, (res) => {
      let data = Buffer.from([]);
      res.on("data", (chunk) => (data = Buffer.concat([data, chunk])));
      res.on("end", () => {
        const json = JSON.parse(data.toString())
        if(json?.error) reject(json.error)
        if(json?.errors) reject(json.errors)
        resolver(json);
      });
    });

    req.on("error", (err) => reject(`Request error: \n${err}`));
    req.write(toSend);
    req.end();
  });
};
