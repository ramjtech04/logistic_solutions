"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const truckController_1 = require("../controllers/truckController");
const truckValidator_1 = require("../validators/truckValidator");
const validateRequest_1 = require("../middleware/validateRequest");
const roleMiddleware_1 = require("../middleware/roleMiddleware");
const router = (0, express_1.Router)();
// Protected routes
//add truck ,admin and truckowner have access
router.post("/", authMiddleware_1.verifyToken, truckValidator_1.addTruckValidation, validateRequest_1.validateRequest, (0, roleMiddleware_1.authorizeRoles)(["admin", "truck_owner"]), truckController_1.addTruck);
//fetch all truck :admin can all and truckowner can only theirs
router.get("/", authMiddleware_1.verifyToken, (0, roleMiddleware_1.authorizeRoles)(["admin", "truck_owner"]), truckController_1.getTrucks);
//fetch single truck
router.get("/fetchtruck/:id", authMiddleware_1.verifyToken, (0, roleMiddleware_1.authorizeRoles)(["admin", "truck_owner"]), truckController_1.getTruckById);
//update truck
router.put("/updatetruck/:id", authMiddleware_1.verifyToken, truckValidator_1.updateTruckValidation, validateRequest_1.validateRequest, (0, roleMiddleware_1.authorizeRoles)(["admin", "truck_owner"]), truckController_1.updateTruck);
//delete truck
router.delete("/deletetruck/:id", authMiddleware_1.verifyToken, (0, roleMiddleware_1.authorizeRoles)(["admin", "truck_owner"]), truckController_1.deleteTruck);
//get trucks of specific owner
router.get("/owner/:truckOwnerId", authMiddleware_1.verifyToken, (0, roleMiddleware_1.authorizeRoles)(["admin"]), truckController_1.getTrucksByOwner);
exports.default = router;
//# sourceMappingURL=truckRoutes.js.map