import mongoose, { Schema } from "mongoose";

const ticketSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bus: {
      type: Schema.Types.ObjectId,
      ref: "Bus",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    seatNumbers: [
      {
        type: Number,
        required: true,
      },
    ],
    total_fares: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["Upcoming", "Completed", "Cancelled"],
      default: "Upcoming",
    },
    bookedAt: {
      type: Date,
      default: Date.now,
    },
    pnr: {
      type: String,
      unique: true,
      required: true,
    },
  },
  { timestamps: true }
);

const Ticket = mongoose.model("Ticket", ticketSchema);

export default Ticket;
