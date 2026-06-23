function saveTransaction(){

let transaction = {
    date: document.getElementById("date").value,
    person: document.getElementById("person").value,
    type: document.getElementById("type").value,
    category: document.getElementById("category").value,
    amount: document.getElementById("amount").value,
    description: document.getElementById("description").value
};

let transactions =
JSON.parse(localStorage.getItem("transactions")) || [];

transactions.push(transaction);

localStorage.setItem(
    "transactions",
    JSON.stringify(transactions)
);

alert("Transaction Saved Successfully");

console.log(transactions);

}