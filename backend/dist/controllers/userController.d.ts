import { Request, Response } from "express";
export declare const createUserByAdmin: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getAdmins: (req: Request, res: Response) => Promise<void>;
export declare const getCustomers: (req: Request, res: Response) => Promise<void>;
export declare const getTruckOwners: (req: Request, res: Response) => Promise<void>;
export declare const updateUserByAdmin: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getUserById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getMe: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateMe: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteMe: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=userController.d.ts.map