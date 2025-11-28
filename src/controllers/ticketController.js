import { asyncHandler } from "../middlewares/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import {
  createTicket,
  findUnavailableSeats,
  getTicketsByUserId,
  markSeatsAsBooked,
} from "../services/ticket.service.js";
import { getBusById } from "../services/bus.service.js";
import { validateUser } from "../services/user.service.js";

const getUserTickets = asyncHandler(async (req, res, next) => {
  const userId = req.userId;
  if (!userId) {
    throw new ApiError(401, "Unauthorized access");
  }

  const tickets = await getTicketsByUserId(userId);

  return res.status(200).json({
    success: true,
    count: tickets.length,
    tickets, // will be [] if no tickets
  });
});

const bookTicket = asyncHandler(async (req, res, next) => {
  const { busId, date, seatNumbers } = req.body;
  const userId = req.userId;
  console.log(req.userId)

  if (!userId) {
    throw new ApiError(401, "Unauthorized access");
  }
  if (!busId || !date || !seatNumbers || seatNumbers?.length === 0) {
    throw new ApiError(400, "BusId, date, and seat numbers are required");
  }

  const bus = await getBusById(busId);
  if (!bus) {
    throw new ApiError(404, "Bus not found");
  }

  const user = await validateUser(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const unavailableSeats = findUnavailableSeats(bus, seatNumbers);

  if (unavailableSeats.length > 0) {
    throw new ApiError(400, "Some selected seats are already booked");
  }

  const ticket = await createTicket({
    userId,
    bus,
    date,
    seatNumbers,
  });

  await markSeatsAsBooked(bus, seatNumbers);

  return res.status(201).json({
    success: true,
    message: "Ticket booked successfully.",
    ticket,
  });
});

export { getUserTickets, bookTicket };
