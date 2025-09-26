import { RequestStatus, DeliveryStatus } from "../enums/statusEnums";

export const requestTransitions: Record<RequestStatus, RequestStatus[]> = {
  [RequestStatus.Pending]: [RequestStatus.Accepted, RequestStatus.Cancelled],
  [RequestStatus.Accepted]: [RequestStatus.Approved, RequestStatus.Cancelled],
  [RequestStatus.Approved]: [], 
  [RequestStatus.Cancelled]: [], 
};

export const deliveryTransitions: Record<DeliveryStatus, DeliveryStatus[]> = {
  [DeliveryStatus.NotStarted]: [DeliveryStatus.InTransit, DeliveryStatus.Failed],
  [DeliveryStatus.InTransit]: [DeliveryStatus.Delivered, DeliveryStatus.Failed],
  [DeliveryStatus.Delivered]: [], 
  [DeliveryStatus.Failed]: [], 
};
