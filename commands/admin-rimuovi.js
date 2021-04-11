import Player from "../models/Player.js";
import Clan from "../models/Clan.js";
import { mostraClan } from "./mostra.js";
import Command from "../classes/Command.js";

export const execute = async (msg, args, api) => {
  const cmd = new Command(name, argsRule, msg, args, api);
  if (cmd.adminCheck()) return;
  if (cmd.argsCheck()) return;
  cmd.playerTag = args[0];
  if (cmd.cleanTags()) return;
  await cmd.getPlayer();
  if (!cmd.player) {
    cmd.send(`:x: Questo player non è iscritto ad alcun clan`);
    return;
  }
  cmd.clan = await Clan.findOne({ _id: cmd.player.clan });
  await Player.deleteOne({ tag: cmd.player.tag });
  await cmd.send(
    `:white_check_mark: Rimosso **${cmd.player.name}** (${cmd.player.tag}) dal clan **${cmd.clan.name}** (${cmd.clan.tag})`
  );
  await mostraClan(cmd, true);
};

const argsRule = ["#TAGPLAYER"];
export const name = "admin-rimuovi";
export const aliases = ["rimuovi-admin"];
