
import { Types } from "mongoose";

export interface UserDataForAdmin {
    _id?: Types.ObjectId
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    blocked?: boolean;
    logo?: string | null;
    createdAt?: Date;
    updatedAt?: Date;

}

export const userProjectionData = {
    _id: 1,
    firstName: 1,
    lastName: 1,
    email: 1,
    mobile: 1,
    blocked: 1
}

export interface CompanyDataForAdmin {
    _id?: Types.ObjectId;
    companyName: string;
    industry?: string;
    email: string;
    mobile?: string;
    blocked?: boolean;
    verify?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export const companyProjectionData = {
    companyName: 1,
    industry: 1,
    email: 1,
    blocked: 1,
    verify: 1
}