import Clan from "../models/Clan.js";
import Player from "../models/Player.js";
import { aggiungiChecks } from "./aggiungi.js";
import { sendClanTable } from "./mostra.js";

const execute = async (message, args) => {
  const clan = await Clan.findOne({
    representatives: { $in: [message.author.id] },
  });
  let playerTag = args[0];
  if (await aggiungiChecks(message, args, clan, playerTag)) {
    return;
  }
  playerTag = playerTag.toUpperCase();
  if (playerTag.startsWith("#")) {
    playerTag = playerTag.substring(1);
  }
  let player = await Player.findOne({ tag: playerTag });
  if (!player) {
    await message.author.send(
      `:x: Non esiste alcun player iscritto con questo tag!`
    );
    await sendClanTable(message, clan);
    return;
  }
  if (String(player.clan) !== String(clan._id)) {
    await message.author.send(
      `:x: Questo player non è iscritto al torneo in questo clan! ${exapleMessage}`
    );
    await sendClanTable(message, clan);
    return;
  }
  await Player.deleteOne({ tag: playerTag, clan: clan });
  message.author.send(
    `:white_check_mark: Rimosso **${player.name}** (${player.tag})`
  );
  await sendClanTable(message, clan);
};

export const name = "rimuovi";
export const aliases = ["remove"];
export { execute };
