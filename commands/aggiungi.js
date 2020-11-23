import Player from '../models/Player.js'
import Clan from '../models/Clan.js'
import {sendClanTable} from './mostra.js'

export const name = "aggiungi";
export const aliases = ["add"]
export const execute = async (message, args) => {
  let clan = await Clan.findOne({ author: message.author.id });
  if (!clan) {
    message.reply(`Non hai ancora iscritto un clan! Utilizza il comando \`${process.env.PREFIX}iscrivi #F3893839A\` per iscriverne uno`);
  }
  console.log(clan);
  const playerName = "TEST";
  const playerTag = args[0];
  const player = new Player({tag: playerTag, name: playerName});
  clan.players.push(player);
  await Clan.findOneAndReplace({_id: clan._id}, {clan});
  sendClanTable(message, clan.tag);
}