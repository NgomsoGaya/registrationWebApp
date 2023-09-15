export default function regFunction() {
    async function invalidMessage(number) {
        if (number) {
            if (
              !number.startsWith("CW") &&
              !number.startsWith("cw") &&
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
            let message = "Registration number is too short.";
            return message
        }
    }
    async function tooLongMsg(number) {
        if (number && number.length >= 10) {
            return "Registration number is too long."
        }
    }

    async function clearMsg() {
        return "You have cleared the registrations."
    }

    async function specialCharNotAllowed(number) {
        const specialCharPattern = /[^0-9]/;
        if (specialCharPattern.test(number)) {
             return "Special characters are not allowed."
        }
    }

    return {
        invalidMessage,
        tooShortMsg,
        tooLongMsg,
        clearMsg,
        specialCharNotAllowed
    }
}

