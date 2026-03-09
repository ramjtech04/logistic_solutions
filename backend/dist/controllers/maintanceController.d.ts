import { Request, Response } from "express";
export declare const addMaintenance: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getMaintenance: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getMaintenanceById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateMaintenance: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteMaintenance: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=maintanceController.d.ts.map