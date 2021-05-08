import Player from "../models/Player.js";
import Clan from "../models/Clan.js";
import Command from "../classes/Command.js";

export const execute = async (msg, args, api) => {
  if (args.length === 1) {
    const argsRule = ["#TAGCLAN"];
    const cmd = new Command(name, argsRule, msg, args, api);
    if (cmd.argsCheck()) return;
    cmd.clanTag = cmd.args[0];
    if (cmd.cleanTags()) return true;
    await cmd.getClan();
    mostraClan(cmd, true);
  } else {
    const argsRule = [];
    const cmd = new Command(name, argsRule, msg, args, api);
    if (cmd.argsCheck()) return;
    mostraClans(cmd);
  }
};

export const mostraClan = async (cmd, isMostraCommand, toPrivateChat) => {
  // Check used only with isMostraCommand
  if (!cmd.clan) {
    if (!isMostraCommand) {
      console.error(
        "Clan not found when not in isMostraCommand, this should never happen"
      );
    }
    await cmd.send(
      `:x: Il clan con tag #${cmd.clanTag} non è iscitto al torneo`
    );
    await mostraClans(cmd);
    return true;
  }

  const players = await Player.find({ clan: cmd.clan });

  let confirmedEmoji, confirmedText, footerText, color;
  if (cmd.clan.confirmed) {
    confirmedEmoji = ":white_check_mark:";
    confirmedText = "Sì";
    footerText = `Il clan è stato confermato`;
    color = "0x77B155";
  } else {
    confirmedEmoji = ":x:";
    confirmedText = "No";
    footerText = `Clan NON confermato`;
    color = "0x0099ff";
  }

  if (isMostraCommand) {
    footerText = ``;
  }

  let description;
  if (isMostraCommand) {
    description = `:trophy: Clan: ${cmd.clan.name} (#${cmd.clan.tag})\n${confirmedEmoji} Partecipazione confermata: ${confirmedText}`;
  } else {
    description = `:trophy: Clan: ${cmd.clan.name}\n${confirmedEmoji} Partecipazione confermata: ${confirmedText}`;
  }

  const embed = {
    inline: true,
    color: color,
    description: description,
    fields: getMainText(players, cmd.clan, isMostraCommand),
    footer: {
      text: footerText,
    },
    thumbnail: {
      url: cmd.clan.logo,
    },
  };
  if (toPrivateChat) {
    await cmd.msg.author.send({ embed: embed });
    return;
  }
  await cmd.send({ embed: embed });
};

const getMainText = (players, clan, isMostraCommand) => {
  let values = [];
  const numbers = [
    ":one:",
    ":two:",
    ":three:",
    ":four:",
    ":five:",
    ":six:",
    ":seven:",
    ":eight:",
    ":nine:",
    ":keycap_ten:",
  ];

  const playersPrimary = [];
  const playersSecondary = [];
  for (const player of players) {
    if (player.primary) {
      playersPrimary.push(player);
    } else {
      playersSecondary.push(player);
    }
  }
  let counter = 0;
  for (const number of numbers) {
    let str = number;
    if (playersPrimary[counter]) {
      let tag = playersPrimary[counter].tag;
      str += `⠀\`${tag}\`⠀`;
      for (let i = 0; i < 9 - tag.length; i++) {
        str += "⠀";
      }
      let name = playersPrimary[counter].name;
      // if (name.length > 9) {
      //   name = name.substring(0, 9);
      //   name += "..";
      // }
      str += name;
    } else {
      str += "⠀-⠀⠀⠀⠀⠀⠀⠀-";
    }
    counter += 1;
    values.push(str);
  }

  values.push("**⠀⠀⠀Account secondario**");
  if (!playersSecondary.length) {
    values.push(":white_circle:⠀-⠀⠀⠀⠀⠀⠀⠀-");
  }
  for (const player of playersSecondary) {
    values.push(`:white_circle:⠀\`${player.tag}\`⠀${player.name}`);
  }
  if (!isMostraCommand) {
    if (!clan.confirmed) {
      values.push("");
      values.push("Comandi:");
      values.push(
        `:arrow_forward: \`${process.env.PREFIX}aggiungi PLAYERTAG\``
      );
      values.push(`:arrow_forward: \`${process.env.PREFIX}rimuovi PLAYERTAG\``);
      values.push(
        `:white_circle: \`${process.env.PREFIX}account-secondario PLAYERTAG\``
      );
      const minPlayers = 5;
      if (playersPrimary.length < minPlayers) {
        values.push(
          `:ok: ~~\`${process.env.PREFIX}conferma\`~~ (${minPlayers} player richiesti)`
        );
      } else {
        values.push(`:ok: \`${process.env.PREFIX}conferma\``);
      }
      values.push(`:grey_question: \`${process.env.PREFIX}help\``);
    } else {
      values.push("");
      values.push(
        "Clan confermato, se vuoi modificare player contatta gli admin"
      );
    }
  }
  return [
    {
      name: "⠀⠀⠀Tag⠀⠀⠀⠀⠀Nome",
      value: values,
    },
  ];
};

export const mostraClans = async (cmd) => {
  const clans = await Clan.find();

  let values = [];
  if (!clans.length) {
    values = ["⠀⠀⠀-⠀⠀⠀⠀⠀⠀⠀-"];
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
    str += `${statusEmoji}⠀\`${clan.tag}\`⠀`;
    for (let i = 0; i < 9 - clan.tag.length; i++) {
      str += "⠀";
    }
    // if (clan.name.length > 9) {
    //   clan.name = clan.name.substring(0, 9);
    //   clan.name += "..";
    // }
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

export const name = "mostra";
export const aliases = ["lista", "lista-clan", "clan", "mostra-clan"];
