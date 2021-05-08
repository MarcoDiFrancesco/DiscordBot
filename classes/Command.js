import { mostraClan } from "../commands/mostra.js";
import Clan from "../models/Clan.js";
import Player from "../models/Player.js";

export default class Command {
  constructor(cmdName, argsRule, msg, args, api) {
    // e.g. 'admin-rimuovi'
    this.cmdName = cmdName;
    // e.g. ["#TAGPLAYER", "#TAGCLAN"]
    this.argsRule = argsRule;
    // Discord message object
    this.msg = msg;
    // Needed for lenght checks
    // e.g. ["#ABCDEF", "#ABCDEF"]
    this.args = args;
    // COC API object
    this.api = api;
  }

  /**
   * User is trying to subscribe the clan in the direct message
   */
  async getClanThis() {
    // Check if this function was already called
    if (this.clan) {
      console.error("Function called twice, this shouldn't happen");
      return;
    }
    this.clan = await Clan.findOne({
      representatives: { $in: [this.msg.author.id] },
    });
    if (!this.clan) {
      await this.send(
        `:x: Non hai ancora iscritto un clan, utilizza il comando \`${process.env.PREFIX}iscrivi TAGCLAN\` nella chat globale`
      );
      return true;
    }
  }

  /**
   * Get clan from database in this.clan
   * @returns true: if does not exist
   */
  async getClan() {
    // Check if this function was already called
    if (this.clan) {
      console.error("Function called twice, this shouldn't happen");
      return;
    }
    this.clan = await Clan.findOne({ tag: this.clanTag });
  }

  /**
   * Get player from database in this.player
   * @returns true: if does not exist
   */
  async getPlayer() {
    // Check if this function was already called
    if (this.player) {
      console.error("Function called twice, this shouldn't happen");
      return;
    }
    this.player = await Player.findOne({ tag: this.playerTag });
  }

  /**
   * Get from COC api the player, if does not exist or there is an error return true
   * @returns true: if error or player does not exist
   */
  async getPlayerApi() {
    const [status, player] = await this.api.getPlayer(this.playerTag);
    if (await this.checkApiStatus(status, "player", this.playerTag))
      return true;
    this.playerApi = player;
  }

  /**
   * Get from COC api the clan
   * @returns true: if error or clan does not exist
   */
  async getClanApi() {
    const [status, clan] = await this.api.getClan(this.clanTag);
    if (await this.checkApiStatus(status, "clan", this.clanTag)) return true;
    this.clanApi = clan;
  }

  /**
   * Handle 404 and not 200 status codes
   * @private
   */
  async checkApiStatus(status, type, tag) {
    if (status === 404) {
      await this.send(`:x: Il ${type} con tag #${tag} non esiste`);
      // await mostraClan(this);
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
      // Direct
      await this.msg.channel.send(text);
    } else {
      // Group
      await this.msg.author.send(text);
    }
  }

  /**
   * Checks if user wrote it in a private chat
   * @returns true: if wrote in public chat
   */
  privateChatCheck() {
    if (this.msg.guild) {
      this.send(`:x: Non utilizzare questo nella chat pubblica`);
      return true;
    }
  }

  /**
   * Checks if user wrote it in a public chat
   * @returns true if wrote in private chat
   */
  publicChatCheck() {
    if (!this.msg.guild) {
      this.send(`:x: Non utilizzare questo comando nella chat privata`);
      return true;
    }
  }

  /**
   * Check if user is admin, and if the message is written in a public chat
   * @returns true: if user is not admin
   */
  adminCheck() {
    if (this.publicChatCheck()) return true;
    if (!this.msg.member.hasPermission("ADMINISTRATOR")) {
      this.send(`:x: Non hai i permessi per utilizzare questo comando`);
      return true;
    }
  }

  /**
   * Check arguments to have the right length
   * @returns true: if error
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

  /**
   * Clean tags and check if it's in the correct format
   * @returns true: if error
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
   * Check lenght and characters type of the tag.
   * @private
   */
  tagCheck(tag, type) {
    if (!tag) {
      return true;
    }
    if (tag.length < 5 || tag.length > 10) {
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
   * Remove # if present
   * @private
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
