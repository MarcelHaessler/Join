# Join - Kanban Project Management Tool

![Join Logo](./assets/img/logo_dark.svg)

**Join** is a high-performance, web-based Kanban project management tool designed to streamline task tracking and team collaboration. Inspired by modern productivity suites, it offers a seamless experience for managing tasks from inception to completion.

---

## 🚀 Key Features

### 📊 Dashboard (Summary)
Get an immediate overview of your project status. View counts for tasks in progress, awaiting feedback, and upcoming deadlines at a glance.

### 📋 Kanban Board
- **Drag & Drop:** Intuitively move tasks between phases (To Do, In Progress, Await Feedback, Done).
- **Task Details:** Deep-dive into tasks to see descriptions, subtasks, and assigned team members.
- **Search:** Quickly find specific tasks using the real-time search filter.

### ➕ Task Management
Create comprehensive tasks with:
- Titles and descriptions
- Due dates with validation
- Priority levels (Urgent, Medium, Low)
- Assigned contacts
- Categorization (User Story, Technical Task)
- Nested subtasks with progress tracking

### 👥 Contact Management
Maintain a centralized contact list. Add, edit, or delete contacts to easily assign them to various project tasks.

---

## 🛠️ Technology Stack

- **Frontend:** HTML5, Vanilla CSS3, JavaScript (ES6+)
- **Backend/Database:** Firebase Realtime Database
- **Authentication:** Firebase Auth (Email/Password & Guest Login)
- **Architecture:** Modular JavaScript with Template rendering

---

## 📂 Project Structure

### HTML Core
- `index.html`: Desktop-optimized login landing page.
- `summary.html`: The central hub for project metrics.
- `board.html`: Interactive Kanban board.
- `add_task.html`: Dedicated form for new task creation.
- `contacts.html`: Address book for team management.

### Style System (`/CSS`)
- `layout.css`: Core grid system and responsive breakpoints.
- `style.css`: Global variables and base styling.
- `task_card.css`: Detailed styles for the interactive task overlays.
- `logo_animation.css`: Premium landing page animations.

### Logic Layer (`/JS`)
- `board.js`: Drag-and-drop logic and board rendering.
- `firebaseAuth.js`: Secure initialization of Firebase services.
- `summary-firebase.js`: Real-time data aggregation for the dashboard.
- `add_task_form_right.js`: Sophisticated form handling for assignments and subtasks.

---

## 📥 Installation & Setup

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/marcelhassler/Join.git
   ```
2. **Open the Project:**
   Simply open `index.html` in your preferred web browser, or use a Live Server extension (e.g., in VS Code) for the best experience.

3. **Firebase Configuration:**
   *Note: The project is currently configured to connect to a specific Firebase instance. To use your own, update the config object in `JS/firebaseAuth.js`.*

---

## 👤 Author
Developed by **Marcel Hassler** as part of a high-end web development project.

---
*This project was created for educational purposes at the Developer Akademie.*