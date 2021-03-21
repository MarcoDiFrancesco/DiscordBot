import Clan from "../models/Clan.js";
import { sendClanTable } from "./mostra.js";

const execute = async (message, args, api) => {
  if (!message.guild) {
    await message.author.send(
      ":x: Utilizza questo comando nella chat globale!"
    );
    return;
  }
  let exapleMessage = `Scrivi ad esempio \`${process.env.PREFIX}iscrivi #TAGCLAN\``;
  if (args.length < 1) {
    message.reply(`:x: Non hai specificato il tag del clan! ${exapleMessage}`);
    return;
  }
  if (args.length > 1) {
    message.reply(`:x: Hai specificato troppi argomenti! ${exapleMessage}`);
    return;
  }

  let clanTag = args[0].toUpperCase();
  if (clanTag.startsWith("#")) {
    clanTag = clanTag.substring(1);
  }
  // Check if tag contains non-correct characters
  if (!/^[0-9a-zA-Z]+$/.test(clanTag)) {
    message.reply(`:x: Inserisci solo lettere e numeri come tag clan`);
    return true;
  }

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
      `:x: Stai già registrando il clan **${clan.name}** (#${clan.tag})`
    );
    await message.author.send(
      ":white_check_mark: Utilizza questa chat per modificare i player"
    );
    return;
  }

  // This check makes sense not in the top
  if (clanTag.length < 6 || clanTag.length > 10) {
    message.reply(`:x: Il tag di questo clan non esiste!`);
    return true;
  }

  let [status, apiClan] = await api.getClan(clanTag);
  if (status === 404) {
    await message.reply(`:x: Il clan con tag #${clanTag} non esiste`);
    return;
  }
  if (status !== 200) {
    console.error("COC API key not accepted");
    await message.reply(
      ":exclamation: C'è stato un problema nei nostri server, contatta gentilmente gli admin :exclamation:"
    );
    return;
  }
  const clanName = apiClan.name;
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
    `:fire: Benvenuto al toreo organizzato da MPM :fire:\nUtilizza i comandi scritti sotto per`
  );
  await sendClanTable(message, clan);
};
export const name = "iscrivi";
export const aliases = ["iscrivo"];
export { execute };
