import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { notFoundError, unauthorizedError } from "@/errors";
import { cannotListHotelsError } from "@/errors/cannot-list-hotels-error";
import bookingRepository from "@/repositories/booking-repository";

async function listBookings(userId: number) {
  //Tem enrollment?
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }
  //Tem ticket pago isOnline false e includesHotel true
  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket || ticket.status === "RESERVED" || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw cannotListHotelsError();
  }
}

async function getBookings(userId: number){
    await listBookings(userId);

    const bookings = await bookingRepository.findBookings(userId);
    return bookings;
}

async function bookRoom(userId: number, roomId: number) {
    await listBookings(userId);

    const rooms = await bookingRepository.findBookings(roomId);
    if(!rooms) throw notFoundError();

    return rooms;
}

async function updateBooking(bookingId: number, userId: number, roomId: number){
  
  const booking = await bookingRepository.findBookingById(bookingId);
  if (!booking || booking.userId !== userId) throw unauthorizedError();

  //is already booked
  if (booking.id === roomId) throw unauthorizedError();

  //room does not exist
  const room = await bookingRepository.findRoom(roomId);
  if (!room) throw notFoundError();

  const updateBookingId = await bookingRepository.updateBooking(bookingId, roomId);

  return {
    bookingId: updateBookingId.id,
  };
}

const bookingService = {
  getBookings,
  bookRoom,
  updateBooking
};

export default bookingService;