import {Schema, model} from 'mongoose'

import { JobApplication } from '../../../../entities/rules/commonRules'

const jobApplicationSchema = new Schema<JobApplication>({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        require: true
    },
    seekerId: {
        type: Schema.Types.ObjectId,
        ref: "seeker", 
        required: true,
      },
    jobId: {
        type: Schema.Types.ObjectId,
        ref: 'Job',
        required: true,
    },
    companyId: {
        type: Schema.Types.ObjectId,
        ref: "Company",
        required: true,
      },
      status: {
        type: String,
        enum: ["Pending", 'Shortlisted', "Hired", "Rejected"],
        default: "Pending",
      },
      resume: {
        type: String,
        required: true
      },
      coverLetter: {
        type: String, 
        default: null,
      },
      appliedAt: {
        type: Date,
        default: Date.now,
      },
}, {timestamps: true})

const jobApplicationModel = model('Job-Application', jobApplicationSchema)
export default jobApplicationModel