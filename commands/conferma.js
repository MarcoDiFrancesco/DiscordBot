import Player from "../models/Player.js";
import { mostraClan } from "./mostra.js";
import Command from "../classes/Command.js";
import exportSpreadsheet from "../classes/export-spreadsheet.js";

export const execute = async (msg, args, api) => {
  const cmd = new Command(name, argsRule, msg, args, api);
  if (cmd.privateChatCheck()) return;
  if (cmd.argsCheck()) return;
  if (await cmd.getClanThis()) return true;
  if (cmd.clan.confirmed) {
    cmd.send(
      ":x: Il clan è già stato confermato, se vuoi modificare i player contatta gli admin"
    );
    await mostraClan(cmd);
    return true;
  }
  const players = await Player.find({ clan: cmd.clan, primary: true });
  const minPlayers = 5;
  if (players.length < minPlayers) {
    await cmd.send(
      `:x: Devono esserci almeno ${minPlayers} player prima di confermare il clan`
    );
    await mostraClan(cmd);
    return;
  }
  // Check account secondario
  let thereIsAccountSecondario = false;
  for (const player in players) {
    if (!player.primary) {
      thereIsAccountSecondario = true;
    }
  }
  if (!thereIsAccountSecondario) {
    await cmd.send(`:x: L'account secondario non è presente`);
    await mostraClan(cmd);
    return;
  }

  cmd.clan.confirmed = true;
  await cmd.clan.save();
  await mostraClan(cmd);
  exportSpreadsheet();
};

const argsRule = [];
export const name = "conferma";
export const aliases = ["confirm"];
