function doPost(e) {

  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName("TRANSACTIONS");

  const data = JSON.parse(e.postData.contents);

  // Handle UPDATE action
  if (data.action === "update") {
    const rows = sheet.getDataRange().getValues();
    for (let i = 1; i < rows.length; i++) {
      const rowDate   = new Date(rows[i][0]).toDateString();
      const rowPerson = rows[i][1];
      const rowAmount = String(rows[i][4]);
      const origDate  = new Date(data.originalDate).toDateString();
      if (rowPerson === data.originalPerson &&
          rowAmount === String(data.originalAmount) &&
          rowDate   === origDate) {
        sheet.getRange(i + 1, 1, 1, 7).setValues([[
          new Date(data.date),
          data.person,
          data.type,
          data.category,
          data.amount,
          data.description,
          data.payment
        ]]);
        return ContentService
          .createTextOutput(JSON.stringify({ status: "success" }))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: "Row not found" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // Handle ADD action (default)
  sheet.appendRow([
    new Date(data.date || new Date()),
    data.person,
    data.type,
    data.category,
    data.amount,
    data.description,
    data.payment
  ]);

  // Send WhatsApp notification AFTER appendRow — outside the array
  sendWhatsAppNotification(data);

  return ContentService
    .createTextOutput(JSON.stringify({ status: "success" }))
    .setMimeType(ContentService.MimeType.JSON);
}


function doGet(e) {

  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName("TRANSACTIONS");

  const data = sheet.getDataRange().getValues();

  if (e.parameter.action === "transactions") {

    let result = [];

    for (let i = 1; i < data.length; i++) {
      result.push({
        date        : data[i][0],
        person      : data[i][1],
        type        : data[i][2],
        category    : data[i][3],
        amount      : data[i][4],
        description : data[i][5],
        payment     : data[i][6]   // ← column G
      });
    }

    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // Summary totals (fallback)
  let income = 0, expense = 0, saving = 0;

  for (let i = 1; i < data.length; i++) {
    const type   = data[i][2];
    const amount = Number(data[i][4]);
    if (type === "Income")  income  += amount;
    if (type === "Expense") expense += amount;
    if (type === "Saving")  saving  += amount;
  }

  return ContentService
    .createTextOutput(JSON.stringify({
      income, expense, saving,
      balance: income - expense - saving
    }))
    .setMimeType(ContentService.MimeType.JSON);
}


function sendWhatsAppNotification(data) {
  try {
    var sheet = SpreadsheetApp
      .getActiveSpreadsheet()
      .getSheetByName("Config");
    if (!sheet) return;

    var rows = sheet.getDataRange().getValues();
    var cfg  = {};
    rows.forEach(function(row) {
      if (row[0]) cfg[row[0]] = row[1];
    });

    var sid    = cfg["TWILIO_SID"];
    var token  = cfg["TWILIO_TOKEN"];
    var from   = cfg["TWILIO_FROM"];
    var phones = [
      cfg["PHONE_KISHORE"],
      cfg["PHONE_DARSHINI"]
    ].filter(Boolean);

    var typeEmoji = data.type === "Income" ? "📈"
                  : data.type === "Saving" ? "🏦" : "📉";

    var msg = "💰 New Entry by " + data.person + "\n"
            + "📂 " + data.category + " · " + typeEmoji + " " + data.type + "\n"
            + "💵 ₹" + data.amount + " · 💳 " + (data.payment || "—") + "\n"
            + "📅 " + data.date
            + (data.description ? "\n📝 " + data.description : "");

    var creds = Utilities.base64Encode(sid + ":" + token);
    var url   = "https://api.twilio.com/2010-04-01/Accounts/" + sid + "/Messages.json";

    phones.forEach(function(to) {
      UrlFetchApp.fetch(url, {
        method           : "post",
        headers          : { "Authorization": "Basic " + creds },
        payload          : { From: from, To: to, Body: msg },
        muteHttpExceptions: true
      });
    });

  } catch(err) {
    Logger.log("WhatsApp error: " + err.toString());
  }
}
