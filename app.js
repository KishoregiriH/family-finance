async function loadDashboard() {

    try {

        const response = await fetch(
        "https://script.google.com/macros/library/d/1MAlq3yyAFkKDwuLxI0yKcTZW_2dKmQQpk8FCJprzngn8V97B3qFyNawl/3"
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

        console.log("Dashboard Error:", error);

    }
}

loadDashboard();