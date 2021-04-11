import Player from "../models/Player.js";
import { mostraClan } from "./mostra.js";
import Command from "../classes/Command.js";
import Clan from "../models/Clan.js";

export const execute = async (msg, args, api) => {
  const cmd = new Command(name, argsRule, msg, args, api);
  if (await aggiungiChecks(cmd)) return;
  // Player in database
  if (cmd.player) {
    if (String(cmd.player.clan) === String(cmd.clan._id)) {
      // Player found in clan but secondary
      if (!cmd.player.primary) {
        await cmd.send(
          `:x: Questo player è impostato come player secondario, se vuoi impostarlo come primario devi prima rimuoverlo`
        );
        await mostraClan(cmd);
        return;
      }
      await cmd.send(`:x: Hai già aggiunto questo player`);
      await mostraClan(cmd);
      return;
    }
    // Needed because player.clan just contains ID
    let clan = await Clan.findOne({ _id: cmd.player.clan });
    await cmd.send(`:x: Il player è già stato aggiunto dal clan #${clan.tag}`);
    await mostraClan(cmd);
    return;
  }
  let players = await Player.find({ clan: cmd.clan });
  if (players.length > 10) {
    await cmd.send(`:x: Hai già inserito il numero massimo di partecipanti`);
    await mostraClan(cmd);
    return;
  }
  if (await cmd.getPlayerApi()) return true;
  let player = new Player({
    tag: cmd.playerTag,
    name: cmd.playerApi.name,
    clan: cmd.clan,
  });
  await player.save();
  await cmd.send(
    `:white_check_mark: Aggiunto **${player.name}** (${player.tag})`
  );
  await mostraClan(cmd);
};

/**
 * Checks used for aggiungi, account-secondario, rimuovi
 * @returns true if error
 */
export const aggiungiChecks = async (cmd) => {
  if (cmd.privateChatCheck()) return true;
  if (cmd.argsCheck()) return true;
  cmd.playerTag = cmd.args[0];
  if (cmd.cleanTags()) return true;
  await cmd.getPlayer();
  if (await cmd.getClanThis()) return true;
  if (cmd.clan.confirmed) {
    cmd.send(
      ":x: Il clan è già stato confermato, se vuoi modificare i player contatta gli admin"
    );
    await mostraClan(cmd);
    return true;
  }
};

const argsRule = ["#TAGPLAYER"];
export const name = "aggiungi";
export const aliases = [];
