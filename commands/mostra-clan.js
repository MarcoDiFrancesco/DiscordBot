import Clan from "../models/Clan.js";
import Command from "../classes/Command.js";

export const execute = async (msg, args, api) => {
  const cmd = new Command(name, argsRule, msg, args, api);
  if (cmd.argsCheck()) return;
  await sendClanList(cmd);
};

export const sendClanList = async (cmd) => {
  const clans = await Clan.find();
  
  let values = []
  if (!clans.length){
    values = ["⠀⠀⠀-⠀⠀⠀⠀⠀⠀⠀-"]
  }

  let confirmedCounter = 0;
  for (const clan of clans) {
    if (clan.confirmed) {
      confirmedCounter += 1;
    }
  }

  for (const clan of clans) {
    let str = "";
    let statusEmoji;
    if (clan.confirmed) {
      statusEmoji = ":white_check_mark:";
    } else {
      statusEmoji = ":x:";
    }
    str += `${statusEmoji}⠀\`${clan.tag}\` `;
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
    description: `:trophy: Clan iscritti: ${clans.length}\n:white_check_mark: Confermati: ${confirmedCounter}`,
    fields: fields,
  };
  await cmd.send({ embed: embed });
};

const argsRule = [];
export const name = "mostra-clan";
export const aliases = ["rimuovi-admin"];
