import { prisma } from "@/config";

async function findBookings(userId: number) {
  return prisma.booking.findFirst({
    where: {userId},
    select: {
        id: true,
        Room: true
    }
  })
}

async function findBookingById(bookingId: number) {
    return await prisma.booking.findUnique({ where: { id: bookingId } });
}

async function bookRoom(roomId: number, userId: number) {
  return await prisma.booking.create({
    data: {roomId, userId}
  })
}

async function findRoom(id: number) {
    return await prisma.room.findFirst({ where: { id } });
}

async function updateBooking(bookingId: number, roomId: number){
    return await prisma.booking.update({ where: { id: bookingId }, data: { roomId } })
}

const bookingRepository = {
    findBookings,
    findBookingById,
    bookRoom,
    findRoom,
    updateBooking,
};

export default bookingRepository;
