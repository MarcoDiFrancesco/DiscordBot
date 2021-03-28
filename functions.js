import fetch, { Headers } from "node-fetch";

export const cleanMessage = (message) => {
  // e.g. -> ?command arg1 arg2 arg3
  let message_str = message.content;
  // Remove first character from string
  // e.g. -> command arg1 arg2 arg3
  if (message_str[0] === process.env.PREFIX) {
    message_str = message_str.slice(1);
  }
  // Remove starting and ending spaces from string
  message_str = message_str.trim();
  // Split string into array
  // " " is replaced / +/ is used to not get an empty item in the array if 2 spaces are placed
  message_str = message_str.split(/ +/);
  // Make command lowercase
  message_str[0] = message_str[0].toLowerCase();
  return message_str;
};

const commandList = [
  {
    name: "aggiungi",
    description: "Iscrivi un player al torneo",
    options: [
      {
        name: "tag",
        description: "Tag del player da aggiungere, per esempio #ABCDEFGH",
        type: 3,
        required: true,
      },
    ],
  },
];

export const registerCommands = async () => {
  const url = `https://discord.com/api/v8/applications/${process.env.DISCORD_ID}/commands`;

  for (const json of commandList) {
    const headers = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
      },
      body: JSON.stringify(json),
    };
    const res = await fetch(url, headers);
    if (res.status !== 200) {
      console.error(
        `Error in registering commands, status: ${res.status}, status text: ${res.statusText}`
      );
    }
  }
};
