const deadline = "2020-02-16";

const delOfNum = function declOfNum(number, titles) {  
    cases = [2, 0, 1, 1, 1, 2];  
    return titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];  
};

const calcDeadline = (deadline) => {
    const now = Date.now();
    const milDeadline = Date.parse(new Date(
        +(deadline[0] + deadline[1] + deadline[2] + deadline[3]),
        (+(deadline[5] + deadline[6])) - 1,
        +(deadline[8] + deadline[9])
    ));
    const result = Math.ceil((milDeadline - now) / 86400000);
    if (result) {
        return result + " " + delOfNum(result, ["день", "дня"]);
    } else {
        return "Срок истек!";
    }
};

console.log(calcDeadline(deadline));