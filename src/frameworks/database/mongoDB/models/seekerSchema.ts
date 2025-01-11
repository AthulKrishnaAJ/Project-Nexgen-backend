import { Schema, model } from "mongoose";
import { seekerDetailsRule } from "../../../../entities/rules/seekerRules"

const seekerSchema = new Schema<seekerDetailsRule>({
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

    logo: {
        type: String,
        default: null
    },
    blocked: {
        type: Boolean,
        default: false
    }
})



const seekerModel = model('seeker', seekerSchema)
export default seekerModel