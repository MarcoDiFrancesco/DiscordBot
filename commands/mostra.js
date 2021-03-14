import Player from "../models/Player.js";
import Clan from "../models/Clan.js";

const sendClanTable = async (message, clan, isMostraCommand) => {
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
    footerText = `Clan NON confermato`;
    color = "0x0099ff";
  }

  const exampleEmbed = {
    inline: true,
    color: color,
    // title: `Iscrizione al torneo ${eventName}`,
    author: {
      name: "MPM bot",
      icon_url: "https://i.imgur.com/OyUTcF7.png",
      // url: 'https://discord.js.org',
    },
    // description: `:trophy: Clan: ${clan.name} (#${clan.tag})\n${clanConfirmedEmoji} Partecipazione confermata: ${clanConfirmedText}`,
    description: `:trophy: Clan: ${clan.name}\n${clanConfirmedEmoji} Partecipazione confermata: ${clanConfirmedText}`,
    thumbnail: {
      url: "https://i.imgur.com/OyUTcF7.png",
    },
    fields: getMainText(players, clan, isMostraCommand),
    timestamp: new Date(),
    footer: {
      // TODO: test is prefix show correctly
      text: footerText,
    },
  };
  await message.author.send({ embed: exampleEmbed });
};

const getMainText = (players, clan, isMostraCommand) => {
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
      let name = players[counter].name;
      if (name.length > 9) {
        name = name.substring(0, 9);
        name += "..";
      }
      str += name;
    } else {
      str += "⠀-⠀⠀⠀⠀⠀⠀⠀-";
    }
    counter += 1;
    values.push(str);
  }

    values.push("**⠀⠀⠀Account secondario**");
    values.push(`:white_circle:⠀\`FJDKJFDK\` NOMEEEEE`);
  if (!isMostraCommand)  {
    if (!clan.confirmed) {
      values.push("");
      values.push("Comandi:");
      values.push(
        `:arrow_forward: \`${process.env.PREFIX}aggiungi PLAYERTAG\``
      );
      values.push(`:arrow_forward: \`${process.env.PREFIX}rimuovi PLAYERTAG\``);
      values.push(`:white_circle: \`${process.env.PREFIX}account-secondario PLAYERTAG\``);
      if (players.length < 5) {
        values.push(
          `:ok: ~~\`${process.env.PREFIX}conferma\`~~ (5 player richiesti)`
        );
      } else {
        values.push(`:ok: \`${process.env.PREFIX}conferma\``);
      }
      values.push(`:grey_question: \`${process.env.PREFIX}help\``);
    } else {
      values.push("");
      values.push(
        "Clan confermato, se vuoi modificare player contatta gli admin"
      );
    }
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
  if (args.length < 1) {
    message.reply(
      `:x: Non hai specificato il tag di alcun clan! ${exapleMessage}`
    );
    return;
  }
  if (args.length > 1) {
    message.reply(`hai specificato troppi argomenti! ${exapleMessage}`);
    return;
  }
  let clanTag = args[0];
  clanTag = clanTag.toUpperCase();
  if (clanTag.startsWith("#")) {
    clanTag = clanTag.substring(1);
  }
  if (clanTag && (clanTag.length < 6 || clanTag.length > 10)) {
    message.reply(`:x: Il tag di questo clan non esiste!`);
    return;
  }
  // Check if tag contains non-correct characters
  if (!/^[0-9a-zA-Z]+$/.test(clanTag)) {
    message.reply(`:x: Inserisci solo lettere e numeri come tag clan`);
    return;
  }
  const clan = await Clan.findOne({ tag: clanTag });
  if (!clan) {
    message.reply(`:x: Questo clan non è registrato al torneo!`);
    return;
  }
  sendClanTable(message, clan, true);
};

export const name = "mostra";
export const aliases = [];
export { execute };
export { sendClanTable };
