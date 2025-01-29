import mongoose from "mongoose";
import Speaker from "../model/Speaker.model.js";
import { isValidObjectId } from "../utils/objectIdValidator.js";

export const createSpeaker = async (req, res) => {
  console.log("Create Speaker Controller");
  try {
    const { speakerName, image, designation, company, aboutSpeaker } = req.body;

    const newSpeaker = {
      speakerName,
      image,
      designation,
      company,
      aboutSpeaker,
    };

    const data = new Speaker(newSpeaker);

    await data.save();

    res.status(201).json({
      success: true,
      message: "Speaker created successfully",
      newSpeaker,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create Speaker",
      error: error.message,
    });
  }
};

// // READ: Get  Speaker by ID
// export const getSpeakerById = async (req, res) => {
//   const { id } = req.query;
//   if (!isValidObjectId(id)) {
//     return res
//       .status(400)
//       .json({ success: false, message: "Invalid Speaker ID format" });
//   }
//   try {
//     const speaker = await Speaker.findById(id);
//     if (!speaker) {
//       return res
//         .status(404)
//         .json({ success: false, message: "speaker not found" });
//     }
//     res.status(200).json({ success: true, speaker });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to get speaker",
//       error: error.message,
//     });
//   }
// };

// READ: Get  Speaker by ID
export const getSpeakerById = async (req, res) => {
  const { id } = req.query;
  if (!isValidObjectId(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid Speaker ID format" });
  }
  try {
    const speaker = await Speaker.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(id) },
      },
      {
        $lookup:{
          from: "events",
          localField: "_id",
          foreignField: "agenda.sessions.speakers._id",
          as: "events",
          pipeline:[
            {
              $project:{
                _id:1,
                eventTitle:1,
                eventDescription:1,
                dateAndTime:1,
              }
            }
          ]
        }
      }
    ]);
    res.status(200).json({ success: true, speaker });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get speaker",
      error: error.message,
    });
  }
};

// READ: Get all Speaker
export const getAllSpeaker = async (req, res) => {
  try {
    const speaker = await Speaker.find();
    res.status(200).json({ success: true, speaker });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get Speaker",
      error: error.message,
    });
  }
};

// UPDATE: Update Speaker by ID
export const updateSpeaker = async (req, res) => {
  const { id } = req.query;
  const { speakerName, image, designation, company, aboutSpeaker } = req.body;

  if (!isValidObjectId(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid speaker id format" });
  }

  try {
    const updatedSpeaker = await Speaker.findByIdAndUpdate(
      id,
      {
        speakerName,
        image,
        designation,
        company,
        aboutSpeaker,
      },
      { new: true }
    );

    if (!updatedSpeaker) {
      return res
        .status(404)
        .json({ success: false, message: "speaker not found" });
    }

    res.status(200).json({
      success: true,
      message: "speaker updated successfully",
      event: updatedSpeaker,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to update speaker",
      error: error.message,
    });
  }
};


// DELETE: Delete Speaker by ID
export const deleteSpeaker = async (req, res) => {
    const { id } = req.query;
  
    if (!isValidObjectId(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid speaker ID format" });
    }
  
    try {
      const role = req.user.role;
      if (role === "Admin" || role === "vendor") {
        const eventSpeaker = await Speaker.findByIdAndDelete(id);
        if (!eventSpeaker) {
          return res
            .status(404)
            .json({ success: false, message: "speaker not found" });
        }
        res
          .status(200)
          .json({
            success: true,
            message: "speaker deleted successfully",
          });
      } else {
        return res
          .status(403)
          .json({
            success: false,
            message: "Unauthorized to delete speaker",
          });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Failed to delete speaker",
        error: error.message,
      });
    }
  };