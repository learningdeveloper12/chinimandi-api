import { DateTime } from "luxon";
import Event from "../model/Events.model.js";
import { isValidObjectId } from "../utils/objectIdValidator.js";
import BookEvent from "../model/BookEvent.model.js";
import jwt from "jsonwebtoken";
import User from "../model/User.model.js";
import mongoose from "mongoose";
// import geoip from 'geoip-lite'

// Helper function to populate event details
export const populateEventDetails = async (eventQuery) => {
  return eventQuery
    .populate("organizer")
    .populate("sponsers")
    .populate({
      path: "agenda",
      populate: {
        path: "sessions.speakers._id",
      },
    });
};

export const updateEventStatus = async (event) => {
  try {
    const currentDate = new Date()
      const eventEndDate = new Date(event.dateAndTime.eventEndDate);

      if (eventEndDate < currentDate) {
        await Event.updateOne({_id:event.id},{$set:{eventStatus:"past"}})
      }
  } catch (error) {
    console.error("Error updating event statuses:", error);
  }
};

// export const createEvent = async (req, res) => {
//   try {
//     console.log(req, "REQ FOR IP");

//     // Extract event details from request body
//     const {
//       eventTitle,
//       eventDescription,
//       category,
//       subCategory,
//       organizer,
//       dateAndTime,
//       venueDetails,
//       priceDetails,
//       availableSeats,
//       mediaAndMarketing,
//       sponsers,
//       speakers,
//       additionalDetails,
//     } = req.body;

//     // Get user's IP address from request
//     // let userIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

//     // if (userIP === '::1') {
//     //   // userIP = '8.8.8.8'; // Default to a known public IP for testing US (Google DNS)
//     //   userIP = '139.59.0.0' //For India
//     // }

//     // // Use IP address to determine the country and currency
//     // const geoData = await axios.get(`https://ipinfo.io/${userIP}/json?token=f851a6383678b1`);
//     // const country = geoData.data.country;

//     // Function to determine the currency format based on country
//     // const getCurrencySymbol = (countryCode) => {
//     //   switch (countryCode) {
//     //     case 'IN':
//     //       return 'INR';
//     //     case 'US':
//     //       return 'USD';
//     //     default:
//     //       return 'INR';
//     //   }
//     // };

//     // console.log(geoData.data.country,"GEODATA")

//     // const currency = getCurrencySymbol(country);

//     // console.log(currency,"CUURENCY")

//     // Format the priceDetails based on the currency (Assuming priceDetails is an object with 'amount' property)
//     // if (priceDetails && priceDetails.amount) {
//     //   priceDetails.amount = new Intl.NumberFormat('en-US', {
//     //     style: 'currency',
//     //     currency: currency,
//     //   }).format(priceDetails.amount);
//     // }

//     const newEvent = new Event({
//       eventTitle,
//       eventDescription,
//       category,
//       subCategory,
//       organizer,
//       dateAndTime,
//       venueDetails,
//       priceDetails,
//       availableSeats,
//       mediaAndMarketing,
//       sponsers,
//       speakers,
//       additionalDetails,
//       createdBy: req.user.id,
//       isApproved : false
//     });

//     const isAuth = req.user.role;
//     if (isAuth === "Admin" || isAuth === "vendor") {

//       if (isAuth === "vendor") {
//         newEvent.isApproved = false;
//       } else {
//         newEvent.isApproved = true;
//       }
//       await newEvent.save();

//       res.status(201).json({
//         success: true,
//         message: "Event created successfully",
//         newEvent,
//       });
//     } else {
//       res
//         .status(403)
//         .json({ success: false, message: "Unauthorized to create event" });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to create event",
//       error: error.message,
//     });
//   }
// };

