import assert from "assert";
import { toAddress } from "../../src/crypto/address.js";
import { hexToBytes as toBytes } from "@noble/hashes/utils";
const PUB_KEY = "040bf654bd2cfc5c16af3c1904572b749c1db27e31318ffd232b8f7c0320a1a1505926d668fc6bf3b9d782d4e01b75e8f50670d864a46b167d4add9cceef291b32";
const ADDRESS_TEST = "n3GgbqMvS3rYdu5VHhjDN3Cfxtobpeqsnj";
const ADDRESS_MAIN = "1NkjJnGwd2RHrnbsa8kqY7zM6uCttJhzxx";
describe("Address from public key", function () {
    it("should return valid address for test net ", function () {
        const pubKey = toBytes(PUB_KEY);
        const address = toAddress(pubKey, true);
        assert.equal(address, ADDRESS_TEST);
    });
    it("should return valid address for main net ", function () {
        const pubKey = toBytes(PUB_KEY);
        const address = toAddress(pubKey, false);
        assert.equal(address, ADDRESS_MAIN);
    });
});
