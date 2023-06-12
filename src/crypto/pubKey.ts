import { getPublicKey } from "@noble/secp256k1";

export const toPubKey = (privKey: Uint8Array, isCompressed: boolean) => {
  const pubKey = getPublicKey(privKey, isCompressed);
  return pubKey;
};
