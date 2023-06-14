import { secp256k1 } from "@noble/curves/secp256k1";
export const toPubKey = (privKey, isCompressed) => {
    const pubKey = secp256k1.getPublicKey(privKey, isCompressed);
    return pubKey;
};
