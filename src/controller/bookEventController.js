import { generateOrderId } from "../constant/Pattern.js";
import BookEvent from "../model/BookEvent.model.js";
import DiscountCoupon from "../model/discountCoupen.model.js";
import Event from "../model/Events.model.js";
import User from "../model/User.model.js";
import { isValidObjectId } from "../utils/objectIdValidator.js";
import xlsx from "xlsx"

// Helper function to populate event details
const populateUserDetails = async (userQuery) => {
  return userQuery.populate("userId").populate("eventId");
};

// export const createEvntBooking = async (req, res) => {
//   console.log("Create Event Booking Controller");

//   try {
//     const {
//       eventId,
//       userId,
//       originUserId,
//       numberOfTickets,
//       totalPrice,
//       status,
//       bookingDate,
//       attendeesDetails,
//       coupenCode,
//     } = req.body;

//     const eventDetails = await Event.findById(eventId);

//     if (!eventDetails) {
//       return res.status(400).json({ message: "Event does not exist" });
//     }

//     if (!eventDetails.isApproved) {
//       return res.status(400).json({ message: "Event is not approved" });
//     }

//     if (!isValidObjectId(eventId) || !isValidObjectId(userId)) {
//       return res
//         .status(400)
//         .json({ message: "Invalid event or user ID format" });
//     }

//     if (numberOfTickets < 1 || numberOfTickets > 5) {
//       return res.status(400).json({
//         message: "Number of tickets must be between 1 and 5",
//       });
//     }

//     let finalPrice = totalPrice;

//     if (eventDetails.earlyBirdDetails) {
//       const { earlyBirdStartDate, earlyBirdEndDate, earlyBirdPercentage } =
//         eventDetails.earlyBirdDetails;

//       const today = new Date();

//       const startDate = new Date(earlyBirdStartDate);
//       const endDate = new Date(earlyBirdEndDate);

//       startDate.setHours(0, 0, 0, 0);
//       endDate.setHours(23, 59, 59, 999);

//       if (today >= startDate && today <= endDate) {
//         const earlyBirdDiscount = totalPrice * (earlyBirdPercentage / 100);
//         finalPrice = totalPrice - earlyBirdDiscount;
//       }
//     }

//     let discountValue = 0;
//     if (coupenCode) {
//       const coupon = await DiscountCoupon.findOne({
//         coupenCode,
//         isActive: true,
//       });

//       if (coupon) {
//         discountValue = coupon.discountValue;
//       } else {
//         return res.status(400).json({ message: "Invalid or expired coupon" });
//       }
//     }

//     finalPrice = finalPrice - discountValue;

//     const booking = new BookEvent({
//       orderId: generateOrderId(),
//       originUserId,
//       eventId,
//       userId,
//       numberOfTickets,
//       totalPrice: finalPrice,
//       status,
//       bookingDate,
//       attendeesDetails,
//     });

//     await booking.save();

//     // Update User's bookings array with the new booking ID
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Add the new booking ID to the user's bookings array
//     user.bookings.push(booking._id);

//     // Save the updated User
//     await user.save();

//     return res.status(201).json({
//       success: true,
//       message: "Event Booking created successfully",
//       booking,
//     });
//   } catch (error) {
//     console.error("Error creating booking:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to create event booking",
//       error: error.message || "Unknown error",
//     });
//   }
// };

