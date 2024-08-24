import * as mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
    name: {
        type: String,
        maxLength: 100,
        required: true,
    },
    username: {
        type: String,
        maxLength: 100,
        required: true
    },
    hash: {
        type: String,
        required: true,
    },
    tickets: {
        type: Number,
        default: 0
    },
}, {timestamps: true})

export const Account = new mongoose.model('Account', accountSchema);