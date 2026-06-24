// LOGIN CHECK

if(localStorage.getItem("financeLogin")!="true"){

window.location.href="login.html";

}

// DASHBOARD LOAD

window.onload = async function(){

showUserInfo();

await loadDashboard();

hideLoading();

};

// SHOW USER

function showUserInfo(){

const currentUser =
localStorage.getItem("currentUser");

if(document.getElementById("loggedUser")){

document.getElementById("loggedUser").innerHTML =
currentUser;

}

if(document.getElementById("welcomeUser")){

const hour = new Date().getHours();

let greeting = "Good Morning";

if(hour >= 12 && hour < 17){

greeting = "Good Afternoon";

}
else if(hour >= 17){

greeting = "Good Evening";

}

document.getElementById("welcomeUser").innerHTML =
"👋 " + greeting + ", " + currentUser;

}

}

// DASHBOARD API

async function loadDashboard(){

try{

const response = await fetch(
"https://script.google.com/macros/s/AKfycbyr5Uu3r7hjsz2JHsFpvwzTyMAIAlU5gSVBAm2mznw7GYIHjeQllzT-9WCHMT-ZJL0u/exec"
);

const data = await response.json();

document.getElementById("income").innerHTML =
"₹" + Number(data.income).toLocaleString();

document.getElementById("expense").innerHTML =
"₹" + Number(data.expense).toLocaleString();

document.getElementById("saving").innerHTML =
"₹" + Number(data.saving).toLocaleString();

document.getElementById("balance").innerHTML =
"₹" + Number(data.balance).toLocaleString();

loadRecentTransactions();

}
catch(error){

console.log(error);

}

}

// LOADING

function hideLoading(){

setTimeout(() => {

document.getElementById(
"loadingScreen"
).style.display="none";

},1000);

}

// RECENT TRANSACTIONS

async function loadRecentTransactions(){

const container =
document.getElementById(
"recentTransactions"
);

if(!container) return;

container.innerHTML =

`
<div class="transaction-card">
<span>💰 Salary</span>
<span>₹50,000</span>
</div>

<div class="transaction-card">
<span>⛽ Fuel</span>
<span>₹1,000</span>
</div>

<div class="transaction-card">
<span>🛒 Grocery</span>
<span>₹2,000</span>
</div>
`;

}

// PROFILE MENU

function toggleProfileMenu(){

const menu =
document.getElementById(
"profileDropdown"
);

if(menu.style.display==="block"){

menu.style.display="none";

}
else{

menu.style.display="block";

}

}

// LOGOUT

function showLogoutPopup(){

document.getElementById(
"profileDropdown"
).style.display="none";

document.getElementById(
"logoutPopup"
).style.display="flex";

}

function closeLogoutPopup(){

document.getElementById(
"logoutPopup"
).style.display="none";

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

// CLOSE DROPDOWN

window.onclick = function(event){

if(
!event.target.matches(
'.profile-btn'
)
){

const dropdowns =
document.getElementsByClassName(
"dropdown-content"
);

for(let i=0;i<dropdowns.length;i++){

dropdowns[i].style.display =
"none";

}

}

}