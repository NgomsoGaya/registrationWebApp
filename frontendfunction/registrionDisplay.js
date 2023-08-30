function regFunction() {
    let noArr = []
   async function regNumbers(number) {
    
    if (number) {
        noArr.push(number) 
        console.log(".." + noArr)
   } 
   }
    async function getRegNumbers(){
        return noArr
    }
    return {
        regNumbers,
        getRegNumbers
    }
}

