import mongoose from 'mongoose';

const Clan = mongoose.Schema({
  tag: String,
  name: {
    type: String,
    default: ""
  },
  author: String,
  confirmed: Boolean,
  players: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player'
    }
  ]
});

export default mongoose.model("Clan", Clan);