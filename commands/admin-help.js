import Clan from "../models/Clan.js";
import Command from "../classes/Command.js";

export const execute = async (msg, args, api) => {
  const cmd = new Command(name, argsRule, msg, args, api);
  if (cmd.adminCheck()) return;
  if (cmd.argsCheck()) return;

  const text = [
    `:arrow_forward: \`${process.env.PREFIX}admin-aggiungi #TAGCLAN #TAGPLAYER\` iscrive player al clan`,
    `:arrow_forward: \`${process.env.PREFIX}admin-rimuovi #TAGPLAYER\` rimuove il player primario o secondario dal clan in cui è iscritto. Il clan non è necessario dato che 1 player può essere iscritto a 1 solo clan`,
    `:arrow_forward: \`${process.env.PREFIX}admin-rimuovi-clan #TAGCLAN\` rimuove il clan e i player iscritti`,
    `:arrow_forward: \`${process.env.PREFIX}admin-account-secondario #TAGCLAN #TAGPLAYER\` imposta/sovrascrive l'account come profilo secondario al clan`,
    `:arrow_forward: \`${process.env.PREFIX}admin-conferma #TAGCLAN\` aggiungi/rimuovi la conferma del clan. Il clan può essere confermato dagli admin anche se non ha il minimo numero di player richiesto (dal comando \`${process.env.PREFIX}conferma #TAGCLAN\`)`,
    `:arrow_forward: \`${process.env.PREFIX}admin-logo #TAGCLAN LINK\` aggiungi/aggiorna il logo del clan`,
    `:arrow_forward: \`${process.env.PREFIX}admin-mostra-tutto\` invia tutti i roaster e cancella tutti i roaster vecchi presenti nella chat`,
    `:arrow_forward: \`${process.env.PREFIX}admin-reset-database\`  elimina tutti i clan e tutti i player dal database`,
    `:arrow_forward: \`${process.env.PREFIX}admin-restore-database STRING\` ripristina i dati nel database in caso admin-reset-database fosse stato utilizzato erroneamente`,
    `:arrow_forward: \`${process.env.PREFIX}admin-help\` questo comando`,
  ];
  cmd.send(text);
};

const argsRule = [];
export const name = "admin-help";
export const aliases = ["help-admin"];
