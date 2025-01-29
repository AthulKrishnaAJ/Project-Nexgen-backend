import { Schema, model } from "mongoose";
import { EmployerDetailsRule } from "../../../../entities/rules/companyRules";


const companySchema = new Schema<EmployerDetailsRule>({
    companyName: {
        type: String,
        required: true
    },

    industry: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    mobile: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },
    blocked: {
        type: Boolean,
        default: false
    },
    verify: {
        type: String,
        enum: ['pending', 'accept', 'reject'],
        default: 'pending'
    }
}, {timestamps: true})


const companyModel = model('Company', companySchema)
export default companyModel