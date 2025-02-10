import { Types } from "mongoose";


export interface EmployerDetailsRule {
    _id?: Types.ObjectId;
    companyName: string;
    industry: string;
    email: string;
    mobile: string;
    password?: string;
    blocked?: boolean
    verify?: string
    rejection?: {
        expiryDate: Date;
        reason: string;
    }
    accessToken?: string;
    role?: string;
   
}