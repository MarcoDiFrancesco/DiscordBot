import Clan from "../models/Clan.js";
import { mostraClan } from "./mostra.js";
import Command from "../classes/Command.js";

export const execute = async (msg, args, api) => {
  const cmd = new Command(name, argsRule, msg, args, api);
  if (cmd.publicChatCheck()) return true;
  if (cmd.argsCheck()) return true;
  cmd.clanTag = cmd.args[0];
  if (cmd.cleanTags()) return true;

  // Check if user has subscribed another clan
  const clan = await Clan.findOne({
    representatives: { $in: [msg.author.id] },
  });
  if (clan) {
    await cmd.send(
      `:x: Stai già registrando il clan **${clan.name}** (#${clan.tag})`
    );
    await msg.author.send(
      ":white_check_mark: Utilizza questa chat per modificare i player"
    );
    return;
  }

  await cmd.getClan();

  // Check if clan was subscribed by someone else
  if (cmd.clan) {
    if (cmd.clan.representatives.includes(msg.author.id)) {
      await cmd.send(
        `:x: Stai già iscrivendo il clan **${cmd.clan.name}**, utilizza la chat privata per modificare i partecipanti`
      );
      await msg.author.send(
        ":white_check_mark: Utilizza questa chat per modificare i player"
      );
      mostraClan(cmd, false, true);
      return;
    }
    cmd.send(
      `:x: Il clan è già stato iscritto da <@${cmd.clan.representatives[0]}>`
    );
    return;
  }

  if (await cmd.getClanApi()) return true;

  cmd.clan = new Clan({
    tag: cmd.clanTag,
    name: cmd.clanApi.name,
    representatives: [msg.author.id],
  });
  await cmd.clan.save();
  await cmd.send(
    `:white_check_mark: Iscrivi il clan **${cmd.clanApi.name}** nella nuova chat creata!`
  );
  await msg.author.send(
    `:fire: Benvenuto al torneo organizzato da MPM Community :fire:\nUtilizza i comandi scritti sotto per iscrivere il clan`
  );
  mostraClan(cmd, false, true);
};
const argsRule = ["#TAGCLAN"];
export const name = "iscrivi";
export const aliases = ["iscrivo"];
