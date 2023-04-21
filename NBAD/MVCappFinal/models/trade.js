const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var tradeSchema = new Schema(
  {
    offeredItem: { type: String, required: true },
    wantedItem: { type: String, required: true },
    offered_user: { type: String, required: true },
    wanted_user: { type: String, required: true },
    offeredItemStatus: { type: String, required: true },
    wantedItemStatus: { type: String, required: true },
    offeredItemCategory: { type: String, required: true },
    wantedItemCategory: { type: String, required: true },
    offeredId: { type: String, required: true },
    wantedId: { type: String, required: true },
    accepted: { type: Boolean },
  },
  { timestamps: true }
);

module.exports = mongoose.model("trade", tradeSchema);
