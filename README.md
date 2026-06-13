# NearBazaar 🛍️

**Shop Nearby, Save Easy** — A hyperlocal marketplace web app connecting customers, shopkeepers, and delivery partners in one platform.

🔗 **Live Demo:** [nearbaz.netlify.app](https://nearbaz.netlify.app/)

> ⚠️ This is not a final product — it's a working prototype built for my Capstone Project. AI assistance was used during development.

---

## 📱 Overview

NearBazaar is a mobile-first Progressive Web App (PWA) with three role-based experiences:

- **Customer** — Browse nearby shops, add items to cart, place orders, and track delivery.
- **Shopkeeper** — Manage shop profile, inventory, and incoming orders.
- **Delivery Partner** — Accept delivery requests, view routes, and track earnings.

## 🚀 Features

- Location-based shop discovery
- Real-time order tracking and notifications (Firebase Realtime Database)
- Role-based authentication (Email/Password & Google Sign-In)
- Cart management with conflict resolution (single-shop cart enforcement)
- Inventory management for shopkeepers
- Driver dashboard with earnings, stats, and route view
- Responsive mobile-app-style UI

## 🛠️ Tech Stack

- **Frontend:** HTML, CSS, Vanilla JavaScript
- **Backend / Services:** Firebase Authentication, Cloud Firestore, Firebase Realtime Database
- **Hosting:** Netlify

## 📂 Project Structure

```
NearBazaar/
├── assets/              # Logos and icons
├── css/
│   ├── main.css
│   ├── components.css
│   ├── customer.css
│   ├── shopkeeper.css
│   └── driver.css
├── js/
│   ├── app.js           # Core navigation & shared logic
│   ├── auth.js          # Authentication flows
│   ├── customer.js       # Customer dashboard logic
│   ├── shopkeeper.js     # Shopkeeper dashboard logic
│   ├── driver.js         # Delivery partner dashboard logic
│   └── notifications.js  # Notification handling
└── index.html
```

## ⚙️ Setup & Running Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/Mayureshwar18/NearBazaar.git
   ```
2. Open `NearBazaar/index.html` in a browser, or serve it with a local server:
   ```bash
   npx serve NearBazaar
   ```
3. The app connects to a Firebase project for authentication and data storage (see [Important Note](#-important-note-on-firebase-config) below).

## 📄 Presentation

A project presentation (`NearBazaar_Presentation.pptx`) is included describing the Capstone project goals, features, and architecture.

## ⚠️ Important Note on Firebase Config

This project's Firebase configuration (API key, project ID, etc.) is currently hardcoded in `index.html`. While Firebase web API keys are not secret in the traditional sense, your **Firestore/Realtime Database Security Rules** must be properly configured to prevent unauthorized read/write access. Before using this in any real-world setting, review and lock down your Firebase Security Rules.

## 👤 Author

**Mayureshwar** — Capstone Project

## 📃 License

This project is for educational/demo purposes as part of a Capstone Project.
