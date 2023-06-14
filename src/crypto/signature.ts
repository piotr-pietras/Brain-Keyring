import { secp256k1 } from "@noble/curves/secp256k1";

export const getSignature = (msg: string, privKey: Uint8Array) => {
  const signature = secp256k1.sign(msg, Buffer.from(privKey).toString("hex"));
  return signature;
};
