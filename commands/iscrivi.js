import Clan from "../models/Clan.js";
import { sendClanTable } from "./mostra.js";
import fetch, { Headers } from "node-fetch";

const execute = async (message, args) => {
  if (!message.guild) {
    await message.author.send(
      ":x: Utilizza questo comando nella chat globale!"
    );
    return;
  }
  let exapleMessage = `Scrivi ad esempio \`${process.env.PREFIX}iscrivi A3I8L42I\``;
  if (args.length < 1) {
    return message.reply(
      `:x: Non hai specificato il tag del clan! ${exapleMessage}`
    );
  }
  if (args.length > 1) {
    return message.reply(
      `:x: Hai specificato troppi argomenti! ${exapleMessage}`
    );
  }

  const clanTag = args[0].toUpperCase();
  // TODO: clean clanTag from bold, italic, emoji, lowercase

  // Check if clan was subscribed by someone else
  let clan = await Clan.findOne({ tag: clanTag });
  if (clan) {
    if (clan.representatives.includes(message.author.id)) {
      await message.reply(
        `:x: Stai già iscrivendo questo clan, utilizza la chat privata per modificare i partecipanti`
      );
      await message.author.send(
        ":white_check_mark: Utilizza questa chat per modificare i player"
      );
      return;
    }
    return message.reply(
      `:x: Il clan è già stato iscritto da <@${clan.representatives[0]}>`
    );
  }

  // Check if user has subscribed another clan
  clan = await Clan.findOne({ representatives: { $in: [message.author.id] } });
  if (clan) {
    await message.reply(
      `:x: Stai già registrando il clan **${clan.name}** (${clan.tag})`
    );
    await message.author.send(
      ":white_check_mark: Utilizza questa chat per modificare i player"
    );
    return;
  }

  let res = await fetch(
    `https://api.clashofclans.com/v1/players/%23${clanTag}`,
    {
      headers: new Headers({
        Accept: "application/json",
        Authorization: `Bearer ${process.env.COC_API_TOKEN}`,
      }),
    }
  );
  if (res.status === 404) {
    await message.reply(`:x: Il clan con tag ${clanTag} non esiste`);
    return;
  }
  if (res.status !== 200) {
    await message.reply(
      ":exclamation: C'è stato un problema nei nostri server, contatta gentilmente gli admin :exclamation:"
    );
    return;
  }
  res = await res.json();
  const clanName = res.name;
  clan = new Clan({
    tag: clanTag,
    name: clanName,
    representatives: [message.author.id],
  });
  await clan.save();

  await message.reply(
    `:white_check_mark: Iscrivi il clan **${clanName}** nella nuova chat creata!`
  );
  await message.author.send(
    `:fire: Benvenuto alla toreo organizzato da MPM :fire:`
  );
  await sendClanTable(message, clan);
};
export const name = "iscrivi";
export const aliases = [];
export { execute };
