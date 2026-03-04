# 🚀 Inno HUB — Uzbek-Language Programming Education Platform

![License](https://img.shields.io/badge/license-MIT-blue)
![React](https://img.shields.io/badge/React-19-blue)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v3-green)

**Inno HUB** is a modern educational platform designed to provide high-quality IT education in the Uzbek language. The platform offers video tutorials, an interactive code editor, and personalized learning paths for learners interested in web development and programming.

---

## 🛠 Technology Stack

- **Frontend:** React 19 (Vite)
- **Styling:** Tailwind CSS (Custom Dark Theme)
- **Animations:** Framer Motion
- **Icons:** Lucide-React
- **Fonts:** Inter (UI), JetBrains Mono (Code)
- **Routing:** React Router DOM v7

---

## ✨ Key Features

### 🎨 User Interface
- **Dark Theme:** Full black (#0A0A0A) with green (#22C55E) accents
- **Responsive Design:** Works on desktop (1440px) down to mobile devices
- **Matrix Effect:** Animated hero background for a dynamic look

### 📚 Learning Capabilities
- **Video Courses:** Integrated with YouTube for each lesson
- **Online Compiler:** Run code directly in the browser (JS, Python, HTML/CSS)
- **Learning Paths:** Step-by-step roadmaps for Web and Programming tracks
- **Student Dashboard:** Track course progress and manage certificates

### 🛡 Admin Panel
- CRUD operations for courses and topics
- View user statistics and platform analytics

---

## 🏗 Project Structure

```text
src/
├── assets/          # Images and fonts
├── components/      # UI components (Navbar, Footer, Card, Button)
├── context/         # Global state management (Auth, Progress)
├── layouts/         # Page layouts (AdminLayout, StudentLayout)
├── pages/           # Pages (Home, Courses, Lesson, Login)
├── styles/          # Tailwind and global CSS
└── utils/           # Helper functions and constants
