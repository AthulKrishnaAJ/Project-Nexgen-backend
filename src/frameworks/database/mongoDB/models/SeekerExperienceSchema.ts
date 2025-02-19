import { Schema, model } from "mongoose";
import { SeekerExperienceRule } from "../../../../entities/rules/seekerRules";


const seekerExperienceSchema = new Schema<SeekerExperienceRule>({
    jobTitle: {
        type: String,
        required: true
    },
    companyName: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    reasonForLeaving: {
        type: String,
        required: true
    }
}, {timestamps: true})

const seekerExperienceModel = model('seeker-experience', seekerExperienceSchema)
export default seekerExperienceModel