import { Types, Document } from "mongoose";

export interface seekerDetailsRule {
    _id?: Types.ObjectId 
    firstName: string;
    lastName: string;
    email: string;
    mobile?: string;
    password?: string;
    blocked?: boolean
    logo?: string;
    accessToken?: string
    role?: string
    dateOfBirth?: string;
    gender?: string;
    pincode?:string;
    city?: string;
    state?: string;
    bio?: string;
    skills?:string[];
    resume?:string[];
    certifications?: string[];
    experience?: Types.ObjectId[];
    educations?: SeekerEducationRule[];
    resumeFiles?: { fileKey: string, base64: string }[]
}

export interface SeekerExperienceRule {
    jobTitle: string;
    companyName: string;
    location: string;
    startDate: Date;
    endDate: Date;
    reasonForLeaving: string;
}

export interface SeekerEducationRule {
    qualification: string;
    institution: string;
    fieldOfStudy: string;
    startDate: Date;
    endDate: Date;
}

export interface SeekerEditProfileRule {
    firstName: string;
    lastName: string;
    mobile: string;
    dateOfBirth: string;
    pincode: string;
    state: string;
    city: string;
    gender: string;
    bio: string;
}

export interface SeekerEditProfilePayloadRule {
    seekerId: string;
    seekerData: SeekerEditProfileRule
}

export interface SeekerDataForStore {
    _id: string;
    firstName: string;
    lastName: string;
    mobile: string
}


export interface SeekerFetchingDetailsRule {
    _id?: Types.ObjectId 
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    password: string;
    blocked: boolean
    logo?: string;
    dateOfBirth?: string;
    gender?: string;
    pincode?:string;
    city?: string;
    state?: string;
    bio?: string;
    certifications?: string[] | [];
    experience?: SeekerExperienceRule[] | [];
    educations?: SeekerEducationRule[] | [];
}



  export interface JobApplyProps {
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    jobId: string;
    companyId: string;
    seekerId: string;
    resume: string;
    coverLetter: string;
}