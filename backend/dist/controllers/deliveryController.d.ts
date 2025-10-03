import { Request, Response } from "express";
/**
 * Update delivery status (Admin or Truck Owner)
 * PATCH /api/delivery/updatestatus/:id
 */
export declare const updateDeliveryStatus: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * Get deliveries assigned to logged-in Truck Owner
 * GET /api/delivery/my
 */
export declare const getMyDeliveries: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * Get delivery status (Customer/Admin/TruckOwner)
 * GET /api/delivery/:id
 */
export declare const getDeliveryStatus: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=deliveryController.d.ts.map