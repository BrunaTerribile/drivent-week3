import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { bookRoom, getBookings, updateBooking } from "@/controllers/booking-controller";

const bookingRouter = Router();

bookingRouter
  .all("/*", authenticateToken)
  .get("/booking", getBookings)
  .post("/booking", bookRoom)
  .put("/booking/:bookingId", updateBooking)

export { bookingRouter };