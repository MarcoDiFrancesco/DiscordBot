import Player from '../models/Player.js'

export const name = "help";
export const aliases = ["aiuto"]
export const execute = async (message, args) => {
  // if (!args.length) {
  //   return message.channel.send("Non hai specificato alcun argomento!");
  // }
  const text = [
    `Questa è la lista (scrivi i comandi con \`${process.env.PREFIX}\` davanti)`,
    "**iscrivi**: fa questo",
    "Esempi:",
    " - `!iscrivi gigi`",
    " - `!iscrivi altro`",
    "**qualcosa**: fa questo",
    "Esempi:",
    " - `!qualcosa aga`",
    " - `!qualcosa aaaa`",
    "**altro**: fa questo",
  ]
  const player = new Player({_id: message.author.id, name: "something"});
  await player.save();
  return message.channel.send(text);
}