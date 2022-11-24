import { notFoundError, unauthorizedError } from "@/errors";
import enrollmentRepository from "@/repositories/enrollment-repository";
import hotelRepository from "@/repositories/hotel-repository";
import ticketRepository from "@/repositories/ticket-repository";

async function getHotel(userId: number) {
  await hotelValidation(userId);

  const hotels = await hotelRepository.findHotel();
  if (!hotels) {
    throw notFoundError();
  }

  return hotels;
}

async function getRooms(userId: number, hotelId: number) {
  await hotelValidation(userId);

  const hotelRooms = await hotelRepository.findRoomsById(hotelId);
  if (hotelRooms.length === 0) {
    throw notFoundError();
  }

  return hotelRooms;
}

async function hotelValidation(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) {
    throw notFoundError();
  }

  if (
    ticket.TicketType.isRemote === true ||
    ticket.TicketType.includesHotel === false ||
    ticket.status === "RESERVED"
  ) {
    throw unauthorizedError();
  }
}

const hotelService = { getHotel, getRooms };

export default hotelService;
