export default function queryFunction(db) {

    async function storingRegistration(number) {
        if (number) {
            if (number.startsWith("CAG")) {
              return await db.none(
                "INSERT INTO registration_numbers (registration_number, town_id) VALUES ($1, $2)",
                [number, "CAG"]
              );
            } else if (number.startsWith("CA")) {
              return await db.none(
                "INSERT INTO registration_numbers (registration_number, town_id) VALUES ($1, $2)",
                [number, "CA"]
              );
            } else if (number.startsWith("CJ")) {
              return await db.none(
                "INSERT INTO registration_numbers (registration_number, town_id) VALUES ($1, $2)",
                [number, "CJ"]
              );
            } else if (number.startsWith("CL")) {
              return await db.none(
                "INSERT INTO registration_numbers (registration_number, town_id) VALUES ($1, $2)",
                [number, "CL"]
              );
            }
            
        } 
        return null;
    }

    async function gettingRegistration() {
        return await db.any(
            "SELECT * FROM registration_numbers"
        );
    }

    async function filterRegistration(town) {
        if (town) {
            if (town == "CA") {
              return await db.any(
                "SELECT registration_number FROM registration_numbers WHERE town_id = $1",
                ['CA']
              );
            } else if (town == "CAG") {
                return await db.any(
                  "SELECT registration_number FROM registration_numbers WHERE town_id = $1",
                  ["CAG"]
                );
            } else if (town == "CJ") {
                return await db.any(
                  "SELECT registration_number FROM registration_numbers WHERE town_id = $1",
                  ["CJ"]
                );
            } else if (town == "CL") {
                return await db.any(
                  "SELECT registration_number FROM registration_numbers WHERE town_id = $1",
                  ["CL"]
                );
            }
        }
        return null;
    }

    return {
      storingRegistration,
      filterRegistration,
      gettingRegistration,
    };
}