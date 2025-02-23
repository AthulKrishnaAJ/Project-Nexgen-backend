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


export interface CompanyDetailsRule {
    companyId: Types.ObjectId;
    description?: string
    companySize?: string
    location?: string;
    website?: string;
    socialLinks?: {
        linkedin?: string;
        instagram?: string;
        twitter?: string;
    }
    logo?: string;
    images?: string[];
    jobPosts?: Types.ObjectId[]
}


export interface JobPostRule {
    _id?: Types.ObjectId;
    title: string;
    description: string;
    location: string;
    employmentType: 'Full-time' | 'Part-time' | 'Internship';
    workMode: 'On-site' | 'Hybrid' | 'Remote';
    salaryRange: {min: string, max: string};
    experience: {min: string, max: string};
    skills: string[];
    requirements: string[];
    benefits: string[];
    jobApplications?: Types.ObjectId[] | [];
    companyId: Types.ObjectId;
    status?: 'open' | 'closed'

}

export interface JobPostDataState {
    title: string;
    location: string;
    employmentType: string;
    workMode: string;
    minSalary: string;
    maxSalary: string;
    minExperience: string;
    maxExperience: string;
    skills: string[];
    requirements: string[];    
    benefits: string[];
    description: string;
    companyId: string;
}


export interface changeJobStatusProps {
    jobId: string;
    newStatus: string;
}


export interface GetCompanyDetialsState {
    _id: Types.ObjectId;
    companyName: string;
    industry: string;
    email: string;
    mobile: string;
    password?: string;
    blocked:boolean;
    verify: string;
    rejection: {
        expiryDate: Date | null;
        reason: string | null;
    }
}


export interface GetAllJobsState {
    _id?: Types.ObjectId;
    title: string;
    description: string;
    location: string;
    employmentType: string;
    workMode: string;
    salaryRange: {min: string, max: string};
    experience: {min: string, max: string};
    skills: string[];
    requirements: string[];
    benefits: string[];
    jobApplications?: Types.ObjectId[] | [];
    companyId: Types.ObjectId;
    status?: 'open' | 'closed'
    companyName?: string;
}



