// ── LOGIN CHECK ──
if(localStorage.getItem("financeLogin") !== "true"){
  window.location.href = "login.html";
}

// ── AUTO LOGOUT (1 minute inactivity) ──
const AUTO_LOGOUT_MS = 60 * 1000;
let autoLogoutTimer = null;
function resetAutoLogout(){
  clearTimeout(autoLogoutTimer);
  autoLogoutTimer = setTimeout(function(){
    const banner = document.createElement("div");
    banner.style.cssText = "position:fixed;top:0;left:0;right:0;z-index:99999;background:#dc2626;color:white;text-align:center;padding:14px;font-size:14px;font-weight:700;";
    banner.textContent = "Session expired due to inactivity. Logging out...";
    document.body.appendChild(banner);
    setTimeout(function(){
      localStorage.removeItem("financeLogin");
      localStorage.removeItem("currentUser");
      localStorage.removeItem("skipLoading");
      window.location.href = "login.html";
    }, 1500);
  }, AUTO_LOGOUT_MS);
}
["click","touchstart","keydown","scroll","mousemove"].forEach(function(evt){
  document.addEventListener(evt, resetAutoLogout, true);
});
resetAutoLogout();

// ── ON LOAD ──
window.onload = async function(){
  handleLoadingScreen();
  showUserInfo();
  await loadAllData();
};

function handleLoadingScreen(){
  const skip = localStorage.getItem("skipLoading");
  if(skip === "true"){
    document.getElementById("loadingScreen").style.display = "none";
    localStorage.removeItem("skipLoading");
  }
}
function hideLoading(){
  const ls = document.getElementById("loadingScreen");
  if(ls) ls.style.display = "none";
}

// ── USER INFO ──
const currentUser = localStorage.getItem("currentUser");
const otherUser   = currentUser === "Kishore" ? "Darshini" : "Kishore";

function showUserInfo(){
  if(document.getElementById("avatar1")){
    document.getElementById("avatar1").textContent   = currentUser.charAt(0);
    document.getElementById("avatar2").textContent   = otherUser.charAt(0);
    document.getElementById("row1name").textContent  = currentUser;
    document.getElementById("row2name").textContent  = otherUser;
    document.getElementById("bal-name1").textContent = currentUser;
    document.getElementById("bal-name2").textContent = otherUser;
  }
  if(document.getElementById("welcomeUser")){
    const hour = new Date().getHours();
    let greeting = "Good Morning";
    if(hour >= 12 && hour < 17) greeting = "Good Afternoon";
    else if(hour >= 17)         greeting = "Good Evening";
    document.getElementById("welcomeUser").innerHTML = "👋 " + greeting + ", " + currentUser;
  }
}

function calcTotals(transactions, person){
  const rows = person ? transactions.filter(t => t.person === person) : transactions;
  let income=0, expense=0, saving=0;
  rows.forEach(t => {
    const amt  = Number(t.amount) || 0;
    const type = (t.type || "").toLowerCase().trim();
    if(type === "income")       income  += amt;
    else if(type === "expense") expense += amt;
    else if(type === "saving")  saving  += amt;
  });
  return { income, expense, saving, balance: income - expense - saving };
}

function fmt(n){ return "₹" + Number(n).toLocaleString("en-IN"); }

function fmtDate(raw){
  if(!raw) return "—";
  const d = new Date(raw);
  if(isNaN(d)) return raw;
  return String(d.getDate()).padStart(2,"0") + "-" +
         String(d.getMonth()+1).padStart(2,"0") + "-" + d.getFullYear();
}

// ── NORMALISE ROW — handles any Google Sheet column name capitalisation ──
function normaliseRow(t){
  return {
    person      : t["Person"]      || t["person"]      || "",
    type        : t["Type"]        || t["type"]        || "",
    category    : t["Category"]    || t["category"]    || "",
    amount      : t["Amount"]      || t["amount"]      || 0,
    date        : t["Date"]        || t["date"]        || "",
    description : t["Description"] || t["description"] || "",
    payment     : t["Payment Method"] || t["payment"]  || t["Payment"] || "",
    _raw        : t   // keep original for edit reference
  };
}

