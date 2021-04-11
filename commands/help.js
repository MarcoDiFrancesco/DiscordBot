import { mostraClan } from "./mostra.js";
import Command from "../classes/Command.js";

export const execute = async (msg, args, api) => {
  const cmd = new Command(name, argsRule, msg, args, api);
  if (cmd.argsCheck()) return;

  // Message in group chat
  if (msg.guild) {
    const text = `Utilizza il comando  \`${process.env.PREFIX}iscrivi TAGCLAN\`  per iniziare l'iscrizione`;
    await cmd.send(text);
    return;
  }

  if (await cmd.getClanThis()) return;

  // User subscribed a clan
  await cmd.send(helpCommands);
  mostraClan(cmd);
};

export const helpCommands = [
  `:arrow_forward: \`${process.env.PREFIX}aggiungi TAGPLAYER\` iscrive il player al torneo`,
  `:arrow_forward: \`${process.env.PREFIX}rimuovi TAGPLAYER\` disiscrive il player dal torneo`,
  `:arrow_forward: \`${process.env.PREFIX}account-secondario TAGPLAYER\` aggiunge/sovrascrive il profilo secondario del clan`,
  `:arrow_forward: \`${process.env.PREFIX}conferma\` conferma l'iscrizione dei player al torneo (5 player richiesti)`,
  `:warning: Una volta confermato il clan NON sarà più possibile modificare i player`,
];

const argsRule = [];
export const name = "help";
export const aliases = ["aiuto", "comandi"];
