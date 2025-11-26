# ✨ Aurastart

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Next.js](https://img.shields.io/badge/Next.js-14.0-black)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248)

**A minimalist, aesthetic personal startpage with drag-and-drop sorting & privacy features.**

[Live Demo](https://aurastart.zeabur.app) · [Report Bug](https://github.com/cimorn/Aurastart/issues) · [🌏 README in Chinese](docs/README.zh-CN.md)

![App Screenshot](public/demo.jpg)

</div>

---

## 📖 Introduction

**Aurastart** is your starting point for digital life. Built with Next.js and MongoDB, it abandons the clutter of traditional startpages in favor of a "Clean White" aesthetic and "Aura UI" design.

It features multi-engine search, drag-and-drop sidebar sorting, and a unique "Invisible Admin Mode" to protect your private links.

## ✨ Features

### 🎨 UI/UX Design
- **Dashboard Layout**: 3-column layout featuring Time/Weather, Identity, and Daily Quotes.
- **Minimalist Aesthetic**: Clean white style with refined shadows and rounded corners.
- **Responsive Sidebar**: Auto-collapsing sidebar that switches to icon-only mode.

### 🛠️ Functionality
- **Multi-Search**: Switch between Google, Baidu, and Bing with dropdown memory.
- **Drag & Drop Sorting**: Reorder sidebar categories freely, synced to DB.
- **Privacy Vault**: Hidden "Secret Links" revealed only in Admin Mode.
- **Pin to Home**: Pin your favorite links to the main dashboard.
- **Batch Import**: Import bookmarks via Excel (`.xlsx`).

### 🔐 Geek Mode
- **Invisible Login**: Type your password directly into the search bar to unlock Admin Mode.
- **Visual Editing**: Edit or delete links directly on the UI.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14 (App Router)](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (with Mongoose ORM)
- **Auth**: JWT (Custom Implementation)
- **Utils**: `@dnd-kit` (Sorting), `xlsx` (Import)

## 🚀 Installation & Deployment

### 0. Database Setup
Before running the project, you need a MongoDB database.
* **Option A: Zeabur (Recommended)**: Create a MongoDB service in Zeabur and copy the connection string.
* **Option B: MongoDB Atlas / Local**: Use a standard connection string.

### 1. Local Development

```bash
# 1. Clone repo
git clone [https://github.com/cimorn/Aurastart.git](https://github.com/cimorn/Aurastart.git)
cd Aurastart

# 2. Install dependencies
npm install

# 3. Configure Environment Variables
# Create a .env.local file in the root directory
````

**File: `.env.local`**

```env
# Your MongoDB Connection String
MONGODB_URI=mongodb://user:pass@host:port/db_name

# Secret key for JWT (Any random string)
ADMIN_PASSWORD=your_super_secret_key_here
```

```bash
# 4. Run
npm run dev
```

Visit `http://localhost:3000`.

### 2\. Deploy to Zeabur

The easiest way to deploy is using Zeabur.

1.  **Fork** this repository to your GitHub.
2.  Log in to **Zeabur Dashboard**.
3.  Create New Project -\> **Deploy New Service** -\> **Git**.
4.  Select your forked `Aurastart` repo.
5.  **Important**: Go to the **Variables** tab and add:
      * `MONGODB_URI`: *(Your MongoDB connection string)*
      * `JWT_SECRET`: *(Random string)*
6.  Zeabur will automatically build and deploy.

## 📂 Data Import (Excel)

You can import bookmarks in bulk using an Excel file. The header row must include:

| Column | Description | Example |
| :--- | :--- | :--- |
| **title** | Site Name | GitHub |
| **url** | Link URL | https://github.com |
| **category** | Category Name | Tools |
| **icon** | Emoji or Image URL | 🐙 |
| **desc** | Description | Code Hosting |
| **isSecret** | Private Link? (TRUE/FALSE) | FALSE |
| **isPinned** | Pin to Home? (TRUE/FALSE) | TRUE |

## 🤝 Contributing

Contributions are welcome\! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](https://www.google.com/search?q=LICENSE) file for details.