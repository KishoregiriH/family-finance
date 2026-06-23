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

async function loadDashboard() {

    try {

        const response = await fetch(
        "https://script.google.com/macros/s/AKfycbyr5Uu3r7hjsz2JHsFpvwzTyMAIAlU5gSVBAm2mznw7GYIHjeQllzT-9WCHMT-ZJL0u/exec"
        );

        const data = await response.json();

        document.getElementById("income").innerHTML =
            "₹" + data.income;

        document.getElementById("expense").innerHTML =
            "₹" + data.expense;

        document.getElementById("saving").innerHTML =
            "₹" + data.saving;

        document.getElementById("balance").innerHTML =
            "₹" + data.balance;

    }

    catch(error) {

        console.log(error);

    }
}

loadDashboard();

}