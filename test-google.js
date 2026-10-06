const fs = require("fs");

const url = "https://script.google.com/macros/s/AKfycbx2CjOUurtyXtjNx40f_sgjhwsgxomaBxk3JUBcIvKcd0262USn3N7BMjuFYx9S4YjF5g/exec";

const data = JSON.parse(
    fs.readFileSync("test.json", "utf8")
);

fetch(url, {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
})
.then(async response => {
    console.log("STATUS:", response.status);
    console.log("HASIL:");
    console.log(await response.text());
})
.catch(error => {
    console.error("ERROR:", error);
});