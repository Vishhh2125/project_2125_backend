import { Router } from "express";
import { 
    createChargingStation,
    getAllChargingStations,
    updateChargingStation,
    deleteChargingStation
} from "../controllers/chargingStation.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Protect all routes: only logged-in users can access
router.use(verifyJWT);

router.route("/")
    .post(createChargingStation)      // Create a new charging station
    .get(getAllChargingStations);     // Get all charging stations

router.route("/:id")
    .put(updateChargingStation)     // Update a charging station (by owner)
    .delete(deleteChargingStation);   // Delete a charging station (by owner)

export default router;