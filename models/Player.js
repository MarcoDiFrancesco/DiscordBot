import mongoose from 'mongoose';

const Player = mongoose.Schema({
  id: String,
  tag: String,
  name: String,
  clan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Clan'
  }
});

export default mongoose.model("Player", Player);