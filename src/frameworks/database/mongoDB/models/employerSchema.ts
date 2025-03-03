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
    },
    rejection: {
        expiryDate: {
            type: Date,
            default: null
        },
        reason: {
            type: String,
            default: null
        }
    },
    state: {
        type: String,
        required: true,
    },
    district: {
        type: String,
        required: true,
    },
    foundedAt: {
        type:String,
        required: true
    },
    description: {
        type: String,
        default: null
    },
    companySize: {
        type: String,
        default: null
    },

    website: {
        type: String,
        default: null
    },

    socialLinks: {
        type: Object,
        default: {}
    },
    logo: {
        type: String,
        default: null
    },

    images: {
        type: [String],
        default: []
    }
}, {timestamps: true})


const companyModel = model('Company', companySchema)
export default companyModel