import app, { init } from "@/app";
import faker from "@faker-js/faker";
import { TicketStatus } from "@prisma/client";
import httpStatus from "http-status";
import * as jwt from "jsonwebtoken";
import supertest from "supertest";
import {
    createEnrollmentWithAddress,
    createUser,
    createTicket,
    createTicketTypeWithHotel,
    createHotel,
    createRoomWithHotelId,
    createBooking
  } from "../factories";
import { cleanDb, generateValidToken } from "../helpers";

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe("GET /booking", () => {
    it("should respond with status 401 if no token is given", async () => {
      const response = await server.get("/booking");
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  
    it("should respond with status 401 if given token is not valid", async () => {
      const token = faker.lorem.word();
  
      const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  
    it("should respond with status 401 if there is no session for given token", async () => {
      const userWithoutSession = await createUser();
      const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
  
      const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  
    describe("when token is valid...", () => {
      it("should respond with status 200 and user reservation", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeWithHotel();
        const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        const hotel = await createHotel();

        const room = await createRoomWithHotelId(hotel.id);
        const booking = await createBooking(user.id, room.id);
        const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toEqual(
            expect.objectContaining({
            id: booking.id,
            Room: expect.objectContaining({
                id: room.id,
                name: room.name,
                hotelId: room.hotelId,
                createdAt: room.createdAt.toISOString(),
                updatedAt: room.updatedAt.toISOString(),
            }),
            }),
        );
      });
    });
  });
  
describe("POST /booking", () => {
    it("should respond with status 401 if no token is given", async () => {
        const response = await server.get("/booking");
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });
    
      it("should respond with status 401 if given token is not valid", async () => {
        const token = faker.lorem.word();
    
        const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });
    
      it("should respond with status 401 if there is no session for given token", async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    
        const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });

      describe("when token is valid...", () => {
        it("should respond with status 404 when there is no enrollment for given user", async () => {
          const token = await generateValidToken();
          const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);
    
          expect(response.status).toBe(httpStatus.NOT_FOUND);
        });

        it("should respond with status 404 when user doesnt have a ticket yet", async () => {
          const user = await createUser();
          const token = await generateValidToken(user);
          await createEnrollmentWithAddress(user);
          const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);
    
          expect(response.status).toEqual(httpStatus.NOT_FOUND);
        });
    

        it("should respond with status 400 if room is not found", async () => {
          const user = await createUser();
          const token = await generateValidToken(user);
          const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send({});

          expect(response.status).toBe(httpStatus.BAD_REQUEST);
        });

        it("should respond with status 404 if room does not exist", async () => {
          const user = await createUser();
          const token = await generateValidToken(user);
          const enrollment = await createEnrollmentWithAddress(user);
          const ticketType = await createTicketTypeWithHotel();
          const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
          const body = { roomId: 0 };

          const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send(body);

          expect(response.status).toBe(httpStatus.NOT_FOUND);
        });


        it("should respond with status 200 and booking data when reservation is ok", async () => {
          const user = await createUser();
          const token = await generateValidToken(user);
          const enrollment = await createEnrollmentWithAddress(user);
          const ticketType = await createTicketTypeWithHotel();
          const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
          const hotel = await createHotel();

          const room = await createRoomWithHotelId(hotel.id);
          const body = { roomId: room.id };

          const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send(body);

          expect(response.body).toEqual({ bookingId: expect.any(Number) });
          expect(response.status).toBe(httpStatus.OK);
        });
    });
});