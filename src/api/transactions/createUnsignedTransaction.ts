import https from "https";
import { HOST, BLOCK_DEAMON_TOKEN } from "../index.js";
import { TxSeed, TxUnsigned, UTXO } from "../../utils/Transaction.types.js";

type Response = TxUnsigned;

export const createUnsignedTransaction = (
  txSeed: TxSeed,
  utxo: UTXO,
  params: [string, string]
): Promise<Response> => {
  const { amount, destination } = txSeed;
  const toSend = JSON.stringify({
    to: [{ destination, amount }],
    from: utxo.id,
    index: utxo.index,
  });
  const options: https.RequestOptions = {
    ...HOST,
    path: `/universal/v1/${params[0]}/${params[1]}/tx/create`,
    method: "POST",
    headers: {
      accept: "application/json",
      "X-API-Key": BLOCK_DEAMON_TOKEN,
    },
  };
  return new Promise((resolver, reject) => {
    const req = https.request(options, (res) => {
      let data = Buffer.from([]);
      res.on("data", (chunk) => (data = Buffer.concat([data, chunk])));
      res.on("end", () => {
        const json = JSON.parse(data.toString())
        if(json?.status) reject(json)
        resolver(json);
      });
    });

    req.on("error", (err) => reject(err));
    req.write(toSend);
    req.end();
  });
};
