import https from "https";
import { HOST, NET, TOKEN } from "../index.js";
export const sendTx = (txSigned) => {
    const toSend = JSON.stringify(txSigned);
    const options = Object.assign(Object.assign({}, HOST), { path: `/v1/btc/${NET}/txs/send?token=${TOKEN}`, method: "POST", headers: {
            "Content-Type": "application/json",
            "Content-Length": toSend.length,
        } });
    return new Promise((resolver, reject) => {
        const req = https.request(options, (res) => {
            let data = Buffer.from([]);
            res.on("data", (chunk) => (data = Buffer.concat([data, chunk])));
            res.on("end", () => {
                console.log(data.toString("utf8"));
                resolver("");
            });
        });
        req.on("error", (err) => {
            console.log(err);
            reject("Error...");
        });
        req.write(toSend);
        req.end();
    });
};