import { prisma } from "@/config";

async function getHotels(){
    return prisma.hotel.findMany();
}

async function getHotelById(id: number){
    return prisma.hotel.findUnique({
        where: { 
            id: id 
        },
        include: {
            Rooms: true
        }
    })
}

const hotelRepository = {
    getHotels,
    getHotelById,
  };
  
  export default hotelRepository;