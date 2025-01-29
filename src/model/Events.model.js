import mongoose from "mongoose";

const organizerSchema = new mongoose.Schema(
  {
    organizerName: {
      type: String,
      required: true,
    },
    organizerEmail: {
      type: String,
      required: true,
    },
    organizerPhone: {
      type: String,
      required: true,
    },
    aboutUs: {
      type: String,
      required: true,
    },
    organizerimg: {
      type: String,
      required: false,
    },
  },
  { _id: false }
);

const dateAndTimeSchema = new mongoose.Schema(
  {
    eventStartDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (v) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return v >= today;
        },
        message: "Event start date cannot be in the past.",
      },
    },
    eventEndDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (v) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return v >= today;
        },
        message: "Event end date cannot be in the past.",
      },
    },
    eventStartTime: {
      type: String,
      required: true,
    },
    eventEndTime: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  }
);

const venueInfoSchema = new mongoose.Schema(
  {
    venueName: {
      type: String,
      required: false,
    },
    venueAddress: {
      type: String,
      required: false,
    },
    venueCapacity: {
      type: Number,
      required: false,
    },
    venueZipCode: {
      type: Number,
      required: false,
    },
    venueCity: {
      type: String,
      required: false,
    },
    website: {
      type: String,
    },
    venueState: {
      type: String,
      required: false,
    },
    venueMobileNumber: {
      type: String,
      required: false,
    },
    venueEmail: {
      type: String,
      required: false,
    },
    venueGoogleMapLink: {
      type: String,
      required: false,
    },
  },
  { _id: false }
);

const priceSchema = new mongoose.Schema(
  {
    priceInINR: {
      type: Number,
      required: false,
    },
    priceInUSD: {
      type: Number,
      required: false,
    },
    discountedPrice: {
      type: Number,
      required: false,
    },
    ticketName: {
      type: String,
      required: false,
    },
    ticketDetails: {
      type: String,
      required: false,
    },
    discountedPriceUSD: {
      type: Number,
      required: false,
    },
  },
  { _id: false }
);

const mediaAndMarketingSchema = new mongoose.Schema(
  {
    bannerImage: {
      type: String,
      required: true,
    },
    promoVideo: {
      type: String,
      required: false,
    },
    socialMediaLinks: {
      type: [String],
      required: false,
    },
  },
  { _id: false }
);

const sponserSchema = new mongoose.Schema(
  {
    // fname: {
    //   type: String,
    //   required: true,
    // },
    // lname: {
    //   type: String,
    //   required: true,
    // },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
    website: {
      type: String,
      required: false,
    },
    sponsorType: {
      type: String,
      required: false,
    },
    aboutUs: {
      type: String,
      required: true,
    },
    // phoneNumber: {
    //   type: Number,
    //   required: true,
    // },
    // email: {
    //   type: String,
    //   required: true,
    // },
  },
  { _id: false }
);

const speakerSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Speaker",
    },
  },
  { _id: false }
);

const additionalDetails = new mongoose.Schema(
  {
    foodAndBeverages: {
      type: Boolean,
      default: false,
    },
    parkingAvailability: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const earlyBirdSchema = new mongoose.Schema({
  earlyBirdPercentage: {
    type: String,
    required: false,
  },
  earlyBirdStartDate: {
    type: Date,
    validate: {
      validator: function (v) {
        if (!v) return true;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return v >= today;
      },
      message: "Early bird start date cannot be in the past.",
    },
    required: false,
  },
  earlyBirdEndDate: {
    type: Date,
    validate: {
      validator: function (v) {
        if (!v) return true;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return v >= today;
      },
      message: "Early bird end date cannot be in the past.",
    },
    required: false,
  },
});

const sessionSchema = new mongoose.Schema(
  {
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    title: { type: String, required: true },
    location: { type: String, required: true },
    speakers: [speakerSchema],
    date: { type: Date, required: true },
  },
  { _id: false }
);

const eventSchema = new mongoose.Schema({
  eventTitle: {
    type: String,
    required: true,
  },
  eventDescription: {
    type: String,
    required: true,
  },
  eventStatus: {
    type: String,
    default: "upcoming",
    enum: ["upcoming", "past"],
  },
  category: {
    type: String,
    required: true,
  },
  subCategory: {
    type: String,
    required: true,
  },
  organizer: {
    type: [organizerSchema],
    required: true,
  },
  dateAndTime: {
    type: dateAndTimeSchema,
    required: true,
  },
  isWebinarEvent: {
    type: Boolean,
    default: false,
  },
  venueDetails: {
    type: venueInfoSchema,
    required: function () {
      return !this.isWebinarEvent;
    },
  },
  isFreeEvent: {
    type: Boolean,
    default: false,
  },
  priceDetails: {
    type: [priceSchema],
    required: function () {
      return !this.isFreeEvent;
    },
  },
  availableSeats: {
    type: Number,
    required: true,
  },
  mediaAndMarketing: {
    type: mediaAndMarketingSchema,
    required: true,
  },
  sponsers: {
    type: [sponserSchema],
    required: false,
  },
  agenda: {
    type: [
      {
        sessions: [sessionSchema],
      },
    ],
    required: true,
  },
  // speakers: {
  //   type: [speakerSchema],
  //   required: false,
  // },
  additionalDetails: {
    type: additionalDetails,
    required: false,
  },
  createdBy: {
    type: String,
  },
  earlyBirdDetails: {
    type: earlyBirdSchema,
    required: false,
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
});

const Event = mongoose.model("Event", eventSchema);

export default Event;
