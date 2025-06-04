import mongoose, { Schema } from "mongoose";

const chargingStationSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
      required: true,
    },
    powerOutput: {
      type: Number, // in kW
      required: true,
    },
    connectorType: {
      type: String,
      required: true,
      trim: true,
      enum: [
        "Type 1 (SAE J1772)",
        "Type 2 (Mennekes)",
        "CCS Type 2",
        "DC Fast",
        "Standard Domestic",
      ],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const ChargingStation = mongoose.model(
  "ChargingStation",
  chargingStationSchema
);