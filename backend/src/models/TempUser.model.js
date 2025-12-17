import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const tempSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        // unique: true
    },
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'host', 'guest'],
        required: true,
        default: 'guest'
    },
    otpCode: {
        type: String,
        required: true,
    },
    expiredOtp: {
        type: Date,
        required: true,
        index: { expires: 0 }, // TTL index to auto-delete document after expiration
    }
}, { timestamps: true, versionKey: false })


tempSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return
    }

    this.password = await bcrypt.hash(this.password, 12)
})


const TempUser = mongoose.model('TempUser', tempSchema)

export default TempUser