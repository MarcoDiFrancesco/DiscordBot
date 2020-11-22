import mongoose from 'mongoose';

const Player = mongoose.Schema({
  id: String,
  tag: String,
  name: String
});

export default mongoose.model("Player", Player);