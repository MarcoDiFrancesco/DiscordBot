import Command from "../classes/Command.js";
import { mostraClan } from "./mostra.js";

export const execute = async (msg, args, api) => {
  const cmd = new Command(name, argsRule, msg, args, api);
  if (cmd.adminCheck()) return;
  cmd.clanTag = args[0];
  if (cmd.cleanTags()) return;
  await cmd.getClan();
  if (!cmd.clan) {
    await cmd.send(
      `:x: Il clan con tag #${cmd.clanTag} non è iscitto al torneo`
    );
    await mostraClans(cmd);
    return;
  }

  if (args < 2) {
    await cmd.send(`:x: Specifica il comando con l'url della foto`);
  }
  cmd.clan.logo = args[1];

  await cmd.clan.save();
  await cmd.send(`:white_check_mark: Il logo è stato aggiornato`);
  await mostraClan(cmd, true);
};

const argsRule = [];
export const name = "admin-logo";
export const aliases = ["logo-admin"];
