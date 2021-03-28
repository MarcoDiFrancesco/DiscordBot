import { Client, Collection } from "discord.js";
// import commands from "./handler/command"
import fs from "fs";
import mongoose from "mongoose";
import { helpCommands } from "./commands/help.js";
import { cleanMessage } from "./functions.js";
import publicip from "public-ip";
import ClashAPI from "./classes/ClashAPI.js";

const client = new Client();
client.commands = new Collection();

const cooldowns = new Collection();

// Clash Of Clans API
const api = new ClashAPI();

// Set status
client.once("ready", async () => {
  console.log(`The bot is now online at ${await publicip.v4()}`);
  client.user.setPresence({
    status: "online",
    game: {
      name: "Mettimi alla prova :wink:",
      type: "WATCHING",
    },
  });

  // Import all commands into Collection
  // Commands list e.g. ['ping.js', 'beep.js']
  const commandFiles = fs
    .readdirSync("./commands")
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const command = await import(`./commands/${file}`);
    // Add item into Collection
    client.commands.set(command.name, command);
  }

  // Connect to monoose database
  await mongoose.connect(process.env.MONGO_CONN_STRING, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
});

client.on("message", async (message) => {
  // Message is sent by a bot
  if (message.author.bot) {
    return;
  }
  // Allow commands without prefix only in DM
  if (!message.content.startsWith(process.env.PREFIX)) {
    if (message.guild) {
      return;
    }
  }

  // Get cleaned message
  let args = cleanMessage(message);
  // Pop first element from list and return it
  const commandName = args.shift();
  // Get command from Collection and try to execute it, in case command is not found try to get aliases
  const command =
    client.commands.get(commandName) ||
    client.commands.find(
      (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
    );
  // If command not found
  if (!command) {
    // Show only in private chat
    if (!message.guild) {
      message.channel.send([
        ":x: Questo comando non esiste!",
        "Utilizza i seguenti comandi:",
        ...helpCommands,
      ]);
      return;
    }
    message.reply(
      `:x: Questo comando non esiste! Scrivi \`${process.env.PREFIX}help\` per visualizzare tutti i comandi`
    );
    return;
  }

  // Spam prevention
  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Collection());
  }
  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  // Wait 5 seconds per command
  const cooldownAmount = 5 * 1000;
  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.reply(
        `:x: Non inviare messaggi troppo velocemente! Aspetta ancora ${timeLeft.toFixed(
          1
        )} secondi prima di riutilizzare il comando \`${process.env.PREFIX}${
          command.name
        }\``
      );
    }
  }
  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  try {
    command.execute(message, args, api);
  } catch (e) {
    message.reply(
      `c'è stato un errore nell'esecuzione di quel comando, contatta gli admin. Errore: \`${e}\``
    );
  }
});

// If there are errors, log them
client
  .on("disconnect", () => client.logger.log("Bot is disconnecting...", "warn"))
  .on("reconnecting", () => client.logger.log("Bot reconnecting...", "log"))
  .on("error", (e) => client.logger.log(e, "error"))
  .on("warn", (info) => client.logger.log(info, "warn"));

// For any unhandled errors
process.on("unhandledRejection", (err) => {
  console.error(err);
});

client.login(process.env.DISCORD_TOKEN);
