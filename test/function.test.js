import assert from "assert";
import queryFunction from "../queries/databaseQ.js";
import regFunction from "../frontendfunction/registrionDisplay.js";
import pgPromise from "pg-promise";
//import { db } from "../index.js";
const pgp = pgPromise();
const connectionString = process.env.connection_string || "postgres://cohndpkh:KqmdbsuaRXK12Qq4QK8mCjEcwS8sFJX2@surus.db.elephantsql.com/cohndpkh";

const db = pgp(connectionString);

describe("Testing my registration Web App", function () {
    this.timeout(20000);

    beforeEach(async function () {
      try {
        await db.none("TRUNCATE TABLE registration_numbers RESTART IDENTITY CASCADE");
      } catch (err) {
        console.log(err);
        throw err;
      }
    });

    it("Should be able to add a registration number", async function () {
        try {
          let query = queryFunction(db);

            await query.storingRegistration("CA123456");
            
            let getRegNo = await query.gettingRegistration();
            
            assert.deepEqual('CA 123-456', getRegNo[0].registration_number);
        } catch (err) {
          console.log(err);
        }
    })
    it("Should be able to add multiple registration numbers", async function () {
        try {
            let query = queryFunction(db);

            await query.storingRegistration("CA555444");
            await query.storingRegistration("CL666444");

            const actual = 'CA 555-444, CL 666-444';

            let getRegNo = await query.gettingRegistration();
            
            const regNo = []
            getRegNo.forEach((obj) => {
             regNo.push(obj.registration_number)
            })
            assert.deepEqual(actual.split(', '), regNo);
        } catch (err) {
          console.log(err);
        }
    })
    it("Should not add duplicate registration numbers", async function () {
        try {
            let query = queryFunction(db);

            await query.storingRegistration("CA555444");
            await query.storingRegistration("CA555444");

            let getRegNo = await query.gettingRegistration()

            assert.deepEqual("CA 555-444", getRegNo[0].registration_number);
        } catch (err) {
          console.log(err);
        }
    })
    it("Should be able to clear your registration numbers", async function () {
      try {
        let query = queryFunction(db);
        let frontend = regFunction()

        await query.clearRegistration()
        let clearMsg = await frontend.clearMsg()

        assert.deepEqual("You have cleared the registrations.", clearMsg);
      } catch (err) {
        console.log(err);
      }
    });
    it("Should display an errror message for an invalid registartion number", async function () {
      try {
        //let query = queryFunction(db);
        let frontend = regFunction();

       // await query.storingRegistration('LO123456');

        let invalidErr = await frontend.invalidMessage("LO123456");
    

        assert.deepEqual(
          "Please enter a registration from the towns below.",
          invalidErr
        );
      } catch (err) {
        console.log(err);
      }
    });
  it("Should display an errror message for a short registartion number", async function () {
    try {
      let query = queryFunction(db);
      let frontend = regFunction();

      await query.storingRegistration('123');

      let shortErr = await frontend.tooShortMsg(123);

      assert.deepEqual("Registration number is too short", shortErr);
    } catch (err) {
      console.log(err);
    }
  });
  it("Should display an errror message for a long registartion number", async function () {
    try {
      let query = queryFunction(db);
      let frontend = regFunction();

      await query.storingRegistration('LO123456789101112');

      let longErr = await frontend.tooLongMsg(1234567891011);

      assert.deepEqual("Registration number is too long", longErr);
    } catch (err) {
      console.log(err);
    }
  });
  it("Should be able to filter registration by town.", async function () {
    try {
      let query = queryFunction(db);

      await query.storingRegistration("CA123456");
      await query.storingRegistration("CL123456");
      let filteredREg = await query.filterRegistration("CA");


      assert.deepEqual("CA 123-456", filteredREg[0].registration_number);
    } catch (err) {
      console.log(err);
    }
  });
})