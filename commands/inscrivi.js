export const name = "inscrivi";
export const aliases = []
export const execute = async (message, args) => {
  const text = [
    `:boom: Sono il bot per le iscrizioni ai tornei :boom:`,
    ``,
    `Utilizza il comando  \`${process.env.PREFIX}iscrivi ED71G8Y9L\`  senza la **n**  :wink:`,
  ]
  return message.channel.send(text);
}