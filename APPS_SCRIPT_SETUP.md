# MailFlow — הגדרת שליחה אוטומטית

האתר שולח הודעה אחת בלחיצה בלי לפתוח Gmail, דרך Google Apps Script.

הנמען קבוע בקוד ל־`natanelhazan4090@gmail.com`, עם דקה בין שליחות ועד 10 הודעות ביום.

## 1. יצירת Apps Script

1. פתח: https://script.google.com/home/start
2. לחץ **New project**.
3. מחק את הקוד הקיים.
4. פתח במאגר הזה את `Code.gs` והעתק את כל התוכן אל Apps Script.

## 2. יצירת קוד גישה פרטי

בתוך `Code.gs` מצא:

```javascript
ACCESS_CODE: "CHANGE_THIS_TO_A_LONG_PRIVATE_CODE",
```

החלף לערך פרטי באורך 12 תווים לפחות, למשל:

```javascript
ACCESS_CODE: "MyPrivateMailCode-2026-X7",
```

אל תכניס את הקוד הפרטי לקובץ הציבורי ב־GitHub.

## 3. פריסה כ־Web App

1. לחץ **Deploy**.
2. בחר **New deployment**.
3. ליד **Select type** בחר **Web app**.
4. תחת **Execute as** בחר **Me**.
5. תחת **Who has access** בחר **Anyone**.
6. לחץ **Deploy**.
7. אשר את ההרשאות לחשבון Google שלך.
8. העתק את כתובת ה־Web App שמסתיימת ב־`/exec`.

אם ערכת את הקוד אחר כך, פתח **Deploy → Manage deployments → Edit → New version → Deploy**.

## 4. חיבור האתר

1. פתח את אתר GitHub Pages.
2. לחץ **פתיחת הגדרות**.
3. הדבק את כתובת ה־`/exec`.
4. הדבק את אותו קוד גישה שהגדרת בתוך `Code.gs`.
5. לחץ **שמירת החיבור**.

עכשיו כתיבת נושא והודעה ולחיצה על **שליחה אוטומטית** תשלח הודעה ישירות, בלי לפתוח Gmail.

## אבטחה

- היעד קבוע בתוך `Code.gs` ואינו מתקבל מהדפדפן.
- השרת מגביל לעשר הודעות ביום ודקה בין הודעות.
- קוד הגישה נשמר מקומית בדפדפן ואינו נכתב במאגר GitHub.
- החלף את קוד הגישה אם מישהו אחר ראה אותו.
