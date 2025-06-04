import { ChargingStation } from "../models/chargingStation.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const ALLOWED_CONNECTOR_TYPES = [
    "Type 1 (SAE J1772)",
    "Type 2 (Mennekes)",
    "CCS Type 2",
    "DC Fast",
    "Standard Domestic"
];

// Create a new charging station
export const createChargingStation = asyncHandler(async (req, res) => {
    const { name, location, status, powerOutput, connectorType } = req.body;

    if (
        !name ||
        !location?.latitude ||
        !location?.longitude ||
        !status ||
        !powerOutput ||
        !connectorType
    ) {
        throw new ApiError(400, "All fields are required.");
    }

    if (!ALLOWED_CONNECTOR_TYPES.includes(connectorType)) {
        throw new ApiError(400, "Invalid connector type.");
    }

    const chargingStation = await ChargingStation.create({
        name,
        location,
        status,
        powerOutput,
        connectorType,
        createdBy: req.user._id
    });

    return res.status(201).json(
        new ApiResponse(201, chargingStation, "Charging station created successfully")
    );
});

// Get all charging stations
export const getAllChargingStations = asyncHandler(async (req, res) => {
    const stations = await ChargingStation.find();
    return res.status(200).json(
        new ApiResponse(200, stations, "Charging stations fetched successfully")
    );
});

// Update a charging station (only by owner) - FULL REPLACEMENT (PUT)
export const updateChargingStation = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const station = await ChargingStation.findById(id);
    console.log("body is ",req.body)

    if (!station) {
        throw new ApiError(404, "Charging station not found.");
    }

    if (station.createdBy.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this station.");
    }

    const { name, location, status, powerOutput, connectorType } = req.body;
    console.log(req.body)

    // All fields must be provided for PUT
    if (
        !name ||
        !location?.latitude ||
        !location?.longitude ||
        !status ||
        !powerOutput ||
        !connectorType
    ) {
        throw new ApiError(400, "All fields are required for full update.");
    }

    if (!ALLOWED_CONNECTOR_TYPES.includes(connectorType)) {
        throw new ApiError(400, "Invalid connector type.");
    }

    station.name = name;
    station.location.latitude = location.latitude;
    station.location.longitude = location.longitude;
    station.status = status;
    station.powerOutput = powerOutput;
    station.connectorType = connectorType;

    await station.save();

    return res.status(200).json(
        new ApiResponse(200, station, "Charging station updated successfully")
    );
});

// Delete a charging station (only by owner)
export const deleteChargingStation = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const station = await ChargingStation.findById(id);

    if (!station) {
        throw new ApiError(404, "Charging station not found.");
    }

    if (station.createdBy.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this station.");
    }

    await station.deleteOne();

    return res.status(200).json(
        new ApiResponse(200, {}, "Charging station deleted successfully")
    );
});