export const createEvntBooking = async (req, res) => {
  console.log("Create Event Booking Controller");

  try {
    const {
      eventId,
      userId,
      originUserId,
      numberOfTickets,
      totalPrice,
      status,
      bookingDate,
      attendeesDetails,
      coupenCode,
      taxAmount,
      pyamentMethod,
      discountAmount,
      GSTNumber
    } = req.body;

    const eventDetails = await Event.findById(eventId);

    if (!eventDetails) {
      return res.status(400).json({ message: "Event does not exist" });
    }

    if (!eventDetails.isApproved) {
      return res.status(400).json({ message: "Event is not approved" });
    }

    if (!isValidObjectId(eventId)) {
      return res
        .status(400)
        .json({ message: "Invalid event or user ID format" });
    }

    if (numberOfTickets < 1 || numberOfTickets > 5) {
      return res.status(400).json({
        message: "Number of tickets must be between 1 and 5",
      });
    }

    let finalPrice = totalPrice;

    if (eventDetails.earlyBirdDetails) {
      const { earlyBirdStartDate, earlyBirdEndDate, earlyBirdPercentage } =
        eventDetails.earlyBirdDetails;

      const today = new Date();

      const startDate = new Date(earlyBirdStartDate);
      const endDate = new Date(earlyBirdEndDate);

      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);

      if (today >= startDate && today <= endDate) {
        const earlyBirdDiscount = totalPrice * (earlyBirdPercentage / 100);
        finalPrice = totalPrice - earlyBirdDiscount;
      }
    }

    // discount amount will be subtract from app side 
    // let discountValue = 0;
    // if (coupenCode) {
    //   const coupon = await DiscountCoupon.findOne({
    //     coupenCode,
    //     isActive: true,
    //   });

    //   if (coupon) {
    //     discountValue = coupon.discountValue;
    //   } else {
    //     return res.status(400).json({ message: "Invalid or expired coupon" });
    //   }
    // }

    // finalPrice = finalPrice - discountValue;

    const booking = new BookEvent({
      orderId: generateOrderId(),
      originUserId,
      eventId,
      userId,
      numberOfTickets,
      totalPrice: finalPrice,
      status,
      bookingDate,
      attendeesDetails,
      taxAmount,
      pyamentMethod,
      discountAmount,
      GSTNumber,
      coupenCode
    });

    await booking.save();

    // // Update User's bookings array with the new booking ID
    // const user = await User.findById(userId);
    // if (!user) {
    //   return res.status(404).json({ message: "User not found" });
    // }

    // // Add the new booking ID to the user's bookings array
    // user.bookings.push(booking._id);

    // // Save the updated User
    // await user.save();

    return res.status(201).json({
      success: true,
      message: "Event Booking created successfully",
      booking,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create event booking",
      error: error.message || "Unknown error",
    });
  }
};

export const getEvntBookingById = async (req, res) => {
  console.log("Get Event Booking By ID Controller");
  try {
    const { id } = req.query;

    if (!isValidObjectId(id)) {
      return res
        .status(400)
        .json({ message: "Invalid event booking ID format" });
    }

    const booking = await populateUserDetails(BookEvent.findById(id));

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Event booking not found",
        error: error.message,
      });
    }

    res.status(200).json({
      success: true,
      message: "successfully Get alll event bookings",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get event booking by id",
      error: error.message,
    });
  }
};

export const getAllEvntBookings = async (req, res) => {
  console.log("Get All Event Booking Controller");
  try {
    const bookings = await populateUserDetails(BookEvent.find());
    res.status(200).json({
      success: true,
      message: "Successfully get Event bookings",
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get all event bookings",
      error: error.message,
    });
  }
};

export const updateEvntBooking = async (req, res) => {
  console.log("Update Event Booking Controller");
  try {
    const { id } = req.query;
    const {
      eventId,
      userId,
      originUserId,
      numberOfTickets,
      totalPrice,
      status,
      bookingDate,
    } = req.body;

    if (!isValidObjectId(id)) {
      return res
        .status(400)
        .json({ message: "Invalid event booking ID format" });
    }

    if (eventId && !isValidObjectId(eventId)) {
      return res.status(400).json({ message: "Invalid event ID format" });
    }

    // if (userId && !isValidObjectId(userId)) {
    //   return res.status(400).json({ message: "Invalid user ID format" });
    // }

    if (numberOfTickets < 1) {
      return res
        .status(400)
        .json({ message: "Number of tickets should be greater than 0" });
    } else if (numberOfTickets > 5) {
      return res
        .status(400)
        .json({ message: "Number of tickets should not exceed 5" });
    }

    const booking = await BookEvent.findByIdAndUpdate(
      id,
      { eventId, userId, originUserId, numberOfTickets, totalPrice, status, bookingDate },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Event booking updated successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update event booking",
      error: error.message,
    });
  }
};

export const deleteEvntBooking = async (req, res) => {
  console.log("Delete Event Booking Controller");
  try {
    const { id } = req.query;

    if (!isValidObjectId(id)) {
      return res
        .status(400)
        .json({ message: "Invalid event booking ID format" });
    }

    const booking = await BookEvent.findByIdAndDelete(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Event booking not found",
        error: error.message,
      });
    }
    res.status(200).json({
      success: true,
      message: "Event booking deleted successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete event booking",
      error: error.message,
    });
  }
};


