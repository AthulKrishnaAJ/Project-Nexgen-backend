import { ObjectId } from "mongoose";

export interface seekerDetailsRule {
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    password: string;
    blocked?: boolean
    logo?: string
}