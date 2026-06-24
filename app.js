// LOGIN CHECK
if(localStorage.getItem("financeLogin") !== "true"){
  window.location.href = "login.html";
}

// DASHBOARD LOAD
window.onload = async function(){
  showUserInfo();
  await loadDashboard();
  hideLoading();
};

// SHOW USER INFO
function showUserInfo(){
  const currentUser = localStorage.getItem("currentUser");
  const otherUser = currentUser === "Kishore" ? "Darshini" : "Kishore";

  // Avatar initials
  if(document.getElementById("avatar1")){
    document.getElementById("avatar1").textContent = currentUser.charAt(0);
    document.getElementById("avatar2").textContent = otherUser.charAt(0);
    document.getElementById("row1name").textContent = currentUser;
    document.getElementById("row2name").textContent = otherUser;
    document.getElementById("bal-name1").textContent = currentUser;
    document.getElementById("bal-name2").textContent = otherUser;
  }

  // Greeting
  if(document.getElementById("welcomeUser")){
    const hour = new Date().getHours();
    let greeting = "Good Morning";
    if(hour >= 12 && hour < 17) greeting = "Good Afternoon";
    else if(hour >= 17) greeting = "Good Evening";
    document.getElementById("welcomeUser").innerHTML = "👋 " + greeting + ", " + currentUser;
  }
}

// LOAD DASHBOARD DATA
async function loadDashboard(){
  try{
    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbyr5Uu3r7hjsz2JHsFpvwzTyMAIAlU5gSVBAm2mznw7GYIHjeQllzT-9WCHMT-ZJL0u/exec"
    );
    const data = await response.json();

    const income  = Number(data.income);
    const expense = Number(data.expense);
    const saving  = Number(data.saving);
    const balance = Number(data.balance);

    // Balance row
    document.getElementById("balance1").textContent = "₹" + income.toLocaleString();
    document.getElementById("balanceCombined").textContent = "₹" + balance.toLocaleString();

    // Summary table — row 1 (logged-in user, live data)
    document.getElementById("r1income").textContent  = "₹" + income.toLocaleString();
    document.getElementById("r1expense").textContent = "₹" + expense.toLocaleString();
    document.getElementById("r1saving").textContent  = "₹" + saving.toLocaleString();

    // Summary table — row 3 (combined, same for now)
    document.getElementById("r3income").textContent  = "₹" + income.toLocaleString();
    document.getElementById("r3expense").textContent = "₹" + expense.toLocaleString();
    document.getElementById("r3saving").textContent  = "₹" + saving.toLocaleString();

    loadRecentTransactions();
  }
  catch(error){
    console.log(error);
  }
}

// HIDE LOADING
function hideLoading(){
  setTimeout(() => {
    const ls = document.getElementById("loadingScreen");
    if(ls) ls.style.display = "none";
  }, 1000);
}

// RECENT TRANSACTIONS
function loadRecentTransactions(){
  const container = document.getElementById("recentTransactions");
  if(!container) return;
  container.innerHTML = `
    <div class="transaction-card">
      <div class="txn-left">
        <div class="txn-icon">💰</div>
        <div>
          <div class="txn-title">Salary</div>
          <div class="txn-date">Today</div>
        </div>
      </div>
      <div class="txn-amount income">+₹50,000</div>
    </div>
    <div class="transaction-card">
      <div class="txn-left">
        <div class="txn-icon">⛽</div>
        <div>
          <div class="txn-title">Fuel</div>
          <div class="txn-date">Yesterday</div>
        </div>
      </div>
      <div class="txn-amount expense">-₹1,000</div>
    </div>
    <div class="transaction-card">
      <div class="txn-left">
        <div class="txn-icon">🛒</div>
        <div>
          <div class="txn-title">Grocery</div>
          <div class="txn-date">Yesterday</div>
        </div>
      </div>
      <div class="txn-amount expense">-₹2,000</div>
    </div>
  `;
}

// LOGOUT
function showLogoutPopup(){
  document.getElementById("logoutPopup").style.display = "flex";
}

function closeLogoutPopup(){
  document.getElementById("logoutPopup").style.display = "none";
}

function logout(){
  localStorage.removeItem("financeLogin");
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
}
