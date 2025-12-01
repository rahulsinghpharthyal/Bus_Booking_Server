import { asyncHandler } from "../middlewares/asyncHandler.js";
import { getBusById, searchBusService } from "../services/bus.service.js";
import ApiError from "../utils/ApiError.js";

const getBusDetails = asyncHandler(async (req, res, next) => {
  const { busId } = req.params;
  if (!busId) {
    throw new ApiError(400, "Bus Id is required");
  }

  const bus = await getBusById(busId);
  if (!bus) {
    throw new ApiError(404, "Bus not found");
  }

  return res.status(200).json({
    success: true,
    data: bus,
  });
});

const searchBuses = asyncHandler(async (req, res, next) => {
  const { from, to, date } =  req.body;
  if (!from || !to || !date) {
    throw new ApiError(400, "From, to and date are required");
  }

  // Normalize & avoid mutation
  const selectedDate = new Date(date);

  if (isNaN(selectedDate)) {
    throw new ApiError(400, "Invalid date format");
  }

  const startOfDay = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    selectedDate.getDate(),
    0,
    0,
    0
  );

  const endOfDay = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    selectedDate.getDate(),
    23,
    59,
    59,
    999
  );

  const buses = await searchBusService(from, to, startOfDay, endOfDay);
  if (!buses || buses.length === 0) {
    throw new ApiError(404, "No buses found for the selected route and date");
  }
  return res
    .status(200)
    .json({ success: true, count: buses.length, data: buses });
});

export { getBusDetails, searchBuses };
