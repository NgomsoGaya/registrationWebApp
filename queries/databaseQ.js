export default function queryFunction(db) {

  async function storingRegistration(regnumber) {
    try {
      let upperNumber = regnumber.toUpperCase().replace(/[\s-]/g, "");
      let prefix = upperNumber.substring(0, 2);
      let numericPart = upperNumber.substring(2);
      // Insert a space and a hyphen in the appropriate positions
      let number = prefix + " " + numericPart.substring(0, 3) + "-" + numericPart.substring(3);
    
      let regexPartten = /^.{6,10}$/
      let specialCharPattern = /[^0-9]/;

      let valueExist = false;
      //let town_tag = number.substring(0, 2);

      let townId = await db.any("select id from towns WHERE town_code = $1", [prefix])

      if (!townId) {
      
        return;
      }

      const getAllQuery = "SELECT * FROM registration_numbers"
      const rows = await db.manyOrNone(getAllQuery)

      rows.forEach((row) => {
        if (row.registration_number.toUpperCase() === number) {
          valueExist = true;
          return;
        }
      })
      if (valueExist) {
        return "This registration number already exist.";
      }
      else if (
        regexPartten.test(number) &&
        number.length > 7 &&
        number.length <= 10 &&
        !valueExist &&
        specialCharPattern.test(number)
      ) {
        if (number.startsWith(prefix)) {
          await db.none(
            "INSERT INTO registration_numbers (registration_number, town_id) VALUES ($1, $2)",
            [number, townId[0].id]
          );
        } else {
          return;
        }
      }
    
    } catch (error) {
     console.error("Error in storingRegistration:", error);
  }
  }

  async function gettingRegistration() {
        return await db.any(
            "SELECT * FROM registration_numbers"
        );
    }

  async function filterRegistration(town) {

    let obj = {
      msg:'',
      regNumbers:[]
    };
    if (town) {
      let selectQuery =
        "SELECT registration_number FROM registration_numbers WHERE town_id IN (SELECT id FROM towns WHERE town_code = $1)";
      const regNumbers = await db.any(selectQuery, [town]);

      if (regNumbers.length === 0) {
          obj.msg = "There are no registration numbers for this town.";
      } else {
        obj.regNumbers = regNumbers ;
      }

    return obj

    }
    
    else {
      // If 'town' is not provided, fetch all registration numbers
      let selectAllQuery =
        "SELECT registration_number FROM registration_numbers";
      return await db.any(selectAllQuery);
    }
  }
  
  async function clearRegistration() {
    const countQuery = "SELECT COUNT(*) FROM registration_numbers"
    const regCount = await db.one(countQuery);

    if (regCount.count === 0) {
      return "Your database is empty."
    }
    await db.none("DELETE FROM registration_numbers")
    return "Registration numbers have been cleared."
  }
    return {
      storingRegistration,
      filterRegistration,
      gettingRegistration,
      clearRegistration
    };
}