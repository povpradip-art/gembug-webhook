const url = "https://script.google.com/macros/s/AKfycbx2CjOUurtyXtjNx40f_sgjhwsgxomaBxk3JUBcIvKcd0262USn3N7BMjuFYx9S4YjF5g/exec";

const data = {
    id: "TEST-DEPLOY-002",
    timestamp: new Date().toISOString(),
    donor: "TEST DEPLOY",
    soundboard: "PUSH-UP",
    soundId: "7a4157be-0667-4522-9a69-fb275a5121e1",
    nominal: 10000,
    status: "TEST",
    quantity: 5,
    unit: "reps"
};

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