import Player from '../models/Player.js'
import Clan from '../models/Clan.js'

const sendClanTable = async (message, args) => {
  const exapleMessage = `Scrivi ad esempio \`${process.env.PREFIX}${name} #A33BL422\``;

  if (args.length < 1) {
    return message.reply(`non hai specificato il tag di alcun clan! ${exapleMessage}`);
  } else if (args.length > 1) {
    return message.reply(`hai specificato troppi argomenti! ${exapleMessage}`);
  } else if (!args[0].startsWith("#")) {
    return message.reply(`non hai specificato il un tag clan valido! ${exapleMessage}`);
  } else {
    const clan = await Clan.exists({ tag: args[0] });
    if (!clan) {
      return message.reply(`questo clan non è registrato al torneo!`);
    }
  }

  const clanTag = args[0];
  const exampleTag = "#A8I9GIH2";
  const clanName = "CLAN_NAME_TODO_GET_IT";
  const eventName = "CLAN_NAME_TODO_GET_IT";

  const clan = await Clan.findOne({ tag: clanTag });

  const exampleEmbed = {
    color: 0x0099ff,
    // title: `Iscrizione al torneo ${eventName}`,
    author: {
      name: 'MPM community bot',
      // icon_url: 'https://i.imgur.com/wSTFkRM.png',
      // url: 'https://discord.js.org',
    },
    description: `🏆 Torneo: ${eventName}\n⚡ Clan: ${clanName} (${clanTag})`,
    // thumbnail: {
    //   url: 'https://i.imgur.com/wSTFkRM.png',
    // },
    fields: [
      {
        name: 'ID',
        value: [
          '1',
          '2',
          '3',
          '4',
          '5'
        ],
        // value: clan.players.map(player => (
        //   player
        // )),
        inline: true
      },
      {
        name: 'Tag',
        value: [
          `${exampleTag}`,
          `${exampleTag}`,
          `${exampleTag}`,
          `${exampleTag}`,
          `${exampleTag}`
        ],
        inline: true
      },
      {
        name: 'Nome',
        value: [
          'Nome1',
          'Nome2',
          'Nome3',
          'Nome4',
          'Nome5'
        ],
        inline: true
      }
    ],
    timestamp: new Date(),
    footer: {
      text: '?help per visualizzare i comandi',
    }
  };
  await message.reply({ embed: exampleEmbed });
}

export const name = "mostra";
export const aliases = ["show"]
export const execute = async (message, args) => {
  sendClanTable(message, args);
}
export { sendClanTable };