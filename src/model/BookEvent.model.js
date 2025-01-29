import mongoose, { Schema } from "mongoose";

const attendeesSchema = new mongoose.Schema({
    fname: {
        type: String,
        trim: true,
    },
    lname: {
        type: String,
        trim: true,
    },
    companyName:{
        type: String,
        trim: true,
    },
    country:{
        type: String,
        trim: true,
    },
    city:{
        type: String,
        trim: true,
    },
    state:{
        type: String,
        trim: true,
    },
    email:{
        type: String,
        trim: true,
    },
    profileImage:{
        type: String,
        trim: true,
    },
    additionalInfo:{
        type: String,
        trim: true,
    },
    mobileNo: {
        type: String,
        trim: true,
        minLength: 10,
        maxLength: 10
    },
});

const BookEventSchema = new mongoose.Schema({
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    userId: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        // required: true 
    },
    orderId:{
        type: String,
        trim: true,
        unique: true,
    },
    originUserId:{
       type:Number,
       required: [true, "Origin user ID is required"], 
    },
    numberOfTickets: { 
        type: Number, 
        required: true, 
        min: 1, 
        max: 5 
    },
    attendeesDetails: {
        type: [attendeesSchema],
    },
    totalPrice: { 
        type: Number, 
        trim: true,
        required: true 
    },
    taxAmount:{
        type: Number, 
        trim: true,  
    },
    status: { 
        type: String, 
        enum: ['pending', 'confirmed', 'cancelled'], 
        default: 'pending' 
    },
    bookingDate: { 
        type: Date, 
        default: Date.now 
    },
    coupenCode:{
        type: String,
        trim: true,
        required: false
    },
    discountAmount:{
        type: Number,
        trim: true,
    },
    GSTNumber: {
        type: String,
        trim: true,
    },
    pyamentMethod:{
        type: String,
        trim: true,
        required: false
    },

}, { timestamps: true });

const BookEvent = mongoose.model('BookEvent', BookEventSchema);
export default BookEvent;
