import mongoose from "mongoose";

const Clan = mongoose.Schema({
  tag: String,
  name: String,
  representatives: [Number],
  confirmed: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model("Clan", Clan);
