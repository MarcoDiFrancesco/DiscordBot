import Player from "../models/Player.js";
import Clan from "../models/Clan.js";
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
    if (String(player.clan) === String(clan._id)) {
      await message.author.send(`:x: Hai già aggiunto questo player`);
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
  player = new Player({ tag: playerTag, name: playerName, clan: clan });
  await player.save();
  await message.author.send(
    `:white_check_mark: Aggiunto **${player.name}** (${player.tag})`
  );
  await sendClanTable(message, clan);
};

export const aggiungiChecks = async (message, args, clan, playerTag) => {
  let exapleMessage = `Scrivi ad esempio \`${process.env.PREFIX}${name} #TAGPLAYER\``;
  if (message.guild) {
    await message.channel.send(`:x: Non utilizzare questo comando fuori dalla chat privata`);
    return true;
  }
  if (args.length < 1) {
    message.author.send(
      `:x: Non hai specificato il tag di alcun player! ${exapleMessage}`
    );
    return true;
  }
  if (args.length > 1) {
    message.author.send(
      `:x: Hai specificato troppi argomenti! ${exapleMessage}`
    );
    return true;
  }
  playerTag = playerTag.toUpperCase();
  if (playerTag.startsWith("#")) {
    playerTag = playerTag.substring(1);
  }
  if (playerTag && (playerTag.length < 6 || playerTag.length > 10)) {
    await message.author.send(`:x: Il tag di questo player non esiste!`);
    await sendClanTable(message, clan);
    return true;
  }
  // Check if tag contains non-correct characters
  if (!/^[0-9a-zA-Z]+$/.test(playerTag)) {
    message.author.send(`:x: Inserisci solo lettere e numeri come tag clan`);
    return true;
  }
  if (!clan) {
    message.author.send(
      `:x: Non hai ancora iscritto un clan! Utilizza il comando \`${process.env.PREFIX}iscrivi F3893839A\` nella chat globale per iscriverne uno`
    );
    return true;
  }
  if (clan.confirmed) {
    message.author.send(
      ":x: Il clan è già stato confermato, se vuoi modificare i player contatta gli admin"
    );
    await sendClanTable(message, clan);
    return true;
  }
};

export const name = "aggiungi";
export const aliases = [];
