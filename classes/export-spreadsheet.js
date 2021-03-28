import { GoogleSpreadsheet } from 'google-spreadsheet';
import Clan from '../models/Clan.js';
import Player from '../models/Player.js';


export default async () => {
  const doc = new GoogleSpreadsheet(process.env.SPREADSHEET_ID);
  
  await doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY,
  });
  // Get data from sheet
  await doc.loadInfo();
  // Get first sheet
  const sheet = doc.sheetsByIndex[0];
  await sheet.loadCells();

  const players = await Player.find()
  const clans = await Clan.find()

  for (const player of players) {
    
  }
  const cellA1 = sheet.getCell(0, 0);
  cellA1.value = "Hello";
  const cellA2 = sheet.getCell(0, 1);
  cellA2.value = "Hello3";
  sheet.saveUpdatedCells();
  console.log("Updated")
};
