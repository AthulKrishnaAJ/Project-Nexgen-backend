import { Schema, model } from "mongoose";
import { EmployerDetailsRule } from "../../../../entities/rules/companyRules";


const EmployerSchema = new Schema<EmployerDetailsRule>({
    firstName: {
        type: String,
        required: true
    },

    lastName: {
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
    }
}, {timestamps: true})


const employerModel = model('Employer', EmployerSchema)
export default employerModel