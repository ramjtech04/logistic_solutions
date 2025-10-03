import { Request, Response } from "express";
export declare const getAllRequests: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getAcceptedRequests: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const approveRequest: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const rejectRequest: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const manualAssignRequest: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteRequest: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=adminController.d.ts.map