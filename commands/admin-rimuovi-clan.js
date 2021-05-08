import Clan from "../models/Clan.js";
import { mostraClans } from "./mostra.js";
import Command from "../classes/Command.js";
import Player from "../models/Player.js";

export const execute = async (msg, args, api) => {
  const cmd = new Command(name, argsRule, msg, args, api);
  if (cmd.adminCheck()) return;
  if (cmd.argsCheck()) return;
  cmd.clanTag = args[0];
  if (cmd.cleanTags()) return;
  await cmd.getClan();
  if (!cmd.clan) {
    await cmd.send(`:x: Questo clan non è iscritto ad alcun clan`);
    mostraClans(cmd);
    return;
  }
  await Player.deleteMany({ clan: cmd.clan._id });
  await Clan.deleteOne({ _id: cmd.clan._id });
  await cmd.send(
    `:white_check_mark: Rimosso clan **${cmd.clan.name}** (${cmd.clan.tag})`
  );
  mostraClans(cmd);
};

const argsRule = ["#TAGCLAN"];
export const name = "admin-rimuovi-clan";
export const aliases = ["rimuovi-clan-admin"];
