import mongoose, { model } from "mongoose";
import { AccommodationDocument } from "./types";

const { Schema } = mongoose;

const accomodationsSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    maxGuests: { type: Number, required: true },
    city: { type: String, required: true },
    host: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  },
  { timestamps: true }
);

export default model<AccommodationDocument>(
  "Accomodation",
  accomodationsSchema
);
