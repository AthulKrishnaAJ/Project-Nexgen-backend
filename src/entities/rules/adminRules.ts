
import { Types } from "mongoose";

export interface UserDataForAdmin {
    _id?: Types.ObjectId
    firstName: string;
    lastName: string;
    email: string;
    mobile?: string;
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
    rejection?:{
        reason: string,
        expiryDate: Date
    }
    createdAt?: Date;
    updatedAt?: Date;
}

export const companyProjectionData = {
    companyName: 1,
    industry: 1,
    email: 1,
    blocked: 1,
    verify: 1,
    rejection: 1
}

interface RejectionInfo {
    reason: string | null;
    expiryDate: Date | null
}

export interface CompanyVerifyData {
    verify: string
    rejection?: RejectionInfo
}


export interface AdminLoginData {
    email: string;
    role: string
    accessToken: string;

}