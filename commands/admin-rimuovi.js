import Player from "../models/Player.js";
import Clan from "../models/Clan.js";
import { sendClanTable } from "./mostra.js";
import Command from "../classes/Command.js";

export const execute = async (msg, args, api) => {
  const cmd = new Command(name, argsRule, msg, args, api);
  if (cmd.permissionChecks()) return;
  if (cmd.argsCheck()) return;
  cmd.playerTag = args[0];
  if (cmd.cleanTags()) return;

  await cmd.getPlayer();

  if (!cmd.player) {
    cmd.send(`:x: Questo player non è iscritto ad alcun clan`);
    return;
  }

  const clan = await Clan.findOne({ _id: cmd.player.clan });
  await Player.deleteOne({ tag: cmd.player.tag });

  await cmd.send(
    `:white_check_mark: Rimosso **${cmd.player.name}** (${cmd.player.tag}) dal clan **${clan.name}** (${clan.tag})`
  );
  await sendClanTable(msg, clan, true);
};

const argsRule = ["#TAGCLAN"];
export const name = "admin-rimuovi";
export const aliases = ["rimuovi-admin"];
