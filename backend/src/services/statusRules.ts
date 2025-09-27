import { RequestStatus, DeliveryStatus } from "../enums/statusEnums";

export const requestTransitions: Record<RequestStatus, RequestStatus[]> = {
  [RequestStatus.Pending]: [RequestStatus.Accepted, RequestStatus.Cancelled],
  [RequestStatus.Accepted]: [RequestStatus.Approved, RequestStatus.Cancelled],
  [RequestStatus.Approved]: [], 
  [RequestStatus.Cancelled]: [], 
};


