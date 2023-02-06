import hotelRepository from "@/repositories/hotels-repository";
import { notFoundError, unauthorizedError } from "@/errors";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import httpStatus from "http-status";

async function getHotels(userId: number){
  if(!userId) throw unauthorizedError();
  
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if(!enrollment) throw notFoundError();

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if(!ticket) throw notFoundError();

  if(ticket.status != "PAID") throw unauthorizedError();

  const hotels = await hotelRepository.getHotels();
  if (!hotels) throw notFoundError();

  return hotels;
}

async function getHotelById(hotelId: number, userId: number){
  if(!userId) throw unauthorizedError();
  if(!hotelId) throw httpStatus.BAD_REQUEST;
  
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if(!enrollment) throw notFoundError();

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if(!ticket) throw notFoundError();

  if(ticket.status != "PAID") throw unauthorizedError();
  
  const result = await hotelRepository.getHotelById(hotelId)
  if (!result) throw { message: "Hotel not found." }

  return result;
}

const hotelService = {
    getHotels,
    getHotelById,
  };
  
  export default hotelService;