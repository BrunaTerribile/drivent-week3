import app, { init } from "@/app";
import httpStatus from "http-status";
import supertest from "supertest";
import { cleanDb } from "../helpers";

beforeAll(async () => {
  await init();
  await cleanDb();
});

const server = supertest(app);

describe("GET /hotels", () => {
    it("should respond with status 404 if there is no hotel", async () => {
      const response = await server.get("/hotels");
  
      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("should respond with status 200 and hotel data if there is a hotel", async () => {
        const response = await server.get("/hotels");
    
        expect(response.status).toBe(httpStatus.OK);
    });

    it("should respond with status 401 if user is invalid", async () => {
        const response = await server.get("/hotels");
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 401 if user is invalid", async () => {
        const response = await server.get("/hotels");
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

});