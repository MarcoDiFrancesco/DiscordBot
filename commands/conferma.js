import Clan from "../models/Clan.js";
import Player from "../models/Player.js";
import { sendClanTable } from "./mostra.js";

export const name = "conferma";
export const aliases = ["confirm"];
export const execute = async (message) => {
  if (message.guild) {
    await message.channel.send(
      `:x: Non utilizzare questo comando fuori dalla chat privata del bot`
    );
    return;
  }
  let clan = await Clan.findOne({
    representatives: { $in: [message.author.id] },
  });
  // if (clan.confirmed) {
  //   await message.author.send(
  //     ":x: Il clan è già stato confermato, se vuoi modificare i player contatta gli admin"
  //   );
  //   await sendClanTable(message, clan);
  //   return;
  // }

  if (!clan) {
    // The user is trying to subscribe the clan in the private chat
    await message.author.send(
      `:x: Iscrivi il tuo clan nella **Chat globale** utilizzando il comando \`${process.env.PREFIX}iscrivi ED71G8Y9L\``
    );
    return;
  }
  const players = await Player.find({ clan: clan });
  const minPlayers = 5;
  if (players.length < minPlayers) {
    await message.author.send(
      `:x: Devono esserci almeno ${minPlayers} player prima di confermare il clan`
    );
    await sendClanTable(message, clan);
    return;
  }

  if (clan.confirmed) {
    await message.channel.send(
      ":x: Questo clan è già stato confermato per il torneo, se vuoi modificare i player contatta gli admin"
    );
    await sendClanTable(message, clan);
    return;
  }
  clan.confirmed = true;
  await clan.save();
  await sendClanTable(message, clan);
  return;
};
