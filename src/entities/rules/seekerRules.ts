import { Types } from "mongoose";

export interface seekerDetailsRule {
    id?: Types.ObjectId
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    password?: string;
    blocked?: boolean
    logo?: string
}