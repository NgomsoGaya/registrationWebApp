import regFunction from "../frontendfunction/registrionDisplay.js";
import queryFunction from "../queries/databaseQ.js";
import pgPromise from "pg-promise";
import "dotenv/config";
const connectionString = process.env.DATABASE_URL;
const pgp = pgPromise();
const db = pgp(connectionString);

const query = queryFunction(db);
const display = regFunction();

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
  
            let message = await query.storingRegistration(regNo);

            let invalidErrMsg = await display.invalidMessage(regNo);

            let regNumbers = await query.gettingRegistration();

            let tooShort = await display.tooShortMsg(regNo);

            let tooLong = await display.tooLongMsg(regNo);

            let specCharMsg = await display.specialCharNotAllowed(regNo);

            //let duplicateMsg = await query.duplicateNumber(regNo);
    

            res.render("index", {
              regNumbers,
              invalidErrMsg,
              tooShort,
              tooLong,
              message,
              specCharMsg,
            });
        } catch (err) {
            next(err);
        }
    }
    async function filterRegistration(req, res, next) {
        try {
            let town = req.body.town
  
            let filteredTown = await query.filterRegistration(town)
            let feedback = filteredTown.msg
            console.log(filteredTown);
            res.render("index", { feedback, filteredTown });
        } catch (err) {
            next(err)
        }
    }

    async function clearRegistration(req, res, next) {
        try {
          await query.clearRegistration();

          const clrMsg = await query.clearRegistration();

          res.render("index", { clrMsg });
        } catch (err) {
          next(err);
        }
    }

    
    return {
      showRegistration,
      storeRegistration,
      filterRegistration,
      clearRegistration,
     // noSpecialChar,
    };
}