import { sha256 } from "@noble/hashes/sha256";
export const phraseToPrivKey = (phrase) => {
    const privKey = sha256(phrase);
    return privKey;
};
