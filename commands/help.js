export const name = "help";
export const aliases = ["aiuto"]
export const execute = async (message, args) => {
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
  return message.channel.send(text);
}