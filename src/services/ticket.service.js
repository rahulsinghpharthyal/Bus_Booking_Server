import Ticket from "../models/ticket.model.js";
import { v4 as uuidv4 } from "uuid";

export async function getTicketsByUserId (userId) {
  return await Ticket.find({ user: userId })
    .populate(
      "bus",
      "bus_id from to busType company departureTime arrivalTime price"
    )
    .sort({ bookedAt: -1 })
    .lean();
}

export function findUnavailableSeats(bus, seatNumbers) {
  return seatNumbers.filter((seatNum) =>
    bus.seats?.some((row) =>
      row?.some((seat) => seat.seat_id === seatNum && seat.booked)
    )
  );
}

export async function createTicket({ userId, bus, date, seatNumbers }) {
  const totalFare = bus.price * seatNumbers?.length;

  const newTicket = new Ticket({
    user: userId,
    bus: bus._id,
    date,
    seatNumbers,
    total_fares: totalFare,
    pnr: uuidv4().slice(0, 10).toUpperCase(),
  });

  await newTicket.save();
  return newTicket;
}

export async function markSeatsAsBooked(bus, seatNumbers) {
  bus.seats.forEach((row) => {
    row?.forEach((seat) => {
      if (seatNumbers.includes(seat.seat_id)) {
        seat.booked = true;
      }
    });
  });

  await bus.save();
}