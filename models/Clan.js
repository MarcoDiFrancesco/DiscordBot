import mongoose from "mongoose";

const Clan = mongoose.Schema({
  tag: String,
  name: String,
  representatives: [Number],
  confirmed: {
    type: Boolean,
    default: false,
  },
  logo: String,
});

export default mongoose.model("Clan", Clan);
