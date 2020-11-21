import { readdirSync } from "fs";
import ascii from "ascii-table";

const table = new ascii().setHeading("Command", "Load status");

export default (client) => {
  readdirSync("./commands/").forEach(dir => {
    const commands = readdirSync(`./commands/${dir}/`).filter(f => f.endsWith(".js"));

    for (let file of commands) {
      let pull = require(`../commands/${dir}/${file}`);

      if (pull.name) {
        client.commands.set(pull.name, pull);
        table.addRow(file, 'Added');
      } else {
        table.addRow(file, 'Somthing missing');
        continue;
      }

      if (pull.aliases && Array.isArray(pull)) {
        pull.aliases.forEach(alias => client.aliases.set(alias, pull.name));
      }
    }
  });
  console.log(table.toString());
}