async function loadAllData(){
  try{
    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbyr5Uu3r7hjsz2JHsFpvwzTyMAIAlU5gSVBAm2mznw7GYIHjeQllzT-9WCHMT-ZJL0u/exec?action=transactions"
    );
    const raw = await response.json();
    const transactions = raw.map(normaliseRow);

    const u1  = calcTotals(transactions, currentUser);
    const u2  = calcTotals(transactions, otherUser);
    const all = calcTotals(transactions, null);

    document.getElementById("balance1").textContent        = fmt(u1.balance);
    document.getElementById("balance2").textContent        = fmt(u2.balance);
    document.getElementById("balanceCombined").textContent = fmt(all.balance);

    document.getElementById("r1income").textContent  = fmt(u1.income);
    document.getElementById("r1expense").textContent = fmt(u1.expense);
    document.getElementById("r1saving").textContent  = fmt(u1.saving);
    document.getElementById("r2income").textContent  = fmt(u2.income);
    document.getElementById("r2expense").textContent = fmt(u2.expense);
    document.getElementById("r2saving").textContent  = fmt(u2.saving);
    document.getElementById("r3income").textContent  = fmt(all.income);
    document.getElementById("r3expense").textContent = fmt(all.expense);
    document.getElementById("r3saving").textContent  = fmt(all.saving);

    // ── DATE RANGE on dashboard ──
    const dates = transactions
      .map(t => new Date(t.date))
      .filter(d => !isNaN(d))
      .sort((a,b) => a-b);
    if(dates.length && document.getElementById("dashFromDate")){
      document.getElementById("dashFromDate").textContent = fmtDate(dates[0]);
      document.getElementById("dashToDate").textContent   = fmtDate(dates[dates.length-1]);
    }

    // Recent — current user last 5
    const myTxns = transactions
      .filter(t => t.person === currentUser)
      .slice(-5).reverse();
    renderRecentTransactions(myTxns);

  } catch(error){
    console.error(error);
    if(document.getElementById("recentTransactions"))
      document.getElementById("recentTransactions").innerHTML =
        '<div style="text-align:center;padding:20px;color:#dc2626;font-size:14px;">Could not load data</div>';
  } finally {
    hideLoading();
  }
}

const catIcons = {
  salary:"💰", fuel:"⛽", grocery:"🛒", shopping:"🛍️",
  dining:"🍽️", medical:"🏥", saving:"💎", transport:"🚌",
  rent:"🏠", loan:"🏦", sharing:"🤝", other:"📌"
};

function renderRecentTransactions(txns){
  const container = document.getElementById("recentTransactions");
  if(!txns.length){
    container.innerHTML = '<div style="text-align:center;padding:20px;color:#9ca3af;font-size:14px;">No transactions yet</div>';
    return;
  }
  let html = "";
  txns.forEach(t => {
    const type   = (t.type||"").toLowerCase();
    const cat    = (t.category||t.type||"Other").toLowerCase();
    const icon   = catIcons[cat] || "📌";
    const amtCls = type==="income" ? "income" : type==="saving" ? "saving" : "expense";
    const sign   = type==="income" ? "+" : "-";
    const sub    = t.payment ? t.payment : (t.description ? t.description : "");
    html += `
      <div class="transaction-card">
        <div class="txn-left">
          <div class="txn-icon">${icon}</div>
          <div>
            <div class="txn-title">${t.category||t.type||"—"}</div>
            <div class="txn-date">${fmtDate(t.date)}${sub ? " · "+sub : ""}</div>
          </div>
        </div>
        <div class="txn-amount ${amtCls}">${sign}${fmt(t.amount)}</div>
      </div>`;
  });
  container.innerHTML = html;
}

function showLogoutPopup(){ document.getElementById("logoutPopup").style.display = "flex"; }
function closeLogoutPopup(){ document.getElementById("logoutPopup").style.display = "none"; }
function logout(){
  clearTimeout(autoLogoutTimer);
  localStorage.removeItem("financeLogin");
  localStorage.removeItem("currentUser");
  localStorage.removeItem("skipLoading");
  window.location.href = "login.html";
}
