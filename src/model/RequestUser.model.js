import mongoose, { Schema } from "mongoose";

const RequestUserSchema = new mongoose.Schema({
    currentUserId: {
        type: String,
        required: true
    },
    requestUserId: { 
        type: String, 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['pending', 'accept', 'reject'], 
        default: 'pending' 
    },
    bookingId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BookEvent',
        required: true
    },

}, { timestamps: true });

const RequestUser = mongoose.model('RequestUser', RequestUserSchema);
export default RequestUser;