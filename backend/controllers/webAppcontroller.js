import Assignment from "../models/Assignment.js";
import Bus from "../models/Bus.js";
import Route from "../models/Route.js";
import User from "../models/Users.js";

export const busBoard = async (req, res) => {
    try {
        const assignments = await Assignment.find()
            .select("driverId busId routeId")
            .lean();

        if (!assignments.length) {
            return res.status(200).json({
                success: true,
                count: 0,
                data: [],
            });
        }

        const busIds = [...new Set(assignments.map((item) => item.busId))];
        const driverIds = [...new Set(assignments.map((item) => item.driverId))];
        const routeIds = [...new Set(assignments.map((item) => item.routeId))];

        const [buses, drivers, routes] = await Promise.all([
            Bus.find({
                busId: { $in: busIds },
            })
                .select("busId busNo")
                .lean(),
            User.find({
                userId: { $in: driverIds },
                role: "DRIVER",
            })
                .select("userId name")
                .lean(),
            Route.find({
                routeId: { $in: routeIds },
            })
                .select("routeId name")
                .lean(),
        ]);

        const busMap = new Map(buses.map((bus) => [bus.busId, bus]));
        const driverMap = new Map(drivers.map((driver) => [driver.userId, driver]));
        const routeMap = new Map(routes.map((route) => [route.routeId, route]));

        const busBoardData = assignments.map((assignment) => ({
            busNumber: busMap.get(assignment.busId)?.busNo ?? "Unknown Bus",
            driverName: driverMap.get(assignment.driverId)?.name ?? "Unknown Driver",
            route: routeMap.get(assignment.routeId)?.name ?? "Unknown Route",
        }));

        return res.status(200).json({
            success: true,
            count: busBoardData.length,
            data: busBoardData,
        });
    } catch (error) {
        console.error("Bus board fetch error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch bus board",
        });
    }
};

export const driverBoard = async (req, res) => {
    try {
        const drivers = await User.find({ role: "DRIVER" })
            .select("userId name")
            .lean();

        if (!drivers.length) {
            return res.status(200).json({
                success: true,
                count: 0,
                data: [],
            });
        }

        const driverIds = drivers.map((driver) => driver.userId);

        const assignments = await Assignment.find({
            driverId: { $in: driverIds },
        })
            .select("driverId busId routeId")
            .lean();

        const busIds = [...new Set(assignments.map((item) => item.busId))];
        const routeIds = [...new Set(assignments.map((item) => item.routeId))];

        const [buses, routes] = await Promise.all([
            Bus.find({
                busId: { $in: busIds },
            })
                .select("busId busNo")
                .lean(),
            Route.find({
                routeId: { $in: routeIds },
            })
                .select("routeId name")
                .lean(),
        ]);

        const busMap = new Map(buses.map((bus) => [bus.busId, bus]));
        const routeMap = new Map(routes.map((route) => [route.routeId, route]));

        const driverBoardData = drivers.map((driver) => {
            const driverAssignments = assignments.filter(
                (assignment) => assignment.driverId === driver.userId
            );

            return {
                driverName: driver.name,
                buses: driverAssignments.map((assignment) => ({
                    busNumber: busMap.get(assignment.busId)?.busNo ?? "Unknown Bus",
                    route: routeMap.get(assignment.routeId)?.name ?? "Unknown Route",
                })),
            };
        });

        return res.status(200).json({
            success: true,
            count: driverBoardData.length,
            data: driverBoardData,
        });
    } catch (error) {
        console.error("Driver board fetch error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch driver board",
        });
    }
};

export const routeBoard = async (req, res) => {
    try {
        const routes = await Route.find()
            .select("routeId name")
            .lean();

        if (!routes.length) {
            return res.status(200).json({
                success: true,
                count: 0,
                data: [],
            });
        }

        const routeIds = routes.map((route) => route.routeId);

        const assignments = await Assignment.find({
            routeId: { $in: routeIds },
        })
            .select("driverId busId routeId")
            .lean();

        const busIds = [...new Set(assignments.map((item) => item.busId))];
        const driverIds = [...new Set(assignments.map((item) => item.driverId))];

        const [buses, drivers] = await Promise.all([
            Bus.find({
                busId: { $in: busIds },
            })
                .select("busId busNo")
                .lean(),
            User.find({
                userId: { $in: driverIds },
                role: "DRIVER",
            })
                .select("userId name")
                .lean(),
        ]);

        const busMap = new Map(buses.map((bus) => [bus.busId, bus]));
        const driverMap = new Map(drivers.map((driver) => [driver.userId, driver]));

        const routeBoardData = routes.map((route) => {
            const routeAssignments = assignments.filter(
                (assignment) => assignment.routeId === route.routeId
            );

            return {
                routeName: route.name,
                buses: routeAssignments.map((assignment) => ({
                    busNumber: busMap.get(assignment.busId)?.busNo ?? "Unknown Bus",
                    driverName: driverMap.get(assignment.driverId)?.name ?? "Unknown Driver",
                })),
            };
        });

        return res.status(200).json({
            success: true,
            count: routeBoardData.length,
            data: routeBoardData,
        });
    } catch (error) {
        console.error("Route board fetch error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch route board",
        });
    }
};

export const getAllBuses = async (req, res) => {
    try {
        const buses = await Bus.find().select("busId busNo").lean();

        return res.status(200).json({
            success: true,
            count: buses.length,
            data: buses,
        });
    } catch (error) {
        console.error("Get all buses error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch buses",
        });
    }
};

export const getAllDrivers = async (req, res) => {
    try {
        const drivers = await User.find({ role: "DRIVER" })
            .select("userId name")
            .lean();

        return res.status(200).json({
            success: true,
            count: drivers.length,
            data: drivers,
        });
    } catch (error) {
        console.error("Get all drivers error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch drivers",
        });
    }
};

export const getAllRoutes = async (req, res) => {
    try {
        const routes = await Route.find().select("routeId name").lean();

        return res.status(200).json({
            success: true,
            count: routes.length,
            data: routes,
        });
    } catch (error) {
        console.error("Get all routes error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch routes",
        });
    }
};  
export const getAllStopsofARoute = async (req, res) => {
    try {
        const { routeId } = req.params;

        const route = await Route.findOne({ routeId }).select("routeId name stops").lean();

        if (!route) {
            return res.status(404).json({
                success: false,
                message: "Route not found",
            });
        }

        return res.status(200).json({
            success: true,
            count: route.stops.length,
            data: route.stops,
        });
    } catch (error) {
        console.error("Get all stops of a route error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch stops for the route",
        });
    }
};