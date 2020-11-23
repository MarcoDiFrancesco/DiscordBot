import Clan from '../models/Clan.js'
import {sendClanTable} from './mostra.js'
const subscribeClan = async (clanTag, author_id) => {

  const clan = new Clan({
    tag: clanTag,
    author: author_id
  });
  clan.save();
  console.log(clan);
}

const execute = async (message, args) => {
  const clanTag = args[0];
  let exapleMessage = `Scrivi ad esempio \`${process.env.PREFIX}${name} #A33BL422\``;
  if (args.length < 1) {
    return message.reply(`non hai specificato il tag di alcun clan! ${exapleMessage}`);
  } else if (args.length > 1) {
    return message.reply(`hai specificato troppi argomenti! ${exapleMessage}`);
  } else if (!clanTag.startsWith("#")) {
    return message.reply(`non hai specificato il un tag clan valido! ${exapleMessage}`);
  } else {
    const clan = await Clan.exists({ tag: clanTag });
    if (clan) {
      return message.reply(`Il clan è già stato registrato da ${clan.author}, scrivi \`${process.env.PREFIX}mostra ${clanTag}\` per visualizzare i partecipanti`);
    }
  }
  message.reply(`iscrivi il clan nella nuova chat creata!`);

  // TODO: get it from somewhere
  const eventName = "EVENT_NAME";
  
  const exampleTag = "#A8I9GIH2";

  subscribeClan(clanTag, message.author.id);

  // TODO: get it from COC api
  const clanName = "CLAN_NAME";

  await message.author.send([
    "Ciao! Sono il bot di MPM community.",
    `Benvenuto alla competizione **${eventName}**, stai iscrivendo il clan ${clanName} (${clanTag}).`,
  ]);

  await sendClanTable(message, args);

  await message.author.send(
    [`Modifica i parecipanti utilizzando questi comandi:`,
      `\`${process.env.PREFIX}aggiungi ${exampleTag}\``,
      `\`${process.env.PREFIX}cancella ${exampleTag}\``
    ]
  );

}

export const name = "iscrivi";
export const aliases = ["subscribe", "iscrizione", "partecipo"]
export { execute };
