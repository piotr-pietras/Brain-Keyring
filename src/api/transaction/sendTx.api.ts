import https from "https";
import { HOST, NET, TOKEN } from "../index.js";
import { TXSigned } from "./Transaction.js";

export const sendTx = (txSigned: TXSigned): Promise<any> => {
  const toSend = JSON.stringify(txSigned);
  const options: https.RequestOptions = {
    ...HOST,
    path: `/v1/btc/${NET}/txs/send?token=${TOKEN}`,
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

    req.on("error", (err) => {
      console.log(err);
      reject("Error...");
    });
    req.write(toSend);
    req.end();
  });
};
