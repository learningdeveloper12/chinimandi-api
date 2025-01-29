import mongoose, { Schema } from "mongoose";

const meetingRequestSchema = new Schema({
    senderId: { 
        type: Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    receiverId: { 
        type: Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    eventId: { 
        type: Schema.Types.ObjectId, 
        ref: "Event", 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['pending', 'accepted', 'rejected'], 
        default: 'pending' 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

const MeetingRequest = mongoose.model("MeetingRequest", meetingRequestSchema);
export default MeetingRequest;
