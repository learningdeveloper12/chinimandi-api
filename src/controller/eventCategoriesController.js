import EventCategory from "../model/EventCategories.model.js";
import { isValidObjectId } from "../utils/objectIdValidator.js";

export const createEventCategory = async (req, res) => {
  console.log("Create Category Controller");
  try {
    const { categoryName } = req.body;

    const newCategory = new EventCategory({
      categoryName,
    });

    await newCategory.save();

    res.status(201).json({
      success: true,
      message: "Event Category created successfully",
      newCategory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create Event Category",
      error: error.message,
    });
  }
};

// READ: Get an Event Category by ID
export const getEventCategoryById = async (req, res) => {
  const { id } = req.query;
  if (!isValidObjectId(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid event ID format" });
  }
  try {
    const category = await EventCategory.findById(id);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }
    res.status(200).json({ success: true, category });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get Event Category",
      error: error.message,
    });
  }
};

// READ: Get all Event Category
// export const getAllEvents = async (req, res) => {
//   try {
//     const category = await EventCategory.find();
//     res.status(200).json({ success: true, category });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to get Event Category",
//       error: error.message,
//     });
//   }
// };
export const getAllEvents = async (req, res) => {
  const { sort = 'asc', page = 1, limit = 10 } = req.query; 
  
  const sortOrder = sort === 'desc' ? -1 : 1; 

  const pageNumber = parseInt(page, 10); 
  const pageLimit = parseInt(limit, 10);

  try {
    const totalCategories = await EventCategory.countDocuments();

    const categories = await EventCategory.find()
      .sort({ categoryName: sortOrder }) 
      .skip((pageNumber - 1) * pageLimit) 
      .limit(pageLimit);

    const totalPages = Math.ceil(totalCategories / pageLimit);

    res.status(200).json({
      success: true,
      categories,
      pagination: {
        page: pageNumber,
        limit: pageLimit,
        totalPages,
        totalCategories,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get Event Categories",
      error: error.message,
    });
  }
};

// UPDATE: Update an EventCategory by ID
export const updateEventCategory = async (req, res) => {
  const { id } = req.query;
  const { categoryName } = req.body;

  if (!isValidObjectId(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid eventCategory ID format" });
  }

  try {
    const updatedEventCategory = await EventCategory.findByIdAndUpdate(
      id,
      {
        categoryName,
      },
      { new: true },
    );

    if (!updatedEventCategory) {
      return res
        .status(404)
        .json({ success: false, message: "EventCategory not found" });
    }

    res.status(200).json({
      success: true,
      message: "EventCategory updated successfully",
      event: updatedEventCategory,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to update event category",
      error: error.message,
    });
  }
};

// DELETE: Delete an Event Category by ID
export const deleteEventCategory = async (req, res) => {
  const { id } = req.query;

  if (!isValidObjectId(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid event category ID format" });
  }

  try {
    const role = req.user.role;
    if (role === "Admin") {
      const eventCategorie = await EventCategory.findByIdAndDelete(id);
      if (!eventCategorie) {
        return res
          .status(404)
          .json({ success: false, message: "Event Category not found" });
      }
      res
        .status(200)
        .json({
          success: true,
          message: "Event Category deleted successfully",
        });
    } else {
      return res
        .status(403)
        .json({
          success: false,
          message: "Unauthorized to delete event category",
        });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to delete event category",
      error: error.message,
    });
  }
};
