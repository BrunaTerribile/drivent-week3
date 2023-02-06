import hotelRepository from "@/repositories/hotels-repository";
import { notFoundError } from "@/errors";

async function getHotels(){
  const hotels = await hotelRepository.getHotels();
  if (!hotels){
    throw notFoundError();
  }

  return hotels;
}

async function getHotelById(id: number){
  const result = await hotelRepository.getHotelById(id)
  if (!result) {
      throw { message: "Hotel not found." }
  }

  return result;
}

const hotelService = {
    getHotels,
    getHotelById,
  };
  
  export default hotelService;