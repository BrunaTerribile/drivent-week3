import { prisma } from "@/config";

async function getHotels(){
    return prisma.hotel.findMany()
}

async function getHotelById(){
    
}

const hotelRepository = {
    getHotels,
    getHotelById,
  };
  
  export default hotelRepository;