import Clan from "../models/Clan.js";
import Player from "../models/Player.js";

export default class Command {
  constructor(cmdName, argsRule, msg, args, api) {
    this.cmdName = cmdName;
    this.argsRule = argsRule;
    this.msg = msg;
    this.args = args;
    this.api = api;
  }

  /**
   * Get clan from database in this.clan
   * If does not exist return true
   */
  async getClan() {
    // Check if this function was already called
    if (this.clan) {
      console.error("Function called 2 times, this shouldn't happen");
      return;
    }
    this.clan = await Clan.findOne({ tag: this.clanTag });
  }

  /**
   * Get player from database in this.player
   * If does not exist return true
   */
  async getPlayer() {
    // Check if this function was already called
    if (this.player) {
      console.error("Function called 2 times, this shouldn't happen");
      return;
    }
    this.player = await Player.findOne({ tag: this.playerTag });
  }

  /**
   * Get from COC api the player, if does not exist or there is an error return true
   */
  async getPlayerApi() {
    const [status, player] = await this.api.getPlayer(this.playerTag);
    if (await this.checkApiStatus(status)) return true;
    this.playerApi = player;
  }

  /**
   * Get from COC api the clan, if does not exist or there is an error return true
   */
  async getClanApi() {
    const [status, clan] = await this.api.getClan(this.clanTag);
    if (await this.checkApiStatus(status)) return true;
    this.clanApi = clan;
  }

  /**
   * Private function
   */
  async checkApiStatus(status) {
    if (status === 404) {
      await this.send(`:x: Il player con tag #${this.playerTag} non esiste`);
      await sendClanTable(msg, this.clan, true);
      return true;
    }
    if (status !== 200) {
      console.error("COC API key not accepted");
      await this.send(
        ":exclamation: C'è stato un problema nei nostri server, contatta gentilmente gli admin :exclamation:"
      );
      return true;
    }
  }

  /**
   * Send message to user or to group chat
   */
  async send(text) {
    if (this.msg.guild) {
      await this.msg.channel.send(text);
    } else {
      await this.msg.author.send(text);
    }
  }

  /**
   * Check if user is admin
   */
  permissionChecks() {
    if (!this.msg.guild) {
      this.msg.author.send(`:x: Non utilizzare questo nella chat privata`);
      return true;
    }
    if (!this.msg.member.hasPermission("ADMINISTRATOR")) {
      this.send(`:x: Non hai i permessi per utilizzare questo comando`);
      return true;
    }
  }

  /**
   * Do not remove argsNumber from the function to count the arguments with an if,
   * this could lead to not counting arguments if the are falsy
   */
  argsCheck() {
    let exaplemsg;
    exaplemsg = `Scrivi ad esempio \`${process.env.PREFIX}${this.cmdName}`;
    for (const arg of this.argsRule) {
      exaplemsg += ` `;
      exaplemsg += arg;
    }
    exaplemsg += `\``;

    if (this.args.length < this.argsRule.length) {
      this.send(`:x: Hai specificato troppi pochi argomenti! ${exaplemsg}`);
      return true;
    }
    if (this.args.length > this.argsRule.length) {
      this.send(`:x: Hai specificato troppi argomenti! ${exaplemsg}`);
      return true;
    }
  }

  /*
   * Clean tags and check if it's in the correct format
   */
  cleanTags() {
    if (this.clanTag) {
      this.clanTag = this.cleanTag(this.clanTag);
      if (this.tagCheck(this.clanTag, "clan")) return true;
    }
    if (this.playerTag) {
      this.playerTag = this.cleanTag(this.playerTag);
      if (this.tagCheck(this.playerTag, "player")) return true;
    }
  }

  /**
   * Private function
   */
  tagCheck(tag, type) {
    if (!tag) {
      return true;
    }
    if (tag.length < 6 || tag.length > 10) {
      this.send(`:x: Il tag di questo ${type} non esiste!`);
      return true;
    }
    // Check if tag contains non-correct characters
    if (!/^[0-9a-zA-Z]+$/.test(tag)) {
      this.send(`:x: Inserisci solo lettere e numeri come tag del ${type}`);
      return true;
    }
  }

  /**
   * Private function
   */
  cleanTag(tag) {
    if (!tag) {
      return "";
    }
    tag = tag.toUpperCase();
    if (tag.startsWith("#")) {
      tag = tag.substring(1);
    }
    return tag;
  }
}
