import { Client, Collection } from "discord.js";
import { config } from "dotenv";
// import commands from "./handler/command"
import fs from "fs";
import mongoose from 'mongoose';

// Exports .env
config();

const client = new Client();
client.commands = new Collection();
const cooldowns = new Collection();


const cleanMessage = message => {
  // e.g. -> !command arg1 arg2 arg3
  let message_str = message.content;
  // Remove first character from string
  // e.g. -> command arg1 arg2 arg3
  message_str = message_str.slice(1);
  // Remove starting and ending spaces from string
  message_str = message_str.trim();
  // Split string into array
  // " " is replaced / +/ is used to not get an empty
  // item in the array if 2 spaces are placed
  message_str = message_str.split(/ +/);
  return message_str;
}

// Se the status
client.once("ready", async () => {
  console.log(`I'm online, my name is ${client.user.username}`);
  client.user.setPresence({
    status: "online",
    game: {
      name: "Me getting developed",
      type: "WATCHING"
    }
  });

  // Import all commands into Collection
  // Commands list e.g. ['ping.js', 'beep.js']
  const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    // Import file
    const command = await import(`./commands/${file}`);
    // Add item into Collection
    client.commands.set(command.name, command);
  }

  // Connect to monoose database
  await mongoose.connect(process.env.MONGO_CONN_STRING, { useUnifiedTopology: true, useNewUrlParser:true });
});

client.on("message", async message => {
  // Message is sent by a bot
  if (message.author.bot)
    return;
  // Message does not start with prefix
  if (!message.content.startsWith(process.env.PREFIX))
    return;

  // Get cleaned message
  let args = cleanMessage(message);
  // Pop first element from list and return it
  const commandName = args.shift();
  // Get command from Collection and try to execute it
  // in case command is not found try to get aliases
  const command = client.commands.get(commandName) ||
    client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

  // Spam prevention
  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Collection());
  }
  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = 5 * 1000;
  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.reply(`non inviare messaggi troppo velocemente! Aspetta ancora ${timeLeft.toFixed(1)} secondi prima di riutilizzare il comando \`${command.name}\`.`);
    }
  }
  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  try {
    command.execute(message, args);
  } catch {
    message.reply(`questo comando non esiste! Scrivi \`${process.env.PREFIX}help\` per visualizzare tutti i comandi.`);
  }

  // User's direct messages
  // if (!message.guild) {
  // 	console.log("Not guild");
  // 	return;
  // }
  // if (!message.member)
  // 	message.member = await message.guild.fetchMember(message);
});

// If there are errors, log them
client.on("disconnect", () => client.logger.log("Bot is disconnecting...", "warn"))
  .on("reconnecting", () => client.logger.log("Bot reconnecting...", "log"))
  .on("error", (e) => client.logger.log(e, "error"))
  .on("warn", (info) => client.logger.log(info, "warn"));

//For any unhandled errors
process.on("unhandledRejection", (err) => {
  console.error(err);
});

client.login(process.env.TOKEN);