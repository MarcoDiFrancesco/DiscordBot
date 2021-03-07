import Player from "../models/Player.js";
import Clan from "../models/Clan.js";
import { sendClanTable } from "./mostra.js";
import fetch, { Headers } from "node-fetch";

const execute = async (message, args) => {
  const clan = await Clan.findOne({
    representatives: { $in: [message.author.id] },
  });
  // If there is any error in the checks
  if (await aggiungiChecks(message, args, clan)) {
    return;
  }
  const playerTag = args[0].toUpperCase();
  let player = await Player.findOne({ tag: playerTag });
  if (player) {
    // TODO: test these 2 cases
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

  let res = await fetch(
    `https://api.clashofclans.com/v1/players/%23${playerTag}`,
    {
      headers: new Headers({
        Accept: "application/json",
        Authorization: `Bearer ${process.env.COC_API_TOKEN}`,
      }),
    }
  );
  if (res.status === 404) {
    await message.author.send(`:x: Il player con tag ${playerTag} non esiste`);
    await sendClanTable(message, clan);
    return;
  }
  if (res.status !== 200) {
    await message.author.send(
      ":exclamation: C'è stato un problema nei nostri server, contatta gentilmente gli admin :exclamation:"
    );
    return;
  }
  res = await res.json();
  const playerName = res.name;
  player = new Player({ tag: playerTag, name: playerName, clan: clan });
  await player.save();
  message.author.send(
    `:white_check_mark: Aggiunto **${player.name}** (${player.tag})`
  );
  await sendClanTable(message, clan);
};

export const aggiungiChecks = async (message, args, clan) => {
  let exapleMessage = `Scrivi ad esempio \`${process.env.PREFIX}${name} A3I8L42I\``;
  if (message.guild) {
    const text = [`:x: Non utilizzare questo comando fuori dalla chat privata`];
    await message.channel.send(text);
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
  // Check if tag contains non-correct characters
  if (!/^[0-9a-zA-Z]+$/.test(args[0])) {
    message.author.send(`:x: Inserisci solo lettere e numeri come tag clan`);
    return true;
  }
  if (!clan) {
    message.author.send(
      `:x: Non hai ancora iscritto un clan! Utilizza il comando \`${process.env.PREFIX}iscrivi F3893839A\` per iscriverne uno`
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
export { execute };
