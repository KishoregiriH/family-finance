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

        console.log("Dashboard Error:", error);

    }
}

loadDashboard();