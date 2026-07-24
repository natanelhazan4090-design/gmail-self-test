const CONFIG = Object.freeze({
  RECIPIENT: "natanelhazan4090@gmail.com",
  ACCESS_CODE: "CHANGE_THIS_TO_A_LONG_PRIVATE_CODE",
  DAILY_LIMIT: 10,
  COOLDOWN_MS: 60 * 1000,
  MAX_SUBJECT_LENGTH: 120,
  MAX_MESSAGE_LENGTH: 5000
});

function doGet() {
  return responsePage({
    type: "mailflow-result",
    ok: true,
    requestId: "",
    message: "MailFlow endpoint is active."
  });
}

function doPost(event) {
  const parameters = event && event.parameter ? event.parameter : {};
  const requestId = clean(parameters.requestId, 120);
  const accessCode = String(parameters.accessCode || "");
  const subject = clean(parameters.subject, CONFIG.MAX_SUBJECT_LENGTH);
  const message = clean(parameters.message, CONFIG.MAX_MESSAGE_LENGTH);
  const lock = LockService.getScriptLock();

  try {
    if (!lock.tryLock(5000)) {
      return responsePage(result(false, requestId, "השרת עסוק כרגע. נסה שוב בעוד כמה שניות."));
    }

    if (accessCode !== CONFIG.ACCESS_CODE || CONFIG.ACCESS_CODE === "CHANGE_THIS_TO_A_LONG_PRIVATE_CODE") {
      return responsePage(result(false, requestId, "קוד הגישה שגוי או שלא הוחלף בתוך Code.gs."));
    }

    if (!subject || !message) {
      return responsePage(result(false, requestId, "צריך למלא נושא והודעה."));
    }

    if (String(parameters.subject || "").length > CONFIG.MAX_SUBJECT_LENGTH ||
        String(parameters.message || "").length > CONFIG.MAX_MESSAGE_LENGTH) {
      return responsePage(result(false, requestId, "הנושא או ההודעה ארוכים מדי."));
    }

    const properties = PropertiesService.getScriptProperties();
    const now = Date.now();
    const dateKey = Utilities.formatDate(new Date(now), Session.getScriptTimeZone(), "yyyy-MM-dd");
    const countKey = `mailflow_count_${dateKey}`;
    const lastSentKey = "mailflow_last_sent_at";
    const dailyCount = Number(properties.getProperty(countKey) || 0);
    const lastSentAt = Number(properties.getProperty(lastSentKey) || 0);

    if (dailyCount >= CONFIG.DAILY_LIMIT) {
      return responsePage(result(false, requestId, "המגבלה היומית של 10 הודעות נוצלה."));
    }

    const remainingCooldown = CONFIG.COOLDOWN_MS - (now - lastSentAt);
    if (remainingCooldown > 0) {
      return responsePage(result(false, requestId, `צריך להמתין עוד ${Math.ceil(remainingCooldown / 1000)} שניות.`));
    }

    if (MailApp.getRemainingDailyQuota() < 1) {
      return responsePage(result(false, requestId, "מכסת השליחה היומית של Google הסתיימה."));
    }

    MailApp.sendEmail({
      to: CONFIG.RECIPIENT,
      subject: subject,
      body: message,
      name: "MailFlow"
    });

    properties.setProperty(countKey, String(dailyCount + 1));
    properties.setProperty(lastSentKey, String(now));

    return responsePage(result(true, requestId, `ההודעה נשלחה בהצלחה אל ${CONFIG.RECIPIENT}.`));
  } catch (error) {
    console.error(error);
    return responsePage(result(false, requestId, "השליחה נכשלה ב-Google Apps Script."));
  } finally {
    try {
      lock.releaseLock();
    } catch (_) {
      // The lock may not have been acquired.
    }
  }
}

function clean(value, maximumLength) {
  return String(value || "").trim().slice(0, maximumLength);
}

function result(ok, requestId, message) {
  return {
    type: "mailflow-result",
    ok: Boolean(ok),
    requestId: String(requestId || ""),
    message: String(message || "")
  };
}

function responsePage(payload) {
  const serialized = JSON.stringify(payload).replace(/</g, "\\u003c");
  const visibleMessage = escapeHtml(payload.message);
  const html = `<!doctype html>
<html lang="he" dir="rtl">
<head><meta charset="utf-8"><title>MailFlow</title></head>
<body style="font-family:Arial,sans-serif;background:#07101f;color:#fff;padding:24px">
  <p>${visibleMessage}</p>
  <script>window.parent.postMessage(${serialized}, "*");<\/script>
</body>
</html>`;

  return HtmlService
    .createHtmlOutput(html)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
