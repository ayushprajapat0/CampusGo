import express from "express";

import {
	busBoard,
	driverBoard,
	routeBoard,
	getAllBuses,
	getAllDrivers,
	getAllRoutes,
	getAllStopsofARoute,
} from "../controllers/webAppcontroller.js";

const router = express.Router();

router.get("/busboard", busBoard);
router.get("/driverboard", driverBoard);
router.get("/routeboard", routeBoard);

router.get("/buses", getAllBuses);
router.get("/drivers", getAllDrivers);
router.get("/routes", getAllRoutes);
router.get("/routes/:routeId/stops", getAllStopsofARoute);

export default router;

