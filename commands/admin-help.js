import Clan from "../models/Clan.js";
import Command from "../classes/Command.js";

export const execute = async (msg, args, api) => {
  const cmd = new Command(name, argsRule, msg, args, api);
  if (cmd.permissionChecks()) return;
  if (cmd.argsCheck()) return;

  const text = [
    `:arrow_forward: \`${process.env.PREFIX}admin-aggiungi #TAGPLAYER #TAGPLAYER\` iscrive il player al clan`,
    `:arrow_forward: \`${process.env.PREFIX}admin-rimuovi #TAGPLAYER\` disiscrive il player dal torneo (il clan non è necessario dato che 1 player può essere iscritto a 1 solo clan)`,
    `:arrow_forward: \`${process.env.PREFIX}admin-account-secondario #TAGPLAYER #TAGPLAYER\` (NON IMPLEMENTATO) imposta l'acocunt come profilo secondario al clan`,
    `:arrow_forward: \`${process.env.PREFIX}admin-conferma #TAGCLAN\` (NON IMPLEMENTATO) conferma l'iscrizione del clan`,
  ];
  cmd.send(text);
};

const argsRule = [];
export const name = "admin-help";
export const aliases = ["help-admin"];
