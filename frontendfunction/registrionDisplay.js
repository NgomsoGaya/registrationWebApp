export default function regFunction() {
    async function invalidMessage(number) {
        if (number) {
            if (
              !number.startsWith("CAG") &&
              !number.startsWith("cag") &&
              !number.startsWith("CA") &&
              !number.startsWith("ca") &&
              !number.startsWith("CJ") &&
              !number.startsWith("cj") &&
              !number.startsWith("CL") &&
              !number.startsWith("cl")
            ) {
              return "Please enter a registration from the towns below.";
            }
        } else {
           return 
        } 
    }
    async function tooShortMsg(number) {
        if (number && number.length <= 5) {
            return "Registration number is too short"
        } else {
            return
        }
    }
    async function tooLongMsg(number) {
        if (number && number.length >= 10) {
            return "Registration number is too long"
        } else {
            return
        }
    }

    return {
        invalidMessage,
        tooShortMsg,
        tooLongMsg
    }
}

