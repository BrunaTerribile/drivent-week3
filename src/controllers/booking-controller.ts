import { Response } from "express";
import { AuthenticatedRequest } from "@/middlewares";
import httpStatus from "http-status";
import bookingService from "@/services/booking-service";

export async function getBookings(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const bookings = await bookingService.getBookings(Number(userId));
    return res.status(httpStatus.OK).send(bookings);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
  }
}

export async function bookRoom(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { roomId } = req.body;

  try {
    const result = await bookingService.bookRoom(Number(userId), Number(roomId));
    return res.status(httpStatus.OK).send(result);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    if (error.name === "CannotListHotelsError") {
      return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    }
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}

export async function updateBooking(req: AuthenticatedRequest, res: Response){
    const bookingId = parseInt(req.params.bookingId)
    const { userId } = req;
    const { roomId } = req.body;

    try {
        const booking = await bookingService.updateBooking(Number(bookingId), Number(userId), Number(roomId))
        return res.status(httpStatus.OK).send(booking)
    } catch (error) {
        return res.sendStatus(httpStatus.BAD_REQUEST);
    }
}