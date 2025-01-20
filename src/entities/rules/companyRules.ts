import { Types } from "mongoose";


export interface EmployerDetailsRule {
    id?: Types.ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    password?: string;
    blocked?:boolean
}