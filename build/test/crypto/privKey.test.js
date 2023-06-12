import assert from "assert";
import { bytesToHex as toHex } from "@noble/hashes/utils";
import { phraseToPrivKey } from "../../src/crypto/privKey.js";
const PHRASE = "test test test test test test";
const PRIV_KEY = "e5e1cb0a5287693924ef3b3d0d27b476299486356964a7f31cd835759d9bea5f";
describe("Private key from phrase", function () {
    it("should return valid private key ", function () {
        const phrase = phraseToPrivKey(PHRASE);
        assert.equal(toHex(phrase), PRIV_KEY);
    });
});
