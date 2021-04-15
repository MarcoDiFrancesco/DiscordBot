import fs from "fs";
import Command from "../classes/Command.js";
import Clan from "../models/Clan.js";
import Player from "../models/Player.js";
import { mostraClans } from "./mostra.js";
import exportSpreadsheet from "../classes/export-spreadsheet.js";

export const execute = async (msg, args, api) => {
  const cmd = new Command(name, argsRule, msg, args, api);
  if (cmd.adminCheck()) return;
  if (cmd.argsCheck()) return;

  const players = await Player.find();
  const clans = await Clan.find();
  const json = JSON.stringify([players, clans]);
  fs.writeFileSync(`/tmp/${new Date().toISOString()}.json`, json);
  await Player.collection.deleteMany();
  await Clan.collection.deleteMany();

  await cmd.send(":white_check_mark: Database e Google Spreadsheet ripuliti");
  await mostraClans(cmd);
  exportSpreadsheet();
};

const argsRule = [];
export const name = "admin-reset-database";
export const aliases = ["admin-database-reset"];