export const createEvent = async (req, res) => {
  try {
    // Extract event details from request body
    const {
      eventTitle,
      eventDescription,
      category,
      subCategory,
      organizer,
      dateAndTime,
      venueDetails,
      isWebinarEvent,
      isFreeEvent,
      earlyBirdDetails,
      priceDetails,
      availableSeats,
      mediaAndMarketing,
      sponsers,
      agenda,
      additionalDetails,
    } = req.body;

    // Validate required fields
    if (!eventTitle || !eventDescription || !dateAndTime) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields.",
      });
    }

    const newEventData = {
      eventTitle,
      eventDescription,
      category,
      subCategory,
      organizer,
      isWebinarEvent,
      isFreeEvent,
      dateAndTime,
      venueDetails,
      earlyBirdDetails,
      priceDetails,
      availableSeats,
      mediaAndMarketing,
      sponsers,
      agenda,
      additionalDetails,
      createdBy: req.user.id,
    };

    // Check user role for authorization
    const isAuth = req.user.role;
    if (isAuth !== "Admin" && isAuth !== "vendor") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to create event.",
      });
    }

    newEventData.isApproved = isAuth === "Admin" ? true : false;

    // Create the new event instance
    const newEvent = new Event(newEventData);

    // Save the event to the database
    await newEvent.save();

    // Return success response
    res.status(201).json({
      success: true,
      message: "Event created successfully",
      newEvent,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to create event",
      error: error.message,
    });
  }
};


export const getEventById = async (req, res) => {
  console.log("EVENT BY ID")
  const { id } = req.query;

  if (!isValidObjectId(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid event ID format" });
  }

  try {
    const event = await populateEventDetails(Event.findById(id));

    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }
     await updateEventStatus(event)
    // Check if the event has early bird details
    const { earlyBirdDetails, priceDetails } = event;

    if (
      earlyBirdDetails &&
      earlyBirdDetails.earlyBirdStartDate &&
      earlyBirdDetails.earlyBirdEndDate
    ) {
      const timeZone = "Asia/Kolkata";
      const currentDate = DateTime.now().setZone(timeZone).toJSDate();

      const earlyBirdStartDate = new Date(earlyBirdDetails.earlyBirdStartDate);
      const earlyBirdEndDate = new Date(earlyBirdDetails.earlyBirdEndDate);

      if (
        currentDate >= earlyBirdStartDate &&
        currentDate <= earlyBirdEndDate
      ) {
        const earlyBirdPercentage = earlyBirdDetails.earlyBirdPercentage / 100;

        if (priceDetails.priceInINR) {
          priceDetails.priceInINR =
            priceDetails.priceInINR -
            priceDetails.priceInINR * earlyBirdPercentage;
        }
        if (priceDetails.priceInUSD) {
          priceDetails.priceInUSD =
            priceDetails.priceInUSD -
            priceDetails.priceInUSD * earlyBirdPercentage;
        }
      }
    }

    // Return the modified event object
    res.status(200).json({ success: true, event });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to get event",
      error: error.message,
    });
  }
};

// READ: Get all Events
export const getAllEvents = async (req, res) => {
  const { sort = "asc", page = 1, limit = 20 } = req.query;

  const sortOrder = sort === "asc" ? -1 : 1;

  const pageNumber = parseInt(page, 10);
  const pageLimit = parseInt(limit, 20);

  try {
    const totalEvents = await Event.countDocuments();

    const events = await populateEventDetails(
      Event.find()
        .sort({ eventTitle: sortOrder })
        .skip((pageNumber - 1) * pageLimit)
        .limit(pageLimit)
    );

    const totalPages = Math.ceil(totalEvents / pageLimit);

    res.status(200).json({
      success: true,
      events,
      pagination: {
        page: pageNumber,
        limit: pageLimit,
        totalPages,
        totalEvents,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to get events",
      error: error.message,
    });
  }
};

// UPDATE: Update an Event by ID
export const updateEvent = async (req, res) => {
  const { id } = req.query;

  const isAuth = req.user.role;
  if (isAuth !== "Admin" && isAuth !== "vendor") {
    return res.status(403).json({
      success: false,
      message: "Unauthorized to Update event.",
    });
  }

  const {
    eventTitle,
    eventDescription,
    category,
    subCategory,
    isWebinarEvent,
    isFreeEvent,
    organizer,
    dateAndTime,
    venueDetails,
    earlyBirdDetails,
    priceDetails,
    availableSeats,
    mediaAndMarketing,
    sponsers,
    agenda,
    additionalDetails,
    isApproved,
  } = req.body;

  if (!isValidObjectId(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid event ID format" });
  }

  try {
    // Find the existing event by ID
    const event = await Event.findById(id);
    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }
    // If Admin then should isApproved can change
    if (isAuth === "Admin") {
      event.isApproved = isApproved;
    } else {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to Update event.",
      });
    }

    event.eventTitle = eventTitle || event.eventTitle;
    event.eventDescription = eventDescription || event.eventDescription;
    event.category = category || event.category;
    event.subCategory = subCategory || event.subCategory;
    event.organizer = organizer || event.organizer;
    event.dateAndTime = dateAndTime || event.dateAndTime;
    event.venueDetails = venueDetails || event.venueDetails;
    event.earlyBirdDetails = earlyBirdDetails || event.earlyBirdDetails;
    event.isWebinarEvent,
      isFreeEvent,
      (event.priceDetails = priceDetails || event.priceDetails);
    event.availableSeats = availableSeats || event.availableSeats;
    event.mediaAndMarketing = mediaAndMarketing || event.mediaAndMarketing;
    event.sponsers = sponsers || event.sponsers;
    event.agenda = agenda || event.agenda;
    event.additionalDetails = additionalDetails || event.additionalDetails;

    // Save the updated event
    const updatedEvent = await event.save();

    res.status(200).json({
      success: true,
      message: "Event updated successfully",
      event: updatedEvent,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to update event",
      error: error.message,
    });
  }
};

