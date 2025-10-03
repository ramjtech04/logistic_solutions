import { Request, Response } from "express";
export declare const addTruck: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getTrucks: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getTruckById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateTruck: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteTruck: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getTrucksByOwner: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=truckController.d.ts.map