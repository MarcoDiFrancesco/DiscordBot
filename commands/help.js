export const name = "help";
export const description = "Returns latency of the server";
export const aliases = ["aiuto"]
export function execute(message, args) {
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
  message.channel.send(text);
}
