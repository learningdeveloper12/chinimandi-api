import mongoose from "mongoose";

const eventCategorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: true,
    unique: true,
  },
});

const EventCategory = mongoose.model("EventCategory", eventCategorySchema);
export default EventCategory;
