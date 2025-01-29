import mongoose from "mongoose";

const discountCoupenSchema = new mongoose.Schema({

  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
  },
  coupenCode: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minLength: 6,
    maxLength: 6,
  },
  discountValue: {
    type: Number,
    required: function () {
      return !this.discountPercentage;
    },
  },
  discountValueUSD: {
    type: Number,
    required: function () {
      return !this.discountPercentage;
    },
  },
  discountPercentage: {
    type: Number,
    required: function () {
      return !this.discountValue && !this.discountValueUSD;
    },
  },
  discountType: {
    type: String,
    required: true,
    enum: ["fixed", "percentage"],
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

discountCoupenSchema.pre('validate', function (next) {
  const hasDiscountValue = this.discountValue || this.discountValueUSD;
  const hasDiscountPercentage = this.discountPercentage;

  if (hasDiscountValue && hasDiscountPercentage) {
    const error = new Error('You cannot set both discountValue (or discountValueUSD) and discountPercentage.');
    return next(error);
  }

  next();
});

const DiscountCoupon = mongoose.model("DiscountCoupon", discountCoupenSchema);
export default DiscountCoupon;
