import supertest from "supertest";
import { INITIAL_DIGIPET, setDigipet } from "../digipet/model";
import app from "../server";

describe("User can rehome a digipet when they currently have one, but they can't if they don't have one.", () => {
  // setup: ensure there is no digipet to begin with
  setDigipet(undefined);

  test("1st GET /digipet informs them that they don't currently have a digipet", async () => {
    const response = await supertest(app).get("/digipet");
    expect(response.body.message).toMatch(/don't have/i);
    expect(response.body.digipet).not.toBeDefined();
  });

  test("1st GET /digipet/rehome informs them that they can't rehome a non-existent digipet", async () => {
    const response = await supertest(app).get("/digipet/rehome");
    expect(response.body.message).not.toMatch(/success/i);
    expect(response.body.message).toMatch(/exist/i);
    expect(response.body.digipet).not.toBeDefined();
  });

  test("1st GET /digipet/hatch informs them that they have hatched a digipet and includes initial digipet data", async () => {
    const response = await supertest(app).get("/digipet/hatch");
    expect(response.body.message).toMatch(/success/i);
    expect(response.body.message).toMatch(/hatch/i);
    expect(response.body.digipet).toHaveProperty(
      "happiness",
      INITIAL_DIGIPET.happiness
    );
    expect(response.body.digipet).toHaveProperty(
      "nutrition",
      INITIAL_DIGIPET.nutrition
    );
    expect(response.body.digipet).toHaveProperty(
      "discipline",
      INITIAL_DIGIPET.discipline
    );
  });

  test("2nd GET /digipet now informs them that they do currently have a digipet", async () => {
    const response = await supertest(app).get("/digipet");
    expect(response.body.message).toMatch(/your digipet/i);
    expect(response.body.digipet).toBeDefined();
  });

  test("2nd GET /digipet/rehome now informs them that they have rehomed their digipet", async () => {
    const response = await supertest(app).get("/digipet/rehome");
    expect(response.body.message).toMatch(/success/i);
    expect(response.body.message).toMatch(/rehome/i);
    expect(response.body.digipet).not.toBeDefined();
  });

  test("3rd GET /digipet/rehome informs them that they can't rehome a non-existent digipet", async () => {
    const response = await supertest(app).get("/digipet/rehome");
    expect(response.body.message).not.toMatch(/success/i);
    expect(response.body.message).toMatch(/exist/i);
    expect(response.body.digipet).not.toBeDefined();
  });
});
