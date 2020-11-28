import Clan from '../models/Clan.js'
import { sendClanTable } from './mostra.js'

const subscribeClan = async (author_id, clanTag) => {
  const clan = new Clan({
    tag: clanTag,
    author: author_id
  });
  await clan.save();
  return clan;
}

const execute = async (message, args) => {
  const clanTag = args[0];
  let exapleMessage = `Scrivi ad esempio \`${process.env.PREFIX}${name} A3I8L42I\``;
  if (args.length < 1) {
    return message.reply(`:x: Non hai specificato il tag di alcun clan! ${exapleMessage}`);
  }
  if (args.length > 1) {
    return message.reply(`:x: Hai specificato troppi argomenti! ${exapleMessage}`);
  }
  let clan = await Clan.findOne({ tag: clanTag });
  if (clan) {
    return message.reply(`:x: Il clan è già stato registrato da ${clan.author}, scrivi \`${process.env.PREFIX}mostra ${clanTag}\` per visualizzare i partecipanti`);
  }
  clan = await Clan.findOne({ author: message.author.id });
  if (clan) {
    await message.reply(`:x: Stai già registrando il clan ${clan.name} (${clan.tag})`);
    return sendClanTable(message, clan);
  }

  if (message.guild) {
    message.reply(`iscrivi il clan nella nuova chat creata!`);
  }

  // TODO: get it from somewhere
  const eventName = "EVENT_NAME";

  clan = subscribeClan(message.author.id, clanTag);

  // TODO: get it from COC api
  const clanName = "CLAN_NAME";

  await message.author.send([
    `:fire: Benvenuto alla competizione **${eventName}**, stai iscrivendo il clan ${clanName} (${clanTag}).`,
  ]);

  await sendClanTable(message, clan);

  await message.author.send(
    [
      `Modifica i parecipanti utilizzando questi comandi:`,
      `\`aggiungi A8I9GIH2\` specificando il tag del player da aggiungere al torneo`,
      `\`riumuovi A8I9GIH2\` specificando il tag del player da rimuovere dal torneo`
    ]
  );
}
export const name = "iscrivi";
export const aliases = ["subscribe", "iscrizione", "partecipo"]
export { execute };
