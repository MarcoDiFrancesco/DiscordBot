import Player from "../models/Player.js";
import Clan from "../models/Clan.js";
import { sendClanTable } from "./mostra.js";
import Command from "../classes/Command.js";
import { sendClanList } from "./mostra-clan.js";

export const execute = async (msg, args, api) => {
  const cmd = new Command(name, argsRule, msg, args, api);
  if (await adminAggiungiChecks(cmd)) return true;
  let player = new Player({
    tag: cmd.playerTag,
    name: cmd.playerApi.name,
    clan: cmd.clan,
  });
  await player.save();
  await cmd.send(
    `:white_check_mark: Aggiunto **${cmd.playerApi.name}** (${cmd.playerTag}) al clan **${cmd.clan.name}** (${cmd.clan.tag})`
  );
  await sendClanTable(msg, cmd.clan, true);
};

/**
 * Checks used for admin-aggiungi and admin-account-secondario
 * @returns true if error
 */
export const adminAggiungiChecks = async (cmd) => {
  if (cmd.adminCheck()) return true;
  if (cmd.argsCheck()) return true;
  cmd.clanTag = cmd.args[0];
  cmd.playerTag = cmd.args[1];
  if (cmd.cleanTags()) return true;
  await cmd.getPlayer();
  console.log("After get player");
  await cmd.getClan();
  console.log("After get clan");
  if (!cmd.clan) {
    await cmd.send(
      `:x: Il clan con tag #${cmd.clanTag} non è iscitto al torneo`
    );
    await sendClanList(cmd);
    return true;
  }
  if (cmd.player) {
    // Just calling cmd.player.clan.name does not show the name
    const clan = await Clan.findOne({ _id: cmd.player.clan });
    await cmd.send(
      `:x: Questo player è già iscritto al clan **${clan.name}** (${clan.tag})`
    );
    return true;
  }
  if (await cmd.getPlayerApi()) return true;
};

const argsRule = ["#TAGCLAN", "#TAGPLAYER"];
export const name = "admin-aggiungi";
export const aliases = ["aggiungi-admin"];
