import https from "https";
import { HOST, TOKEN } from "../index.js";
export const createTx = (txSeed, params) => {
    const formattedTx = JSON.stringify({
        inputs: [{ addresses: [txSeed.inputAddress] }],
        outputs: [{ addresses: [txSeed.outputAddress], value: txSeed.value }],
    });
    const options = Object.assign(Object.assign({}, HOST), { path: `/v1/${params[0]}/${params[1]}/txs/new?token=${TOKEN}`, method: "POST", headers: {
            "Content-Type": "application/json",
            "Content-Length": formattedTx.length,
        } });
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
