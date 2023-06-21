import https from "https";
import { HOST, TOKEN } from "../index.js";
import { TXCompleted, TXSigned } from "../../utils/Transaction.types.js";

export const sendTx = (
  txSigned: TXSigned,
  params: [string, string]
): Promise<TXCompleted> => {
  const toSend = JSON.stringify(txSigned);
  const options: https.RequestOptions = {
    ...HOST,
    path: `/v1/${params[0]}/${params[1]}/txs/send?token=${TOKEN}`,
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
      res.on("end", () => resolver(JSON.parse(data.toString())));
    });

    req.on("error", (err) => reject(`Request error: \n${err}`));
    req.write(toSend);
    req.end();
  });
};
