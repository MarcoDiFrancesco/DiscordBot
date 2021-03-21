import Clan from "../models/Clan.js";
import Player from "../models/Player.js";
import { aggiungiChecks } from "./aggiungi.js";
import { sendClanTable } from "./mostra.js";

export const execute = async (message, args, api) => {
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
  if (player) {
    if (player.primary) {
      await message.author.send(`:x: Questo player è impostato come player primario! Se vuoi impostarlo come secondario devi prima rimuoverlo`);
      await sendClanTable(message, clan);
      return;
    }
    if (String(player.clan) === String(clan._id)) {
      await message.author.send(`:x: Hai già impostato questo player come player secondario!`);
      await sendClanTable(message, clan);
      return;
    }
    await message.author.send(
      `:x: Il player è già stato aggiunto in un altro clan`
    );
    await sendClanTable(message, clan);
    return;
  }

  let [status, apiPlayer] = await api.getPlayer(playerTag);
  if (status === 404) {
    await message.author.send(`:x: Il player con tag #${playerTag} non esiste`);
    await sendClanTable(message, clan);
    return;
  }
  if (status !== 200) {
    console.error("COC API key not accepted");
    await message.author.send(
      ":exclamation: C'è stato un problema nei nostri server, contatta gentilmente gli admin :exclamation:"
    );
    return;
  }
  const playerName = apiPlayer.name;
  player = await Player.findOne({ clan: clan, primary: false });
  if (!player) {
    player = new Player({ tag: playerTag, name: playerName, primary: false, clan: clan });
  } else {
    player.tag = playerTag
    player.name = playerName
  }
  await player.save();
  await message.author.send(
    `:white_check_mark: **${player.name}** (${player.tag}) impostato come player secondario`
  );
  await sendClanTable(message, clan);
};

export const name = "account-secondario";
export const aliases = [];
