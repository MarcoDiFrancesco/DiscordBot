import mongoose from 'mongoose';

const Clan = mongoose.Schema({
  tag: String,
  name: {
    type: String,
    default: ""
  },
  representatives: [ String ],
  confirmed: Boolean
});

export default mongoose.model("Clan", Clan);