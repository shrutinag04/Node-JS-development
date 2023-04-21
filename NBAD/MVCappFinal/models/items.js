const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const itemSchema = new Schema(
  {
    //id:{type:},
    name: { type: String, required: [true, "name is required"] },
    category: { type: String, required: [true, "category is required"] },
    details: {
      type: String,
      required: [true, "details are required"],
      minLength: [10, "the content should have at least 10 characters"],
    },
    status: { type: String, required: [true, "status is required"] },
    image: { type: String, required: [true, "image is required"] },
    year: { type: String, required: [true, "year is required"] },
    author: { type: Schema.Types.ObjectId, ref: "User" },
    watch: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("items", itemSchema);
