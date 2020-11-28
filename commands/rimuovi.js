import Player from '../models/Player.js'
import Clan from '../models/Clan.js'
import { sendClanTable } from './mostra.js'

const execute = async (message, args) => {
  const playerTag = args[0];
  let exapleMessage = `Scrivi ad esempio \`${process.env.PREFIX}${name} A3I8L42I\``;
  if (args.length < 1) {
    return message.author.send(`:x: Non hai specificato il tag di alcun player! ${exapleMessage}`);
  }
  if (args.length > 1) {
    return message.author.send(`:x: Hai specificato troppi argomenti! ${exapleMessage}`);
  }
  let clan = await Clan.findOne({ author: message.author.id });
  if (!clan) {
    return message.author.send(`:x: Non hai ancora iscritto un clan! Utilizza il comando \`${process.env.PREFIX}iscrivi #F3893839A\` per iscriverne uno`);
  }
  let player = await Player.findOne({ tag: playerTag })
  if (!player) {
    await message.author.send(`:x: Non esiste alcun player iscritto con questo tag!`);
    return sendClanTable(message, clan);
  }
  if (String(player.clan) !== String(clan._id)) {
    await message.author.send(`:x: Questo player non è iscritto al torneo in questo clan! ${exapleMessage}`)
    return sendClanTable(message, clan);
  }
  await Player.deleteOne({ tag: playerTag, clan: clan });
  sendClanTable(message, clan);
}

export const name = "rimuovi";
export const aliases = ["remove"];
export { execute };
