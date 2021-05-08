import { GoogleSpreadsheet } from "google-spreadsheet";
import Clan from "../models/Clan.js";
import Player from "../models/Player.js";

const getSpreadsheet = async () => {
  const doc = new GoogleSpreadsheet(process.env.SPREADSHEET_ID);
  await doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/gm, "\n"),
  });
  // Get data from sheet
  await doc.loadInfo();
  // Get first sheet
  const sheet = doc.sheetsByIndex[0];
  await sheet.loadCells();
  return sheet;
};

export const updateSpreadsheet = async () => {
  const sheet = await getSpreadsheet();
  const players = await Player.find();
  const clans = await Clan.find().sort("name");

  let row = 1;
  for (const clan of clans) {
    const clanLink = `https://link.clashofclans.com/en?action=OpenClanProfile&tag=#${clan.tag}`;
    sheet.getCell(row, 1).value = "CLAN";
    sheet.getCell(row, 2).value = "GIOCATORI";
    sheet.getCell(row, 3).value = "TAG";
    sheet.getCell(row + 1, 1).value = clan.name;
    sheet.getCell(row + 2, 1).value = `#${clan.tag}`;
    sheet.getCell(row + 3, 1).value = `=HYPERLINK("${clanLink}", "link")`;

    // List with players for the clan
    let newPlayers = [];
    for (const player of players) {
      if (String(player.clan) === String(clan._id)) {
        newPlayers.push(player);
      }
    }
    for (let i = 0; i < 10; i++) {
      row += 1;
      if (newPlayers[i]) {
        sheet.getCell(row, 2).value = newPlayers[i].name;
        sheet.getCell(row, 3).value = newPlayers[i].tag;
      } else {
        sheet.getCell(row, 2).value = " - ";
        sheet.getCell(row, 3).value = " - ";
      }
    }
    row += 3;
  }

  sheet.saveUpdatedCells();
  console.log("Spreadsheet updated");
};

export const resetSpreadsheet = async () => {
  const sheet = await getSpreadsheet();
  console.log("Before");
  for (let row = 0; row < 1000; row++) {
    sheet.getCell(row, 1).value = "";
    sheet.getCell(row, 2).value = "";
    sheet.getCell(row, 3).value = "";
  }
  sheet.saveUpdatedCells();
  console.log("After");
};
