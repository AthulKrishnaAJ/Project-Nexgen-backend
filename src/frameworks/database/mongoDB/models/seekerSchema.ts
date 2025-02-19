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
    },
    dateOfBirth: {
        type: String
    },
    gender: {
        type: String
    },
    pincode: {
        type: String
    },
    city: {
        type: String
    },
    state: {
        type: String
    },
    bio: {
        type: String
    },
    certifications: {
        type: [String]
    },
    experience: [
        {
          type: Schema.Types.ObjectId,
          ref: "seeker-experience", 
        },
      ],

    educations: [
        {
            qualification: String,
            institution: String,
            fieldOfStudy: String,
            startDate: Date,
            endDate: Date,
        }
    ]

}, {timestamps: true})



const seekerModel = model('seeker', seekerSchema)
export default seekerModel