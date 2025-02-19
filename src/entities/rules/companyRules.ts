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
    profileImage?: string;
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
    title: string;
    description: string;
    location: string;
    employmentType: 'Full-time' | 'Part-time' | 'Internship';
    workMode: 'On-site' | 'Hybrid' | 'Remote';
    salaryRange: {min: string, max: string};
    skills: string[];
    requirements: string[];
    benefits: string[];
    jobApplications?: Types.ObjectId[];
    companyId: Types.ObjectId;
    status?: 'open' | 'closed' | 'paused'

}

export interface JobPostDataState {
    title: string;
    location: string;
    employmentType: string;
    workMode: string;
    minSalary: string;
    maxSalary: string;
    skills: string[];
    requirements: string[];    
    benefits: string[];
    description: string;
    companyId: string;
}