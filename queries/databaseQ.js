export default function queryFunction(db) {

  async function storingRegistration(regnumber) {

    let upperNumber = regnumber.toUpperCase().replace(/[\s-]/g, "");

    
    let prefix = upperNumber.substring(0, 2);
    let numericPart = upperNumber.substring(2);

    // Insert a space and a hyphen in the appropriate positions
      let number =
      prefix +
      " " +
      numericPart.substring(0, 3) +
      "-" +
      numericPart.substring(3);

    let valueExist = false;
    let town_tag = number.substring(0, 2);


    let townId = await db.any("select id from towns WHERE town_code = $1", [town_tag])

    const getAllQuery = "SELECT * FROM registration_numbers"
    const rows = await db.any(getAllQuery)

    rows.forEach((row) => {
      if (row.registration_number.toUpperCase() === number) {
        valueExist = true;
        return
      }
    })
    
    let insertQuery =
      "INSERT INTO registration_numbers (registration_number, town_id) VALUES ($1, $2)";

    if (number && !valueExist) {
      if (number.startsWith("CW") || number.startsWith("CA") || number.startsWith("CL") || number.startsWith("CJ")) {
        await db.none(insertQuery, [number, townId[0].id]);
      }
    }
  }

  async function duplicateNumber(regnumber) {
    const number = regnumber.toUpperCase();
    const getAllQuery = "SELECT * FROM registration_numbers";
    const rows = await db.any(getAllQuery);

    for (const row of rows) {
      if (row.registration_number.toUpperCase() === number) {
        return "This registration number already exists.";
      }
    }
  }

    async function gettingRegistration() {
        return await db.any(
            "SELECT * FROM registration_numbers"
        );
    }

  async function filterRegistration(town) {
    if (town) {
      let selectQuery =
        "SELECT registration_number FROM registration_numbers WHERE town_id IN (SELECT id FROM towns WHERE town_code = $1)";
      return await db.any(selectQuery, [town]);
    } else {
      // If 'town' is not provided, fetch all registration numbers
      let selectAllQuery =
        "SELECT registration_number FROM registration_numbers";
      return await db.any(selectAllQuery);
    }
  }



    return {
      storingRegistration,
      filterRegistration,
      gettingRegistration,
      duplicateNumber
    };
}