# MailFlow — Gmail Sender

אתר Web סטטי ששולח הודעת Gmail אחת לכתובת אימייל חוקית באמצעות Google OAuth ו-Gmail API.

## הפעלת האתר ב-GitHub Pages

1. היכנס למאגר ב-GitHub.
2. פתח **Settings → Pages**.
3. תחת **Build and deployment** בחר:
   - Source: **Deploy from a branch**
   - Branch: **main**
   - Folder: **/(root)**
4. לחץ **Save**.

האתר אמור להתפרסם בכתובת:

```text
https://natanelhazan4090-design.github.io/gmail-self-test/
```

## הגדרת Google OAuth

1. צור פרויקט ב-Google Cloud Console.
2. הפעל את **Gmail API**.
3. הגדר את **Google Auth Platform** כ-External והוסף את חשבון ה-Gmail שלך כ-Test user.
4. הוסף את ההרשאה:

```text
https://www.googleapis.com/auth/gmail.send
```

5. צור OAuth Client מסוג **Web application**.
6. תחת **Authorized JavaScript origins** הוסף:

```text
https://natanelhazan4090-design.github.io
```

7. פתח את האתר, לחץ על כפתור גלגל השיניים, והדבק את ה-OAuth Client ID.
8. התחבר ל-Google, מלא נמען, נושא ותוכן, אשר שהנמען מצפה להודעה ולחץ על שליחה.

## חשוב

- אין להכניס Client Secret, סיסמת Gmail או App Password לקוד או לאתר.
- Access Token נשמר רק בזיכרון הדף ונמחק ברענון.
- האתר כולל אישור לפני כל שליחה, המתנה של דקה ומגבלה מקומית של 10 הודעות ביום.
- אין להשתמש באתר לספאם, הטרדה, התחזות או שליחה למי שלא מצפה לקבל את ההודעה.
