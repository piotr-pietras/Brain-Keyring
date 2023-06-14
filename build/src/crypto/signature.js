import { secp256k1 } from "@noble/curves/secp256k1";
export const getSignature = (msg, privKey) => {
    const signature = secp256k1.sign(msg, Buffer.from(privKey).toString("hex"));
    return signature;
};
