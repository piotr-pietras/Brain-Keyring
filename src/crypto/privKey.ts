import { sha256 } from "@noble/hashes/sha256";

export const phraseToPrivKey = (phrase: string) => {
  const privKey = sha256(phrase);
  return privKey;
};
