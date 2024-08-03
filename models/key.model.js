import * as mongoose from "mongoose";
import * as hasher from 'crypto'
import {randomUUID} from "crypto";

function generateOtp(length = 6) {
    const otp = crypto.randomInt(10 ** (length - 1), 10 ** length);
    return otp.toString().padStart(length, '0');
}

const keySchema = new mongoose.Schema({
    hash: {
        type: String,
        maxLength: 100,
        required: true
    },
    code: {
        type: String,
        required: true,
    },
    canUse: {
        type: Boolean,
        default: true
    }
}, {timestamps: true})
keySchema.generateNewKey = async function () {
    const data = 'kan-dev' + randomUUID();
    const newHash = hasher.createHash('sha256').update(data).digest('hex')
    const key = new this({
        code: generateOtp(),
        hash: newHash,
        canUse: true
    });
    await key.save();
    return key;
}
keySchema.statics.findByHash = function (hash) {
    return this.findOne({hash: hash});
}
keySchema.statics.checkCanUse = function (hash) {
    const key = this.findOne({hash: hash});
    return !!key.canUse;
}
keySchema.statics.activeHash = function ({hash}) {
    const key = this.findOne({hash: hash});
    if (key.canUse) {
        this.updateOne({hash: hash}, {$set: {canUse: false}});
        return {code: key.code, hash: key.hash, canUse: true}
    }
    return {canUse: false}
}
export const Key = new mongoose.model('Key', keySchema);