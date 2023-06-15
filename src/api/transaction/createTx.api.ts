import https from "https";
import { HOST, NET, TOKEN } from "../index.js";
import { TXSeed, TXSekeleton } from "../../types.js";

export const createTx = (txSeed: TXSeed): Promise<TXSekeleton | undefined> => {
  const formattedTx = JSON.stringify({
    inputs: [{ addresses: [txSeed.inputAddress] }],
    outputs: [{ addresses: [txSeed.outputAddress], value: txSeed.value }],
  });
  const options: https.RequestOptions = {
    ...HOST,
    path: `/v1/btc/${NET}/txs/new?token=${TOKEN}`,
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

    req.on("error", (err) => {
      console.log(err);
      reject("Error...");
    });
    req.write(formattedTx);
    req.end();
  });
};
