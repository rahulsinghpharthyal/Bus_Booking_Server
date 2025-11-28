import Bus from "../models/bus.model.js";

export async function getBusById (busId) {
  return await Bus.findOne({ bus_id: busId });
};

export async function searchBusService (from, to, startOfDay, endOfDay) {
  return await Bus.find({
    from,
    to,
    departureTime: { $gte: startOfDay, $lte: endOfDay },
  }).lean();
};