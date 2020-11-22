import mongoose from 'mongoose';

const Clan = mongoose.Schema({
  id: String,
  tag: String,
  name: String,
  players: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player'
    }
  ]
});

export default mongoose.model("Clan", Clan);