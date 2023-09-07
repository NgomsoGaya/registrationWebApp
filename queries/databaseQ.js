export default function queryFunction(db) {

  async function storingRegistration(regnumber) {
    try {
      let upperNumber = regnumber.toUpperCase().replace(/[\s-]/g, "");
      let prefix = upperNumber.substring(0, 2);
      let numericPart = upperNumber.substring(2);
      // Insert a space and a hyphen in the appropriate positions
      let number = prefix + " " + numericPart.substring(0, 3) + "-" + numericPart.substring(3);
    
      let regexPartten = /^.{6,10}$/

      let valueExist = false;
      //let town_tag = number.substring(0, 2);

      let townId = await db.any("select id from towns WHERE town_code = $1", [prefix])

      if (!townId) {
      
        return;
      }

      const getAllQuery = "SELECT * FROM registration_numbers"
      const rows = await db.any(getAllQuery)

      rows.forEach((row) => {
        if (row.registration_number.toUpperCase() === number) {
          valueExist = true;
          return
        }
      })
      
      if (
        !regexPartten.test(number) ||
        !number.startsWith(prefix) ||
        number.length < 6 ||
        number.length > 10
      ) {
        return "Please enter avalid registration.";
      }
      else if (
        regexPartten.test(number) &&
        number.length >= 6 &&
        number.length <= 10 &&
        !valueExist
      ) {
        if (number.startsWith(prefix)) {
          await db.none(
            "INSERT INTO registration_numbers (registration_number, town_id) VALUES ($1, $2)",
            [number, townId[0].id]
          );
        }
      }
    
    } catch (error) {
     console.error("Error in storingRegistration:", error);
  }
  }

  async function duplicateNumber(regnumber) {
    // const number = regnumber.toUpperCase();
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

    const getAllQuery = "SELECT * FROM registration_numbers";
    const rows = await db.any(getAllQuery);

    let isDuplicate = false;

    for (const row of rows) {
      if (row.registration_number.toUpperCase() === number) {
        isDuplicate = true;
        break;
      } 
    } if (isDuplicate) {
      return "This registration number already exist.";
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