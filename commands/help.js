export const name = "help";
export const aliases = ["aiuto", "comandi"]
export const execute = async (message, args) => {
  const text = [
    `:boom: Sono il bot per le iscrizioni ai tornei :boom:`,
    ``,
    `Utilizza il comando   \`${process.env.PREFIX}iscrivi ED71G8Y9L\`   specificando il tag del tuo clan per iniziare l'iscrizione`,
  ]
  return message.channel.send(text);
}