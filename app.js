console.log("Family Finance Started");

function saveTransaction(){

let date = document.getElementById("date").value;
let person = document.getElementById("person").value;
let type = document.getElementById("type").value;
let category = document.getElementById("category").value;
let amount = document.getElementById("amount").value;
let description = document.getElementById("description").value;

console.log({
    date,
    person,
    type,
    category,
    amount,
    description
});

alert("Transaction Saved");
}