import Player from '../models/Player.js'
import Clan from '../models/Clan.js'

const sendClanTable = async (message, clan) => {
  const players = await Player.find({ clan: clan })
  const exampleTag = "#A8I9GIH2";
  const clanName = "CLAN_NAME_TODO_GET_IT";
  const eventName = "CLAN_NAME_TODO_GET_IT";

  const values = []
  for (const player of players) {
    values.push(`${player.name} (${player.tag})`);
  }
  const fields = [
    {
      name: 'Players',
      value: values
    }
  ]

  const exampleEmbed = {
    color: 0x0099ff,
    // title: `Iscrizione al torneo ${eventName}`,
    author: {
      name: 'MPM community bot',
      icon_url: 'https://i.imgur.com/wSTFkRM.png',
      // url: 'https://discord.js.org',
    },
    description: `🏆 Torneo: ${eventName}\n⚡ Clan: ${clanName} (${clan.tag})`,
    thumbnail: {
      url: 'https://i.imgur.com/wSTFkRM.png',
    },
    fields: fields,
    timestamp: new Date(),
    footer: {
      text: '?help per visualizzare i comandi',
    }
  };
  await message.reply({ embed: exampleEmbed });
}

const execute = async (message, args) => {
  const exapleMessage = `Scrivi ad esempio \`${process.env.PREFIX}${name} #A33BL422\``;
  const clanTag = args[0]
  if (args.length < 1) {
    return message.reply(`non hai specificato il tag di alcun clan! ${exapleMessage}`);
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
}

export const name = "mostra";
export const aliases = ["show"]
export { execute }
export { sendClanTable };
