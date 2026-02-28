import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
    },
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    startTime: {
      type: String,
      required: true,
    },

    endTime: {
      type: String,
      required: true,
    },

    expectedParticipants: {
      type: Number,
      required: true,
    },

    purpose: {
      type: String,
      required: true,
      enum: ["class", "meeting", "event", "workshop"],
    },
    status: {
      type: String,
      enum: ["Pending", "Rejected", "Approved"],
      default: "Pending",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Event", eventSchema);
