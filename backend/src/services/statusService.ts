import mongoose from "mongoose";
import Request from "../models/requestModel";
import { requestTransitions, deliveryTransitions } from "./statusRules";
import { RequestStatus, DeliveryStatus } from "../enums/statusEnums";

export const updateRequestStatus = async (
  requestId: string,
  newStatus: RequestStatus,
  {
    truckOwnerId,
    truckId,
    adminId,
  }: { truckOwnerId?: string; truckId?: string; adminId?: string } = {}
) => {
  const request = await Request.findById(requestId);
  if (!request) throw new Error("Request not found");

  const allowed = requestTransitions[request.requestStatus];
  if (!allowed.includes(newStatus)) {
    throw new Error(`Invalid transition from ${request.requestStatus} → ${newStatus}`);
  }

  request.requestStatus = newStatus;

  if (newStatus === RequestStatus.Accepted) {
    if (!truckOwnerId || !truckId) throw new Error("Truck owner ID and Truck ID required");
    request.acceptedByTruckOwnerId = new mongoose.Types.ObjectId(truckOwnerId);
    request.acceptedTruckId = new mongoose.Types.ObjectId(truckId);
  }

  if (newStatus === RequestStatus.Approved) {
    if (!adminId) throw new Error("Admin ID required to approve request");
    request.approvedByAdminId = new mongoose.Types.ObjectId(adminId);
  }

  await request.save();
  return request;
};

export const updateDeliveryStatus = async (
  requestId: string,
  newStatus: DeliveryStatus
) => {
  const request = await Request.findById(requestId);
  if (!request) throw new Error("Request not found");

  // Ensure request is approved before delivery updates
  if (request.requestStatus !== RequestStatus.Approved) {
    throw new Error("Cannot update delivery until request is approved");
  }

  const allowed = deliveryTransitions[request.deliveryStatus];
  if (!allowed.includes(newStatus)) {
    throw new Error(`Invalid transition from ${request.deliveryStatus} → ${newStatus}`);
  }

  request.deliveryStatus = newStatus;
  await request.save();
  return request;
};

