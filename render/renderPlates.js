import regFunction from "../frontendfunction/registrionDisplay.js";
import queryFunction from "../queries/databaseQ.js";
import pgPromise from "pg-promise";
//import { db } from "../index.js";

const connectionString = process.env.connection_string;
const pgp = pgPromise();
const db = pgp(connectionString);

const query = queryFunction(db);

const display = regFunction()

export default function renderFactory() {
    async function showRegistration(req, res, next) {
        try {
            let regNumbers = await query.gettingRegistration();
           

            res.render("index", {regNumbers});
        } catch (err) {
            next(err);
        }
    }
    async function storeRegistration(req, res, next) {
        try {
            let regNo = req.body.reg
  
            await query.storingRegistration(regNo);

            let invalidErrMsg = await display.invalidMessage(regNo);

            let regNumbers = await query.gettingRegistration();

            let tooShort = await display.tooShortMsg(regNo);
            let tooLong = await display.tooLongMsg(regNo);
            let duplicateMsg = await query.duplicateNumber(regNo)
    

            res.render("index", { regNumbers, invalidErrMsg, tooShort, tooLong, duplicateMsg});
        } catch (err) {
            next(err);
        }
    }
    async function filterRegistration(req, res, next) {
        try {
            let town = req.body.town
  
            let filteredTown = await query.filterRegistration(town)

            res.render("index", { filteredTown: filteredTown });
        } catch (err) {
            next(err)
        }
    }
    return {
      showRegistration,
      storeRegistration,
      filterRegistration,
    };
}