import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getAll, getHotelById } from "@/controllers";

const hotelsRouter = Router();

hotelsRouter
  .all("/*", authenticateToken)
  .get("/", getAll)
  .get("/hotels/:hotelId", getHotelById );

export { hotelsRouter };