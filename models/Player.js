import mongoose from 'mongoose';

const Player = mongoose.Schema({
  tag: String,
  name: String,
  primary: {
    type: Boolean,
    default: True
  },
  clan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Clan'
  },
});

export default mongoose.model("Player", Player);