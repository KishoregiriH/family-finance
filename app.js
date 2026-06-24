if(localStorage.getItem("financeLogin")!="true"){

window.location.href="login.html";

}async function loadDashboard() {

    try {

        const response = await fetch(
        "https://script.google.com/macros/s/AKfycbyr5Uu3r7hjsz2JHsFpvwzTyMAIAlU5gSVBAm2mznw7GYIHjeQllzT-9WCHMT-ZJL0u/exec"
        );

        const data = await response.json();

        document.getElementById("income").innerText =
            "₹" + data.income;

        document.getElementById("expense").innerText =
            "₹" + data.expense;

        document.getElementById("saving").innerText =
            "₹" + data.saving;

        document.getElementById("balance").innerText =
            "₹" + data.balance;

    }
    catch(error) {

        console.error(error);

    }
}

window.onload = loadDashboard;

const currentUser =
localStorage.getItem(
    "currentUser"
);

if(
    document.getElementById(
        "loggedUser"
    )
){

document.getElementById(
    "loggedUser"
).innerHTML =
"👤 " + currentUser;

}

function logout(){

localStorage.removeItem(
    "financeLogin"
);

localStorage.removeItem(
    "currentUser"
);

window.location.href =
"login.html";

}