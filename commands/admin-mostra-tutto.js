import Clan from "../models/Clan.js";
import Command from "../classes/Command.js";
import { mostraClan } from "./mostra.js";

export const execute = async (msg, args, api) => {
  const cmd = new Command(name, argsRule, msg, args, api);
  if (cmd.adminCheck()) return;
  if (cmd.argsCheck()) return;
  const messages = await msg.channel.messages.fetch({ limit: 10 });
  // msg.channel.bulkDelete(fetched);
  for (const message of messages) {
    if (message[1].embeds.length) {
      await message[1].delete();
    }
  }

  const clans = await Clan.find().sort("name");
  for (const clan of clans) {
    cmd.clan = clan;
    await mostraClan(cmd, true);
  }
};

const argsRule = [];
export const name = "admin-mostra-tutto";
export const aliases = ["mostra-tutto-admin"];
