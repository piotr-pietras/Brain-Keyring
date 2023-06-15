import assert from "assert";
import { Keys } from "../../src/utils/Keys.js";
const PHRASE = "test test test test test test";
const PRIV_KEY = "e5e1cb0a5287693924ef3b3d0d27b476299486356964a7f31cd835759d9bea5f";
const PUB_KEY = "040bf654bd2cfc5c16af3c1904572b749c1db27e31318ffd232b8f7c0320a1a1505926d668fc6bf3b9d782d4e01b75e8f50670d864a46b167d4add9cceef291b32";
const ADDRESS_TEST = "n3GgbqMvS3rYdu5VHhjDN3Cfxtobpeqsnj";
// const ADDRESS_MAIN = "1NkjJnGwd2RHrnbsa8kqY7zM6uCttJhzxx";
describe("Keys class", function () {
    const keys = new Keys(PHRASE);
    describe("private key", function () {
        it("should return valid private key ", function () {
            const result = Buffer.from(keys.privKey).toString("hex");
            assert.equal(result, PRIV_KEY);
        });
    });
    describe("public key", function () {
        it("should return valid public key ", function () {
            const result = Buffer.from(keys.pubKey).toString("hex");
            assert.equal(result, PUB_KEY);
        });
    });
    describe("address", function () {
        it("should return valid address for testnet ", function () {
            const result = keys.address;
            assert.equal(result, ADDRESS_TEST);
        });
    });
});
