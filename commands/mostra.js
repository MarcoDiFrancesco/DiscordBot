import Player from "../models/Player.js";
import Clan from "../models/Clan.js";

const sendClanTable = async (message, clan) => {
  const players = await Player.find({ clan: clan });
  // TODO: get it from somewhere
  let clanConfirmedEmoji, clanConfirmedText, footerText, color;
  if (clan.confirmed) {
    clanConfirmedEmoji = ":white_check_mark:";
    clanConfirmedText = "Sì";
    footerText = `Il clan è stato confermato`;
    color = "0x77B155";
  } else {
    clanConfirmedEmoji = ":x:";
    clanConfirmedText = "No";
    footerText = `Il clan NON è ancora stato confermato`;
    color = "0x0099ff";
  }

  const exampleEmbed = {
    inline: true,
    color: color,
    // title: `Iscrizione al torneo ${eventName}`,
    author: {
      name: "MPM community bot",
      icon_url: "https://i.imgur.com/wSTFkRM.png",
      // url: 'https://discord.js.org',
    },
    description: `:trophy: Clan: ${clan.name} (#${clan.tag})\n${clanConfirmedEmoji} Partecipazione confermata: ${clanConfirmedText}`,
    thumbnail: {
      url: "https://i.imgur.com/wSTFkRM.png",
    },
    fields: getMainText(players, clan),
    timestamp: new Date(),
    footer: {
      // TODO: test is prefix show correctly
      text: footerText,
    },
  };
  await message.author.send({ embed: exampleEmbed });
};

const getMainText = (players, clan) => {
  let values = [];
  const numbers = [
    ":one:",
    ":two:",
    ":three:",
    ":four:",
    ":five:",
    ":six:",
    ":seven:",
    ":eight:",
    ":nine:",
    ":keycap_ten:",
  ];
  let counter = 0;
  for (const number of numbers) {
    let str = "";
    str += number;
    if (players[counter]) {
      str += `⠀\`${players[counter].tag}\``;
      str += " ";
      for (let i = 0; i < 9 - players[counter].tag.length; i++) {
        str += "  ";
      }
      str += players[counter].name;
    } else {
      str += "⠀-⠀⠀⠀⠀⠀⠀⠀-";
    }
    counter += 1;
    values.push(str);
  }
  if (!clan.confirmed) {
    values.push("");
    values.push("Comandi:");
    values.push(`:arrow_forward: \`${process.env.PREFIX}aggiungi PLAYERTAG\``);
    values.push(`:arrow_forward: \`${process.env.PREFIX}rimuovi PLAYERTAG\``);
    values.push(`:arrow_forward: \`${process.env.PREFIX}conferma\``);
    values.push(`:arrow_forward: \`${process.env.PREFIX}help\``);
  } else {
    values.push("");
    values.push("Il clan è stato confermato, se devi modificare player contatta gli admin")
  }
  return [
    {
      name: "⠀⠀⠀Tag⠀⠀⠀⠀⠀Nome",
      value: values,
    },
  ];
};

const execute = async (message, args) => {
  const exapleMessage = `Scrivi ad esempio \`${process.env.PREFIX}${name} #A33BL422\``;
  const clanTag = args[0];
  if (args.length < 1) {
    return message.reply(
      `non hai specificato il tag di alcun clan! ${exapleMessage}`
    );
  } else if (args.length > 1) {
    return message.reply(`hai specificato troppi argomenti! ${exapleMessage}`);
  } else {
    const clan = await Clan.exists({ tag: clanTag });
    if (!clan) {
      return message.reply(`questo clan non è registrato al torneo!`);
    }
  }

  const clan = await Clan.findOne({ tag: args[0] });
  sendClanTable(message, clan);
};

export const name = "mostra";
export const aliases = [];
export { execute };
export { sendClanTable };