// DELETE: Delete an Event by ID
export const deleteEvent = async (req, res) => {
  const { id } = req.query;

  if (!isValidObjectId(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid event ID format" });
  }

  try {
    const event = await Event.findByIdAndDelete(id);

    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Event deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to delete event",
      error: error.message,
    });
  }
};

export const getEventAttendees = async (req, res) => {
  console.log("Get Event Attendees Controller");

  try {
    const { eventId } = req.query;

    // const { id: userId } = req.user;

    if (!isValidObjectId(eventId)) {
      return res.status(400).json({ message: "Invalid event ID format" });
    }

    const eventBookings = await BookEvent.find({ eventId }).populate("eventId");
    // if (!eventBookings || eventBookings.length === 0) {
    //   return res
    //     .status(404)
    //     .json({ message: "Event not found or no bookings for this event" });
    // }

    // const usersWhoBooked = await User.find({
    //   bookings: { $in: eventBookings.map((booking) => booking._id) },
    // });

    // const loggedInUser = await User.findById(userId);
    // if (!loggedInUser) {
    //   return res.status(404).json({ message: "User not found" });
    // }

    // const userBooking = loggedInUser.bookings.some((bookingId) =>
    //   eventBookings.some(
    //     (booking) => booking._id.toString() === bookingId.toString()
    //   )
    // );

    // if (!userBooking) {
    //   return res
    //     .status(403)
    //     .json({ message: "You must book this event to view the attendees" });
    // }

    let attendees = eventBookings
      ?.map((booking) => ({
        attendeesDetails: booking.attendeesDetails,
        bookingId: booking._id,
      }))
      .flatMap((booking) => booking.attendeesDetails);

    // attendees = attendees.filter(
    //   (attendee) => attendee.id.toString() !== loggedInUser._id.toString()
    // );

    // let usersAttended = usersWhoBooked.map((user) => ({
    //   id: user._id,
    //   name: user.name,
    //   email: user.email,
    // }));

    // usersAttended = usersAttended.filter(
    //   (user) => user.id.toString() !== loggedInUser._id.toString()
    // );

    // if (attendees.length === 0 ) {
    //   return res.status(404).json({
    //     success: false,
    //     message: "No attendees found for this event",
    //   });
    // }

    res.status(200).json({
      success: true,
      message: "Successfully fetched event attendees",
      attendees,
      // usersWhoBooked: usersAttended,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch event attendees",
      error: error.message,
    });
  }
};


export const getEventSpeakers = async (req, res) => {
  console.log("Get Event speaker Controller");

  try {
    const { eventId } = req.query;

    if (!isValidObjectId(eventId)) {
      return res.status(400).json({ message: "Invalid event ID format" });
    }

    const data = await Event.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(eventId) } },
      {
        $lookup: {
          from: "speakers",
          localField: "agenda.sessions.speakers._id",
          foreignField: "_id",
          as: "speakers",
        },
      },
      { $unwind: "$speakers" },
      { $project: { _id: 1, speakers: 1 } },
      { $group: { _id: "$_id", speakers: { $push: "$speakers" } } },
    ]);

    res.status(200).json({
      success: true,
      message: "Successfully fetched event speaker",
      data,
      // usersWhoBooked: usersAttended,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch event attendees",
      error: error.message,
    });
  }
};

