import Clan from "../models/Clan.js";
import Player from "../models/Player.js";
import { aggiungiChecks } from "./aggiungi.js";
import { mostraClan } from "./mostra.js";
import Command from "../classes/Command.js";

export const execute = async (msg, args, api) => {
  const cmd = new Command(name, argsRule, msg, args, api);
  if (await aggiungiChecks(cmd)) return;
  // Player in database
  if (cmd.player) {
    if (String(cmd.player.clan) === String(cmd.clan._id)) {
      // Player found in clan but primary
      if (cmd.player.primary) {
        await cmd.send(
          `:x: Questo player è impostato come player primario, se vuoi impostarlo come secondario devi prima rimuoverlo`
        );
        await mostraClan(cmd);
        return;
      }
      await cmd.send(
        `:x: Hai già impostato questo player come player secondario`
      );
      await mostraClan(cmd);
      return;
    }
    // Needed because player.clan just contains ID
    let clan = await Clan.findOne({ _id: cmd.player.clan });
    await cmd.send(`:x: Il player è già stato aggiunto dal clan #${clan.tag}`);
    await mostraClan(cmd);
    return;
  }
  if (await cmd.getPlayerApi()) return true;

  let player = await Player.findOne({ clan: cmd.clan, primary: false });
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
    `:white_check_mark: **${player.name}** impostato come player secondario`
  );
  await mostraClan(cmd);
};
const argsRule = ["#TAGPLAYER"];
export const name = "account-secondario";
export const aliases = [];
