import supertest from "supertest";
import { Digipet, setDigipet } from "../digipet/model";
import app from "../server";

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
    const startingDigipet: Digipet = {
      happiness: 20,
      nutrition: 11,
      discipline: 28,
    };
    setDigipet(startingDigipet);
  });

  test("GET /digipet informs them that they have a digipet with expected stats", async () => {
    const response = await supertest(app).get("/digipet");
    expect(response.body.message).toMatch(/your digipet/i);
    expect(response.body.digipet).toHaveProperty("nutrition", 11);
    expect(response.body.digipet).toHaveProperty("happiness", 20);
    expect(response.body.digipet).toHaveProperty("discipline", 28);
  });

  test("1st GET /digipet/ignore informs them about the ignore and shows decrease in all stats for digipet", async () => {
    const response = await supertest(app).get("/digipet/ignore");
    expect(response.body.digipet).toHaveProperty("nutrition", 1);
    expect(response.body.digipet).toHaveProperty("happiness", 10);
    expect(response.body.digipet).toHaveProperty("discipline", 18);
  });

  test("2nd GET /digipet/ignore shows continued stats change", async () => {
    const response = await supertest(app).get("/digipet/ignore");
    expect(response.body.digipet).toHaveProperty("nutrition", 0);
    expect(response.body.digipet).toHaveProperty("happiness", 0);
    expect(response.body.digipet).toHaveProperty("discipline", 8);
  });

  test("3rd GET /digipet/ignore shows stats already at 0 not decreasing further", async () => {
    const response = await supertest(app).get("/digipet/ignore");
    expect(response.body.digipet).toHaveProperty("nutrition", 0);
    expect(response.body.digipet).toHaveProperty("happiness", 0);
    expect(response.body.digipet).toHaveProperty("discipline", 0);
  });

  test("4th GET /digipet/ignore shows no further decrease in any stats", async () => {
    const response = await supertest(app).get("/digipet/ignore");
    expect(response.body.digipet).toHaveProperty("nutrition", 0);
    expect(response.body.digipet).toHaveProperty("happiness", 0);
    expect(response.body.digipet).toHaveProperty("discipline", 0);
  });
});
