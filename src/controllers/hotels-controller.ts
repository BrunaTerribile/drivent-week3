import { AuthenticatedRequest } from "@/middlewares";
import { Response } from "express";
import httpStatus from "http-status";
import hotelService from "@/services/hotels-service";

export async function getAll(req: AuthenticatedRequest, res: Response){
    try {
        const hotels = await hotelService.getHotels();
        return res.status(httpStatus.OK).send(hotels);
    } catch (error) {
        return res.status(httpStatus.NOT_FOUND).send({});
    }
}

export async function getHotelById(req: AuthenticatedRequest, res: Response){
    const id = parseInt(req.params.id)

    try {
        const hotel = await hotelService.getHotelById(id);
        return res.status(httpStatus.OK).send(hotel);
    } catch (error) {
        return res.status(httpStatus.NOT_FOUND).send({});
    }
}