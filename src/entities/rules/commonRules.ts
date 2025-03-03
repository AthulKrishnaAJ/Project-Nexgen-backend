import { Document, Types } from "mongoose";
export interface mailConfigRule {
    user: string;
    password: string;
}

export interface CompanyDetailsState  {
    _id?: Types.ObjectId;
    companyName: string;
    industry: string;
    email: string;
    mobile: string;
    blocked?: boolean
    verify?: string
    rejection?: {
        expiryDate: Date;
        reason: string;
    }
    createdAt?: Date;
    updatedAt?: Date;
  }