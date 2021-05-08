import Command from "../classes/Command.js";
import { mostraClans, mostraClan } from "./mostra.js";
import { updateSpreadsheet } from "../classes/spreadsheet.js";

export const execute = async (msg, args, api) => {
  const cmd = new Command(name, argsRule, msg, args, api);
  if (cmd.adminCheck()) return;
  if (cmd.argsCheck()) return;
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
  if (cmd.clan.confirmed) {
    await cmd.send(`:white_check_mark: È stata tolta la conferma dal clan`);
    cmd.clan.confirmed = false;
  } else {
    await cmd.send(`:white_check_mark: Il clan è stato confermato`);
    cmd.clan.confirmed = true;
  }
  await cmd.clan.save();
  await mostraClan(cmd, true);
  updateSpreadsheet();
};

const argsRule = ["#TAGCLAN"];
export const name = "admin-conferma";
export const aliases = ["conferma-admin", "admin-rimuovi-conferma"];
