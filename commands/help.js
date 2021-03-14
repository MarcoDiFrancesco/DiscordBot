import Clan from "../models/Clan.js";
import { sendClanTable } from "./mostra.js";

export const name = "help";
export const aliases = ["aiuto", "comandi"];
export const execute = async (message) => {
  // Direct message
  if (!message.guild) {
    let clan = await Clan.findOne({
      representatives: { $in: [message.author.id] },
    });
    if (!clan) {
      // The user is trying to subscribe the clan in the private chat
      const text = [
        `:x: Iscrivi il tuo clan nella **Chat globale** utilizzando il comando \`${process.env.PREFIX}iscrivi ED71G8Y9L\``,
      ];
      await message.author.send(text);
      return;
    }
    await sendClanTable(message, clan);
    await message.author.send(helpCommands);
    return;
  }

  const text = [
    `:boom: Sono il bot per le iscrizioni ai tornei MPM :boom:`,
    `Utilizza il comando  \`${process.env.PREFIX}iscrivi ED71G8Y9L\`  specificando il tag del tuo clan per iniziare l'iscrizione`,
  ];
  await message.channel.send(text);
};

export const helpCommands = [
  `:arrow_forward: \`${process.env.PREFIX}aggiungi PLAYERTAG\` specificando il tag del player che parteciperà al torneo`,
  `:arrow_forward: \`${process.env.PREFIX}rimuovi PLAYERTAG\` per disiscrivere un player dal torneo`,
  `:arrow_forward: \`${process.env.PREFIX}conferma\` per confermare l'iscrizione di questi player al torneo, una volta confermato non sarà più possibile cambiare i player`,
]