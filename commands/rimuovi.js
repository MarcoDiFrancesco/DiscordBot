import Player from "../models/Player.js";
import { aggiungiChecks } from "./aggiungi.js";
import { mostraClan } from "./mostra.js";
import Command from "../classes/Command.js";

export const execute = async (msg, args, api) => {
  const cmd = new Command(name, argsRule, msg, args, api);
  if (await aggiungiChecks(cmd)) return;
  if (!cmd.player) {
    await cmd.send(`:x: Non esiste alcun player iscritto con questo tag!`);
    await mostraClan(cmd);
    return;
  }
  if (String(cmd.player.clan) !== String(cmd.clan._id)) {
    await cmd.send(
      `:x: Questo player non è iscritto al torneo in questo clan! Cerchi di fottere il sistema?`
    );
    await mostraClan(cmd);
    return;
  }
  await Player.deleteOne({ tag: cmd.player.tag });
  await cmd.send(
    `:white_check_mark: Rimosso **${cmd.player.name}** (${cmd.player.tag})`
  );
  await mostraClan(cmd);
};

const argsRule = ["#TAGPLAYER"];
export const name = "rimuovi";
export const aliases = ["remove"];
