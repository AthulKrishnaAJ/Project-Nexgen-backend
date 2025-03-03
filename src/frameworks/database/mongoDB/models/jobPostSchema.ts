import { Schema, model } from "mongoose";
import { JobPostRule } from "../../../../entities/rules/companyRules";

const jobPostSchema = new Schema<JobPostRule>({
    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    state: {
        type: String,
        required: true,
    },
    district: {
        type: String,
        required: true,
    },

    employmentType: {
        type: String,
        enum: ['Full-time', 'Part-time', 'Internship'],
        required: true
    },

    workMode: {
        type: String,
        enum: ['On-site', 'Hybrid', 'Remote'],
        required: true
    },

    salaryRange: {
        min: {type: String, required: true},
        max: {type: String, required: true}
    },
    experience: {
        min: {
            type: String
        },
        max: {
            type: String
        }
    },
    skills: {
        type: [String],
        required: true
    },

    requirements: {
        type: [String],
        required: true
    },

    benefits: {
        type: [String],
        required: true
    },

    jobApplications: {
        type: [Schema.Types.ObjectId],
        ref: 'Job-Application',
        default: []
    },

    companyId: {
        type: Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },

    status: {
        type: String,
        enum: ['open', 'closed'],
        default: 'open'
    }
}, {timestamps: true})


const jobPostModel =  model('Job', jobPostSchema)
export default jobPostModel


