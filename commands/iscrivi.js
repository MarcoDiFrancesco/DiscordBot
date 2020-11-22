import Player from '../models/Player.js'
import Discord from 'discord.js'
export const name = "iscrivi";
export const aliases = ["subscribe", "iscrizione"]
export const execute = async (message, args) => {
  let text;
  let exapleMessage = `Scrivi ad esempio \`${process.env.PREFIX}${name} #A33BL422\``;
  if (args.length < 1) {
    text = `non hai specificato il tag di alcun clan! ${exapleMessage}`;
  } else if (args.length > 1) {
    text = `hai specificato troppi argomenti! ${exapleMessage}`;
  } else if (!args[0].startsWith("#")) {
    text = `non hai specificato il un tag clan valido! ${exapleMessage}`
  } else {
    text = `iscrivi il clan nella nuova chat creata!`
    const eventName = "EVENT_NAME";
    const clanName = "CLAN_NAME"
    const clanTag = "CLAN_TAG";
    const exampleTag = "#A8I9GIH"

    await message.author.send([
      "Ciao! Sono il bot di MPM community.",
      `Hai deciso di iscrivere il tuo clan all'evento **${eventName}**`,
      ``,
      `Modifica i parecipanti utilizzando questi comandi:`,
      ` - \`${process.env.PREFIX}aggiungi ${exampleTag}\``,
      ` - \`${process.env.PREFIX}cancella ${exampleTag}\``
    ]);

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

    await message.author.send({ embed: exampleEmbed });
  }
  return message.reply(text);
}