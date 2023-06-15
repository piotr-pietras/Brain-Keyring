import https from "https";
import { HOST, TOKEN } from "../index.js";
export const sendTx = (txSigned, net) => {
    const toSend = JSON.stringify(txSigned);
    const options = Object.assign(Object.assign({}, HOST), { path: `/v1/btc/${net}/txs/send?token=${TOKEN}`, method: "POST", headers: {
            "Content-Type": "application/json",
            "Content-Length": toSend.length,
        } });
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
