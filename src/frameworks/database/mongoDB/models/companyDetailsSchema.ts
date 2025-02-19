import { Schema, model } from "mongoose"
import { CompanyDetailsRule } from "../../../../entities/rules/companyRules"

const companyDetailsSchema = new Schema<CompanyDetailsRule>({
    companyId: {
        type: Schema.Types.ObjectId,
        ref: 'Company',
        required: true,
        unique: true
    },

    profileImage: {
        type: String,
        default: null
    },

    description: {
        type: String,
        default: null
    },

    companySize: {
        type: String,
        default: null
    },

    location: {
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
    },

    jobPosts: {
        type: [Schema.Types.ObjectId],
        default: []
    }

}, { timestamps: true })


const companyDetailsModel = model('Company-Detail', companyDetailsSchema)
export default companyDetailsModel