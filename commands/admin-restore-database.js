import Command from "../classes/Command.js";
import Clan from "../models/Clan.js";
import Player from "../models/Player.js";
import { sendClanList } from "./mostra-clan.js";

export const execute = async (msg, args, api) => {
  const cmd = new Command(name, argsRule, msg, args, api);
  if (cmd.adminCheck()) return;

  const [player, clans] = JSON.parse(args.join(" "));
  Clan.insertMany(clans, { ordered: false })
  Player.insertMany(player, { ordered: false });

  await cmd.send(":white_check_mark: Database ripristinato");
  await sendClanList(cmd);
};

const argsRule = [];
export const name = "admin-restore-database";
export const aliases = ["admin-database-restore"];
