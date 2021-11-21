"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const model_1 = require("../digipet/model");
const server_1 = __importDefault(require("../server"));
/**
 * This file has integration tests for ignoring a digipet.
 *
 * It is intended to test two behaviours:
 *  1. ignoring a digipet leads to decreasing happiness
 *  2. ignoring a digipet leads to decreasing nutrition
 *  3. ignoring a digipet leads to decreasing discipline
 *
 */
describe("When a user ignores a digipet repeatedly, all stats decreas by 10 each time until they eventually floor out at 0", () => {
    beforeAll(() => {
        // setup: give an initial digipet
        const startingDigipet = {
            happiness: 20,
            nutrition: 11,
            discipline: 28,
        };
        model_1.setDigipet(startingDigipet);
    });
    test("GET /digipet informs them that they have a digipet with expected stats", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default(server_1.default).get("/digipet");
        expect(response.body.message).toMatch(/your digipet/i);
        expect(response.body.digipet).toHaveProperty("nutrition", 11);
        expect(response.body.digipet).toHaveProperty("happiness", 20);
        expect(response.body.digipet).toHaveProperty("discipline", 28);
    }));
    test("1st GET /digipet/ignore informs them about the ignore and shows decrease in all stats for digipet", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default(server_1.default).get("/digipet/ignore");
        expect(response.body.digipet).toHaveProperty("nutrition", 1);
        expect(response.body.digipet).toHaveProperty("happiness", 10);
        expect(response.body.digipet).toHaveProperty("discipline", 18);
    }));
    test("2nd GET /digipet/ignore shows continued stats change", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default(server_1.default).get("/digipet/ignore");
        expect(response.body.digipet).toHaveProperty("nutrition", 0);
        expect(response.body.digipet).toHaveProperty("happiness", 0);
        expect(response.body.digipet).toHaveProperty("discipline", 8);
    }));
    test("3rd GET /digipet/ignore shows stats already at 0 not decreasing further", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default(server_1.default).get("/digipet/ignore");
        expect(response.body.digipet).toHaveProperty("nutrition", 0);
        expect(response.body.digipet).toHaveProperty("happiness", 0);
        expect(response.body.digipet).toHaveProperty("discipline", 0);
    }));
    test("4th GET /digipet/ignore shows no further decrease in any stats", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default(server_1.default).get("/digipet/ignore");
        expect(response.body.digipet).toHaveProperty("nutrition", 0);
        expect(response.body.digipet).toHaveProperty("happiness", 0);
        expect(response.body.digipet).toHaveProperty("discipline", 0);
    }));
});
