import fetch, { Headers } from "node-fetch";

// console.log(await login.json());

export default class ClashAPI {
  constructor() {}

  async getToken() {
    let res = await fetch(`https://developer.clashofclans.com/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: process.env.CLASH_LOGIN_EMAIL,
        password: process.env.CLASH_LOGIN_PASSWORD,
      }),
    });
    let jsonRes = await res.json();
    let token = jsonRes.temporaryAPIToken;
    return token;
  }

  async getObj(url) {
    let headers = {
      headers: new Headers({
        Accept: "application/json",
        Authorization: `Bearer ${this.token}`,
      }),
    };
    console.log("TRYING");
    let res = await fetch(url, headers);
    if (res.status === 403) {
      console.log("REQUESTING NEW TOKEN");
      this.token = await this.getToken();
      headers = {
        headers: new Headers({
          Accept: "application/json",
          Authorization: `Bearer ${this.token}`,
        }),
      };
      res = await fetch(url, headers);
    }
    let jsonRes = await res.json();
    console.log("DONE");
    return [res.status, jsonRes];
  }

  async getPlayer(tag) {
    let url = `https://api.clashofclans.com/v1/players/%23${tag}`;
    return this.getObj(url);
  }

  async getClan(tag) {
    let url = `https://api.clashofclans.com/v1/clans/%23${tag}`;
    return this.getObj(url);
  }
}
