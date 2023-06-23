import assert from "assert";
import { Net } from "../../src/common/blockchain.types.js";
import { KeysETH } from "../../src/utils/KeysETH.js";
const PHRASE = "test test test test test test";
const PRIV_KEY = "e5e1cb0a5287693924ef3b3d0d27b476299486356964a7f31cd835759d9bea5f";
const PUB_KEY = "040bf654bd2cfc5c16af3c1904572b749c1db27e31318ffd232b8f7c0320a1a1505926d668fc6bf3b9d782d4e01b75e8f50670d864a46b167d4add9cceef291b32";
const ADDRESS = "1524ae37cdbe49d467114c5d0cad47845aad5d18";
describe("ETH keys class", function () {
    describe("for testnet", function () {
        const keys = new KeysETH(PHRASE, Net.TEST);
        const { privKey, pubKey } = keys.keysHex;
        const address = keys.addressHex;
        describe("private key", function () {
            it("should return valid private key ", function () {
                assert.equal(privKey, PRIV_KEY);
            });
        });
        describe("public key", function () {
            it("should return valid public key ", function () {
                assert.equal(pubKey, PUB_KEY);
            });
        });
        describe("address", function () {
            it("should return valid address for testnet ", function () {
                assert.equal(address, ADDRESS);
            });
        });
    });
    describe("for mainnet", function () {
        const keys = new KeysETH(PHRASE, Net.MAIN);
        const { privKey, pubKey } = keys.keysHex;
        const address = keys.addressHex;
        describe("private key", function () {
            it("should return valid private key ", function () {
                assert.equal(privKey, PRIV_KEY);
            });
        });
        describe("public key", function () {
            it("should return valid public key ", function () {
                assert.equal(pubKey, PUB_KEY);
            });
        });
        describe("address", function () {
            it("should return valid address for mainnet ", function () {
                assert.equal(address, ADDRESS);
            });
        });
    });
});
