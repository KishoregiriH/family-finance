# WhatsApp Notification Setup (Twilio → Google Apps Script)

When a new transaction is added, both Kishore and Darshini will get a WhatsApp message like:
> 💰 New Entry by Kishore
> 📂 Grocery · 📉 Expense
> 💵 ₹850 · 💳 UPI
> 📅 26-06-2025
> 📝 Big Bazaar

---

## Step 1 — Create a Twilio Account

1. Go to https://www.twilio.com and sign up (free trial available)
2. Enable the **WhatsApp Sandbox** under Messaging → Try it out → Send a WhatsApp message
3. Both Kishore and Darshini must send the join code to the sandbox number from their phones (e.g. "join <word>-<word>" to +1 415 523 8886)
4. Note down:
   - `Account SID`
   - `Auth Token`
   - Twilio WhatsApp number (e.g. `whatsapp:+14155238886`)

---

## Step 2 — Add phone numbers to your Google Sheet

Add a sheet tab named **Config** with:

| Key              | Value               |
|------------------|---------------------|
| TWILIO_SID       | ACxxxxxxxxxxxx      |
| TWILIO_TOKEN     | your_auth_token     |
| TWILIO_FROM      | whatsapp:+14155238886 |
| PHONE_KISHORE    | whatsapp:+91XXXXXXXXXX |
| PHONE_DARSHINI   | whatsapp:+91XXXXXXXXXX |

---

## Step 3 — Add this function to your Google Apps Script

Paste this into your existing `.gs` file:

```javascript
function sendWhatsAppNotification(data) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Config");
    if (!sheet) return;

    const cfg = {};
    sheet.getDataRange().getValues().forEach(row => {
      if (row[0]) cfg[row[0]] = row[1];
    });

    const sid      = cfg["TWILIO_SID"];
    const token    = cfg["TWILIO_TOKEN"];
    const from     = cfg["TWILIO_FROM"];
    const phones   = [cfg["PHONE_KISHORE"], cfg["PHONE_DARSHINI"]].filter(Boolean);

    const typeEmoji = data.type === "Income" ? "📈" : data.type === "Saving" ? "🏦" : "📉";
    const msg = `💰 New Entry by ${data.person}\n` +
                `📂 ${data.category} · ${typeEmoji} ${data.type}\n` +
                `💵 ₹${data.amount} · 💳 ${data.payment}\n` +
                `📅 ${data.date}` +
                (data.description ? `\n📝 ${data.description}` : "");

    const credentials = Utilities.base64Encode(sid + ":" + token);
    const url = `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`;

    phones.forEach(to => {
      UrlFetchApp.fetch(url, {
        method: "post",
        headers: { "Authorization": "Basic " + credentials },
        payload: { From: from, To: to, Body: msg },
        muteHttpExceptions: true
      });
    });
  } catch(e) {
    console.error("WhatsApp notification failed:", e);
  }
}
```

---

## Step 4 — Call it from your existing doPost function

Inside your `doPost(e)` where you handle `action === "add"`, add one line after saving the row:

```javascript
// After inserting the row to the sheet:
sendWhatsAppNotification(data);
```

Example:
```javascript
if (data.action === "add") {
  sheet.appendRow([...]);          // your existing row insert
  sendWhatsAppNotification(data);  // ← add this line
  return ContentService...
}
```

---

## Cost

- Twilio free trial gives ~$15 credit (enough for ~1000 messages)
- After trial: ~$0.005 per WhatsApp message (~₹0.40)
- For ~30 entries/month = essentially free

---

## Notes

- You do NOT need to change any frontend HTML/JS files for this
- Notifications fire only on new entries, not on edits
- If you want edit notifications too, call `sendWhatsAppNotification` from your `action === "update"` block as well
