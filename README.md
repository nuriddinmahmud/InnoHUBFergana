# 🚀 Inno HUB — O‘zbek Tilidagi Dasturlash Ta’lim Platformasi

**Inno HUB** — bu o‘zbek tilida sifatli IT ta’limini ommalashtirish maqsadida yaratilgan zamonaviy ta’lim platformasi. Platforma foydalanuvchilarga video darsliklar, interaktiv kod tahrirlovchisi va shaxsiy o‘quv yo‘nalishlarini taklif etadi.



---

## 🛠 Texnologik Stack

Loyiha eng so'nggi va samarali texnologiyalar asosida qurilgan:

* **Frontend:** React 19 (Vite)
* **Styling:** Tailwind CSS (Custom Dark Theme)
* **Animations:** Framer Motion
* **Icons:** Lucide-React
* **Fonts:** Inter (UI), JetBrains Mono (Code)
* **Routing:** React Router DOM v7

---

## ✨ Asosiy Xususiyatlar (Features)

### 🎨 Foydalanuvchi Interfeysi
* **Dark Theme:** To'liq qora (#0A0A0A) va yashil (#22C55E) ranglar uyg'unligi.
* **Responsive Design:** 1440px desktop formatidan tortib, barcha qurilmalarga moslashuvchan UI.
* **Matrix Effect:** Hero qismida maxsus animatsion fon.

### 📚 O'quv Imkoniyatlari
* **Video Kurslar:** Har bir dars uchun YouTube integratsiyasi.
* **Online Compiler:** Brauzerni o'zida kod yozish va natijani ko'rish imkoniyati (JS, Python, HTML/CSS).
* **Learning Paths:** Web va Dasturlash yo'nalishlari uchun bosqichma-bosqich yo'l xaritalari.
* **Student Dashboard:** Kurs progressini kuzatish va sertifikatlarni boshqarish.

### 🛡 Admin Panel
* Kurslar va mavzularni boshqarish (CRUD).
* Foydalanuvchilar statistikasi va platforma tahlili.

---

## 🏗 Loyiha Strukturasi

```text
src/
├── assets/          # Rasmlar va shriftlar
├── components/      # UI komponentlar (Navbar, Footer, Card, Button)
├── context/         # Global holat boshqaruvi (Auth, Progress)
├── layouts/         # Sahifa qoliplari (AdminLayout, StudentLayout)
├── pages/           # Sahifalar (Home, Courses, Lesson, Login)
├── styles/          # Tailwind va global CSS
└── utils/           # Yordamchi funksiyalar va doimiy o'zgaruvchilar