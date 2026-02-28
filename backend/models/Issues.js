import mongoose from "mongoose";

const issueSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
    },
    issueType: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Success"],
      default: "Pending",
    },
    pointsGiven: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Issue", issueSchema);
