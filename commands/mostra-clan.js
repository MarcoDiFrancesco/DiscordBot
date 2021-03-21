import Clan from "../models/Clan.js";
import Command from "../classes/Command.js";

export const execute = async (msg, args, api) => {
  const cmd = new Command(name, argsRule, msg, args, api);
  if (cmd.argsCheck()) return;

  const clans = await Clan.find();
  const values = [];
  for (const clan of clans) {
    let str = "";
    if (!clan) {
      str += "⠀-⠀⠀⠀⠀⠀⠀⠀-";
      continue;
    }
    str += `⠀\`${clan.tag}\` `;
    if (clan.name.length > 9) {
      clan.name = clan.name.substring(0, 9);
      clan.name += "..";
    }
    str += clan.name;
    values.push(str);
  }

  const fields = [
    {
      name: "⠀⠀⠀Tag⠀⠀⠀⠀⠀Nome",
      value: values,
    },
  ];
  const embed = {
    inline: true,
    color: "0x0099ff",
    description: `:trophy: Clan iscritti: ${clans.length}`,
    fields: fields,
  };
  await cmd.send({ embed: embed });
};

const argsRule = [];
export const name = "mostra-clan";
export const aliases = ["rimuovi-admin"];
