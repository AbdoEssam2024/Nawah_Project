# 🧠 Habits App

تطبيق ويب يساعد المستخدم على **تتبع عاداته اليومية والأسبوعية**،  
بحيث يمكنه إضافة عادات جديدة، حذفها، متابعة التقدم الأسبوعي،  
ورؤية **الـ Score لكل أسبوع** في صفحة إحصائيات جذّابة تحتوي على **مخططات بيانية (Bar Chart)**.

---

## 📸 Screenshots
- <h3>Home Page</h3>
<img width="1899" height="956" alt="Happits App — Firefox Developer Edition 18_10_2025 12_55_28 AM" src="https://github.com/user-attachments/assets/e3b4bef6-c71b-4390-82b9-b0416b4208b5" />

- <h3>Statitics Page</h3>
<img width="1920" height="955" alt="Happits App — Firefox Developer Edition 18_10_2025 12_57_02 AM" src="https://github.com/user-attachments/assets/e5aed475-33af-43bb-951d-71e62129ec16" />

---

## 🚀 Features

- ➕ **إضافة عادة جديدة** (ِAdd Happit)
  
  <img width="727" height="882" alt="Add Happit(1)" src="https://github.com/user-attachments/assets/3d786b9b-b2e2-450a-b332-06b8bb6f9ccd" />


- ❌ **حذف العادات** بسهولة
- ✅ **تحديد العادة كمكتملة** خلال الأسبوع
- 📅 **تكرار العادات أسبوعيًا** تلقائيًا (مع إعادة التقييم كل أسبوع)
- 📊 **صفحة إحصائيات** تعرض تطور المستخدم أسبوعيًا عبر **Bar Chart**
- 🔍 **فلترة النتائج حسب الأسبوع او الحالة **
- 💾 **تخزين البيانات محليًا باستخدام `localStorage`** لضمان بقاء التقدم محفوظًا
- 🎨 تصميم متجاوب باستخدام **Bootstrap**
- <h4>DeskTop</h4>
  <img width="1899" height="956" alt="Happits App — Firefox Developer Edition 18_10_2025 12_55_28 AM" src="https://github.com/user-attachments/assets/5a8c45ee-ae68-49b4-ac11-7832325caa02" />
- <h4>Tablet</h4>
  <img width="727" height="882" alt="Happits App — Firefox Developer Edition 18_10_2025 01_05_03 AM" src="https://github.com/user-attachments/assets/4f568ddf-9bbe-4eb7-9721-6475181bb8f6" />
- <h4>Mobile</h4>
  <img width="1587" height="930" alt="Happits App — Firefox Developer Edition 18_10_2025 01_21_55 AM" src="https://github.com/user-attachments/assets/c8874a6a-66f3-42a5-b377-e5a17fcd4f74" />


  

- ⚡ سرعة وسلاسة في الأداء بفضل **JavaScript Vanilla**

---

## 🧩 Tech Stack

| التقنية | الاستخدام |
|----------|------------|
| **HTML5** | بناء هيكل صفحات التطبيق |
| **CSS3 / Bootstrap** | تصميم واجهة المستخدم |
| **JavaScript (ES6)** | المنطق والتحكم في البيانات |
| **Chart.js** | عرض الرسوم البيانية في صفحة الإحصائيات |
| **LocalStorage API** | حفظ بيانات العادات والتقدم محليًا |

## 📈 How It Works

---
1. عند إضافة عادة جديدة، يتم حفظها داخل **localStorage**.
2. كل عادة تحتوي على :

| Key | Description | Example Value | Type |
|------|--------------|----------------|--------|
| **id** | رقم فريد يميز كل عادة | `1` | integer |
| **name** | اسم العادة | `"Read Book"` | string |
| **description** | وصف مختصر للعادة | `"Read for 30 minutes"` | string |
| **completed** | مصفوفة تمثل إنجاز العادة خلال الأسبوع | `[true, false, true, false]` | array\<boolean> |
| **happitDay** | اليوم المحدد لتكرار العادة | `"Monday"` | string |
| **happitDate** | تاريخ بداية العادة | `"2025-10-18"` | date |
| **happitTime** | وقت تنفيذ العادة | `"20:15"` | time |
| **happitMode** | نوع العادة (عادية أو مميزة) | `"normal"` / `"desolate"` | string |
| **note** | ملاحظات إضافية عن العادة عند اتمامها | `"Remember to stretch"` | string |
| **lastChecked** | آخر اسبوع تم فيه اكمال العادة | `2` | integer |
3. عند كل زيارة للتطبيق :
  - يتم حساب ما إذا كانت العادة تم تنفيذها خلال الأسبوع الحالي .
  - إذا بدأ أسبوع جديد، يتم إعادة تعيين حالة الإنجاز (Unchecked) مع الحفاظ على قيمتها فى باقى الاسابيع.
  4. صفحة الإحصائيات تستخدم Chart.js لعرض نتائج كل أسبوع بناءً على عدد العادات المكتملة.
5. يمكن للمستخدم فلترة النتائج حسب الأسبوع من خلال قائمة منسدلة.

<img width="1587" height="930" alt="Happits App — Firefox Developer Edition 18_10_2025 01_21_55 AM" src="https://github.com/user-attachments/assets/f9e35961-0b86-4768-82bd-98143652144b" />

## 🧠 Weekly Score Logic

يتم حساب الـ Score الأسبوعي بناءً على عدد العادات التي تم تحديدها ✅.

مثال:

إذا عندك 5 عادات وتم إنجاز 3 هذا الأسبوع → Score = 60%

يتم تحديث الرسم البياني تلقائيًا بناءً على هذا الـ Score.

## ⚙️ Installation & Usage
1- انسخ المشروع: git clone https://github.com/AbdoEssam2024/Nawah_Project.git <br>
2- افتح الملف index.html في المتصفح او عن طريق Live Server Extension <br>
3- استخدم التطبيق مباشرة (البيانات تُخزّن في المتصفح محليًا).
## 📊 Demo



https://github.com/user-attachments/assets/58661c80-e502-4242-b551-9d4a113a9a07

## 💡 Future Enhancements

⏰ إضافة تذكيرات يومية بالعادات.

📅 دعم الفترات الشهرية (Monthly Goals).

☁️ مزامنة البيانات مع السيرفر بدلاً من LocalStorage.

👤 دعم تعدد المستخدمين.
## 👨‍💻 Developer

- Developed by: Abdo Essam
- 📧 Email: eabdo2051@gmail.com
- 🔗 GitHub: https://github.com/AbdoEssam2024

© 2025 Habits App. All rights reserved.

