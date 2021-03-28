import Clan from "../models/Clan.js";
import Command from "../classes/Command.js";

export const execute = async (msg, args, api) => {
  const cmd = new Command(name, argsRule, msg, args, api);
  if (cmd.adminCheck()) return;
  if (cmd.argsCheck()) return;

  const text = [
    `:arrow_forward: \`${process.env.PREFIX}admin-aggiungi #TAGPLAYER #TAGPLAYER\` iscrive player al clan`,
    `:arrow_forward: \`${process.env.PREFIX}admin-rimuovi #TAGPLAYER\` rimuove il player primario o secondario dal clan in cui è iscritto. Il clan non è necessario dato che 1 player può essere iscritto a 1 solo clan.`,
    `:arrow_forward: \`${process.env.PREFIX}admin-account-secondario #TAGPLAYER #TAGPLAYER\` imposta l'acocunt come profilo secondario al clan`,
    `:arrow_forward: \`${process.env.PREFIX}admin-conferma #TAGCLAN\` conferma l'iscrizione del clan`,
    `:arrow_forward: \`${process.env.PREFIX}admin-reset-database\` elimina tutti i clan e tutti i player dal database`,
    `:arrow_forward: \`${process.env.PREFIX}admin-restore-database STRING\` ripristina i dati nel database specificando la stringa in JSON`,
    `:arrow_forward: \`${process.env.PREFIX}admin-help\` questo comando`,
  ];
  cmd.send(text);
};

const argsRule = [];
export const name = "admin-help";
export const aliases = ["help-admin"];
