import Player from "../models/Player.js";
import Clan from "../models/Clan.js";
import Command from "../classes/Command.js";
import { mostraClan } from "./mostra.js";
import { adminAggiungiChecks } from "./admin-aggiungi.js";

export const execute = async (msg, args, api) => {
  const cmd = new Command(name, argsRule, msg, args, api);
  if (await adminAggiungiChecks(cmd)) return true;
  // Check if already has secondary account
  let player = await Player.findOne({ clan: cmd.clan, primary: false });
  // If exists overwrite it
  if (player) {
    player.tag = cmd.playerTag;
    player.name = cmd.playerApi.name;
  } else {
    player = new Player({
      tag: cmd.playerTag,
      name: cmd.playerApi.name,
      primary: false,
      clan: cmd.clan,
    });
  }
  await player.save();
  await cmd.send(
    `:white_check_mark: Impostato come account secondario **${cmd.playerApi.name}** (${cmd.playerTag}) al clan **${cmd.clan.name}** (${cmd.clan.tag})`
  );
  await mostraClan(cmd, true);
};

const argsRule = ["#TAGCLAN", "#TAGPLAYER"];
export const name = "admin-account-secondario";
export const aliases = ["admin-secondario", "account-secondario-admin"];
