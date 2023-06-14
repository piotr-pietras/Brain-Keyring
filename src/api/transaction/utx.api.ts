// import https from "https";
// import { HOST, NET, TOKEN } from "../index.js";

// export const utxReq = (): Promise<any> =>
//   new Promise((resolver, reject) => {
//     const req = https.request(
//       {
//         ...HOST,
//         path: `/v1/btc/${NET}/txs?token=${TOKEN}`,
//         method: "GET",
//       },
//       (res) => {
//         res.on("end", (chunk) => {
//           const obj = JSON.parse(chunk.toString());
//           resolver(obj);
//         });
//       }
//     );

//     req.on("error", (err) => {
//       console.log(err);
//       reject("Error...");
//     });
//     req.end();
//   });
