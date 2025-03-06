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

  export interface JobApplication extends Document {
    _id: Types.ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    seekerId: Types.ObjectId;
    jobId: Types.ObjectId;
    companyId: Types.ObjectId;
    status: "Pending" | "Shortlisted" | "Hired" | "Rejected";
    resume: string;
    coverLetter?: string | null;
    appliedAt: Date;
  }

  export interface JobApplicationJobDetailState{
    _id: Types.ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    seekerId: Types.ObjectId;
    jobId: {
        _id?: Types.ObjectId;
        title: string;
        description: string;
        state: string;
        district: string;
        employmentType: 'Full-time' | 'Part-time' | 'Internship';
        workMode: 'On-site' | 'Hybrid' | 'Remote';
        salaryRange: {min: string, max: string};
        experience: {min: string, max: string};
        skills: string[];
        requirements: string[];
        benefits: string[];
        jobApplications?: string[] | [];
        companyId: Types.ObjectId;
        status?: 'open' | 'closed'
    };
    companyId: Types.ObjectId;
    status: "Pending" | "Shortlisted" | "Hired" | "Rejected";
    resume: string;
    coverLetter?: string | null;
    appliedAt: Date;
  }

