import { getPublicKey } from "@noble/secp256k1";
export const toPubKey = (privKey, isCompressed) => {
    const pubKey = getPublicKey(privKey, isCompressed);
    return pubKey;
};