export const getMyBookings = async (req, res) => {
  console.log("Get My Event Booking Controller");
  try {
    const { id } = req.query
    const bookings = await populateUserDetails(BookEvent.find({ originUserId: id }).sort({ createdAt: -1 }));
    res.status(200).json({
      success: true,
      message: "Successfully get Event bookings",
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get all event bookings",
      error: error.message,
    });
  }
};

export const applyDiscountCoupon = async (req, res) => {
  console.log("Apply Discount Coupon Controller");
  try {
    const { coupenCode, eventId, price } = req.body;

    if (!coupenCode && !eventId) {
      return res.status(400).json({
        success: false,
        message: "Event ID and Coupon Code are required.",
      });
    }

    const eventDetails = await Event.findById(eventId);

    if (!eventDetails) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    let discountValue = 0;

    if (coupenCode) {
      const discountCoupon = await DiscountCoupon.findOne({
        coupenCode,
        isActive: true,
      });

      if (discountCoupon.eventId) {
        if (discountCoupon.eventId.toString() === eventId) {
          if (discountCoupon.discountType === "percentage") {
            discountValue = (discountCoupon.discountPercentage / 100) * price;
          } else {
            discountValue = discountCoupon.discountValue;
          }
        } else {
          return res.status(404).json({
            success: false,
            message: "Coupon does not apply to this event",
          });
        }
      }

      if (discountCoupon) {

        if (discountCoupon.discountType === "percentage") {
          discountValue = (discountCoupon.discountPercentage / 100) * price;
        } else {
          discountValue = discountCoupon.discountValue;
        }
      } else {
        return res.status(404).json({
          success: false,
          message: "Invalid or expired coupon",
        });
      }
    }

    let totalCost = price - discountValue;

    if (totalCost < 0) {
      return res.status(200).json({
        success: true,
        message: "Coupon applied successfully",
        totalPrice: 0,
        discountValue
      });
    }
    return res.status(200).json({
      success: true,
      message: "Coupon applied successfully",
      totalPrice: totalCost,
      discountValue
    });
  } catch (error) {
    // General error handler
    res.status(500).json({
      success: false,
      message: "Failed to apply discount coupon",
      error: error.message,
    });
  }
};

export const bulkCreateBookEvent = async (req, res) => {

  try {
    const { eventId } = req.body;
    if (!isValidObjectId(eventId)) return res.status(400).json({ message: "Invalid event format" })

    const eventDetails = await Event.findById(eventId);
    if (!eventDetails) {
      return res.status(400).json({ message: "Event does not exist" });
    }

    if (!eventDetails.isApproved) {
      return res.status(400).json({ message: "Event is not approved" });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const data = xlsx.utils.sheet_to_json(sheet);

    const formattedData = data.map((row) => ({
      name: row["Name"],
      email: row["Email"],
      company: row["Company"],
    }));

    const payload = [];
    let taxAmount = eventDetails?.priceDetails[0]?.priceInINR * 0.18;
    let finalPrice = eventDetails?.priceDetails[0]?.priceInINR - taxAmount;
    await Promise.all(
      formattedData.map(async (val) => {

        const { name, email, company } = val;
        if (name || email) {
          const user = await User.findOne({ email, name, companyName: company });

          if (!user) {
            const newUser = new User({ name, email, companyName: company, password: "12345678" });
            await newUser.save();
          }

          payload.push({
            orderId: generateOrderId(),
            originUserId: "",
            eventId,
            // userId: "",
            numberOfTickets: 1,
            totalPrice: finalPrice,
            status: "confirmed",
            bookingDate: new Date(),
            attendeesDetails: [
              {
                fname: name,
                lname: "",
                companyName: company,
                country: "India",
                city: "",
                state: "",
                email: email,
                profileImage: "",
              },
            ],
            taxAmount,
            paymentMethod: "visa",
          });

        }
      })
    );
    await BookEvent.insertMany(payload)

    return res.status(201).json({
      success: true,
      message: "Event Booking created successfully",
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create event booking",
      error: error.message || "Unknown error",
    });
  }
};
