import { Router } from "express";
import { verifyToken } from "../middleware/authMiddleware";
import { addTruck, getTrucks, getTruckById, updateTruck, deleteTruck,getTrucksByOwner } from "../controllers/truckController";
import { addTruckValidation, updateTruckValidation } from "../validators/truckValidator";
import { validateRequest } from "../middleware/validateRequest";
import { authorizeRoles } from "../middleware/roleMiddleware";
const router = Router();

// Protected routes
//add truck ,admin and truckowner have access
router.post("/", verifyToken,addTruckValidation, validateRequest,authorizeRoles(["admin", "truck_owner"]), addTruck);
//fetch all truck :admin can all and truckowner can only theirs
router.get("/", verifyToken, authorizeRoles(["admin", "truck_owner"]), getTrucks);
//fetch single truck
router.get("/fetchtruck/:id", verifyToken, authorizeRoles(["admin", "truck_owner"]),getTruckById);
//update truck
router.put("/updatetruck/:id", verifyToken,updateTruckValidation,validateRequest, authorizeRoles(["admin", "truck_owner"]),updateTruck);
//delete truck
router.delete("/deletetruck/:id", verifyToken,authorizeRoles(["admin", "truck_owner"]), deleteTruck);
//get trucks of specific owner
router.get("/owner/:truckOwnerId", verifyToken, authorizeRoles(["admin"]), getTrucksByOwner);

export default router;
