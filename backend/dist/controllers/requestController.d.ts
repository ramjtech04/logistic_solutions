import { Request, Response } from "express";
export declare const createRequest: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getMyRequests: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getPendingRequests: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const acceptRequest: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getMyAvailableTrucks: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=requestController.d.ts.map