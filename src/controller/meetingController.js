import BookEvent from "../model/BookEvent.model.js";
import { isValidObjectId } from "../utils/objectIdValidator.js";
import MeetingRequest from "../model/meetingReqSchema.model.js";
import User from "../model/User.model.js";

// export const sendMeetingRequest = async (req, res) => {
//     const { eventId, receiverId } = req.body;
//     const { id: senderId } = req.user;

//     try {
//         if (!isValidObjectId(eventId) || !isValidObjectId(receiverId)) {
//             return res.status(400).json({ message: "Invalid event ID or receiver Id format" });
//         }

//         const receiver = await User.findById(receiverId);

//         const atendeeReceiverId = await BookEvent.findOne({
//             'attendeesDetails._id': receiverId
//         });
    
//         if (!receiver && !atendeeReceiverId) {
//             return res.status(404).json({ message: "Receiver not found in the system" });
//         }

//         if (senderId === receiverId) {
//             return res.status(400).json({ message: "You cannot send a meeting request to yourself" });
//         }

//         const senderBooking = await BookEvent.findOne({ userId: senderId, eventId });

//         const receiverBooking = await BookEvent.findOne({ 
//             eventId, 
//             $or: [
//                 { userId: receiverId }, 
//                 { 'attendeesDetails._id': receiverId }
//             ]
//         });

//         if (!senderBooking || !receiverBooking) {
//             return res.status(400).json({ message: "Both users must have booked the same event" });
//         }

//         const existingRequest = await MeetingRequest.findOne({ senderId, receiverId, eventId });
//         if (existingRequest) {
//             return res.status(400).json({ message: "A meeting request already exists between these users" });
//         }

//         const meetingRequest = new MeetingRequest({
//             senderId,
//             receiverId,
//             eventId,
//             status: "pending"
//         });

//         await meetingRequest.save();

//         return res.status(201).json({
//             success: true,
//             message: "Meeting request sent successfully",
//             meetingRequest
//         });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             success: false,
//             message: "Failed to send meeting request",
//             error: error.message
//         });
//     }
// };

export const sendMeetingRequest = async (req, res) => {
    const { eventId, receiverId } = req.body;
    const { id: senderId } = req.user;

    try {
        if (!isValidObjectId(eventId) || !isValidObjectId(receiverId)) {
            return res.status(400).json({ message: "Invalid event ID or receiver Id format" });
        }

        const receiver = await User.findById(receiverId);
        const atendeeReceiverId = await BookEvent.findOne({
            'attendeesDetails._id': receiverId
        });

        if (!receiver && !atendeeReceiverId) {
            return res.status(404).json({ message: "Receiver not found in the system" });
        }

        if (senderId === receiverId) {
            return res.status(400).json({ message: "You cannot send a meeting request to yourself" });
        }

        const senderBooking = await BookEvent.findOne({ userId: senderId, eventId });

        const receiverBooking = await BookEvent.findOne({
            eventId,
            $or: [
                { userId: receiverId },
                { 'attendeesDetails._id': receiverId }
            ]
        });

        if (!senderBooking || !receiverBooking) {
            return res.status(400).json({ message: "Both users must have booked the same event" });
        }

        // Check if there's already a pending request from senderId to receiverId
        const existingRequestFromSender = await MeetingRequest.findOne({
            senderId,
            receiverId,
            eventId,
            status: 'pending'
        });

        // If there's already a pending request from sender to receiver, prevent receiver from sending another request
        if (existingRequestFromSender) {
            return res.status(400).json({ message: "User has already sent you a meeting request. You cannot send another one until it's resolved." });
        }

        // Check if the receiver has already sent a request to sender (This is the scenario where we want to prevent resending)
        const existingRequestFromReceiver = await MeetingRequest.findOne({
            senderId: receiverId,
            receiverId: senderId,
            eventId,
            status: 'pending'
        });

        // If there's a pending request from receiver to sender, prevent sender from sending another request
        if (existingRequestFromReceiver) {
            return res.status(400).json({ message: "User has already sent you a meeting request. You cannot send another one until it's resolved." });
        }

        const existingRequest = await MeetingRequest.findOne({ senderId, receiverId, eventId });
        if (existingRequest) {
            return res.status(400).json({ message: "A meeting request already exists between these users" });
        }

        const meetingRequest = new MeetingRequest({
            senderId,
            receiverId,
            eventId,
            status: "pending"
        });

        await meetingRequest.save();

        return res.status(201).json({
            success: true,
            message: "Meeting request sent successfully",
            meetingRequest
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to send meeting request",
            error: error.message
        });
    }
};


export const getUserMeetingRequests = async (req, res) => {
    const { id: userId } = req.user; 

    try {
        const sentRequests = await MeetingRequest.find({ senderId: userId }).populate('receiverId',"name email");
        const receivedRequests = await MeetingRequest.find({ receiverId: userId }).populate('senderId',"name");

        const allRequests = [...sentRequests, ...receivedRequests]; 
        if (allRequests.length === 0) {
            return res.status(404).json({ message: "No meeting requests found" });
        }

        res.status(200).json({
            success: true,
            meetingRequests: allRequests
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch meeting requests",
            error: error.message
        });
    }
};

export const getAllMeetings =async(req,res)=>{
    try{
        const allMeeting = await MeetingRequest.find({})

        res.status(200).json({
            success: true,
            message:"successfully get all meetings",
            allMeeting
        });

    }catch(error){
        console.error(error);
        throw new Error("Failed to get all meeting");
    }
}

export const updateMeetingRequestStatus = async (req, res) => {
    const { requestId, status } = req.body; 
    const { id: userId } = req.user;

    try {
        if (!isValidObjectId(requestId)) {
            return res.status(400).json({ message: "Invalid request ID" });
        }
        if (!['accepted', 'rejected'].includes(status)) {
            return res.status(400).json({ message: "Invalid status. Use 'accepted' or 'rejected'" });
        }

        const meetingRequest = await MeetingRequest.findById(requestId);

        if (!meetingRequest) {
            return res.status(404).json({ message: "Meeting request not found" });
        }

        if (meetingRequest.receiverId.toString() !== userId) {
            return res.status(403).json({ message: "You can only respond to requests you've received" });
        }

        // Update the status
        meetingRequest.status = status;
        await meetingRequest.save();

        if (status === 'rejected') {
            await BookEvent.updateOne(
                { userId: meetingRequest.senderId, eventId: meetingRequest.eventId },
                { $pull: { attendeesDetails: { _id: meetingRequest.receiverId } } }
            );
            await BookEvent.updateOne(
                { userId: meetingRequest.receiverId, eventId: meetingRequest.eventId },
                { $pull: { attendeesDetails: { _id: meetingRequest.senderId } } }
            );

            await MeetingRequest.deleteOne({ _id: requestId });
        }

        res.status(200).json({
            success: true,
            message: `Meeting request ${status}`,
            meetingRequest
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to update meeting request",
            error: error.message
        });
    }
};
