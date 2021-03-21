import Player from "../models/Player.js";
import Clan from "../models/Clan.js";
import { sendClanTable } from "./mostra.js";
import Command from "../classes/Command.js";

export const execute = async (msg, args, api) => {
  const cmd = new Command(name, argsRule, msg, args, api);
  if (cmd.permissionChecks()) return;
  if (cmd.argsCheck()) return;
  cmd.playerTag = args[0];
  cmd.clanTag = args[1];
  if (cmd.cleanTags()) return;

  await cmd.getPlayer();
  await cmd.getClan();

  if (!cmd.clan) {
    await cmd.send(
      `:x: Il clan con tag #${cmd.clanTag} non è iscitto al torneo`
    );
    return;
  }
  if (cmd.player) {
    // Just calling cmd.player.clan.name does not show the name
    const clan = await Clan.findOne({ _id: cmd.player.clan });
    await cmd.send(
      `:x: Questo player è già iscritto al clan **${clan.name}** (${clan.tag})`
    );
    await sendClanTable(msg, clan, true);
    return;
  }
  if (await cmd.getPlayerApi()) return;
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

const argsRule = ["#TAGPLAYER", "#TAGCLAN"];
export const name = "admin-aggiungi";
export const aliases = ["aggiungi-admin"];
