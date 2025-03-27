import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: true,
    },
    subCategories: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Category",
      },
    ],
    quantity: {
      type: Number,
      required: true,
      min: [0, "Quantity cannot be less than zero"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    ratings: {
      type: Number,
      default: 0,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    tags: [String],
    specifications: [
      {
        key: String,
        value: String,
      },
    ],
    variants: [
      {
        name: String,
        options: [String],
      },
    ],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

productSchema.pre("remove", async function (next) {
  await this.model("Review").deleteMany({ product: this._id });
  next();
});

productSchema.statics.getAverageRating = async function (productId) {
  const obj = await this.aggregate([
    {
      $match: { product: productId },
    },
    {
      $group: {
        _id: "$product",
        averageRating: { $avg: "$rating" },
      },
    },
  ]);

  try {
    await this.model("Product").findByIdAndUpdate(productId, {
      ratings: obj[0] ? obj[0].averageRating : 0,
    });
  } catch (error) {
    console.error(error);
  }
};

const Product = mongoose.model("Product", productSchema);
export default Product;
