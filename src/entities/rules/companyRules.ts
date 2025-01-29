import { Types } from "mongoose";


export interface EmployerDetailsRule {
    id?: Types.ObjectId;
    companyName: string;
    industry: string;
    email: string;
    mobile: string;
    password?: string;
    blocked?:boolean
    verify?: string
}