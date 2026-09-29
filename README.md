# 🌱 Plant Pulse

**Instant Plant Care, Smarter Farming.**

Plant Pulse is a web app that helps farmers and plant lovers care for their crops with data-driven insights, live weather, and location-aware tools.

---

## ✨ Features

- 🌿 **Plant care insights** powered by a trained model
- 🌦️ **Live weather data** for your location (via Open-Meteo)
- 🗺️ **Interactive maps** with Leaflet
- 📊 **Charts and analytics** to track trends
- 🔐 **User accounts and cloud data** with Firebase
- 📱 **Responsive, animated UI** that works on desktop and mobile

## 🛠️ Tech Stack

| Area      | Tools                                         |
| --------- | --------------------------------------------- |
| Frontend  | React 19, Vite, React Router                  |
| Styling   | Tailwind CSS 4, Framer Motion                 |
| Data viz  | Chart.js, Recharts, Leaflet                   |
| Services  | Firebase, Open-Meteo API                      |
| Tooling   | ESLint, GitHub Actions (deploy to Pages)      |

## 📁 Project Structure

```
├── .github/workflows/   # CI/CD (GitHub Pages deploy)
├── backend/             # Backend server / API
├── model/               # ML model files
├── src/                 # React app source
├── index.html
├── vite.config.js
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
git clone https://github.com/Plantpulse-app/Plantpulse-app.github.io.git
cd Plantpulse-app.github.io
npm install
```

### Environment variables

Create a `.env` file in the project root and add your own keys:

```env
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

> ⚠️ Never commit real secrets. `.env` is listed in `.gitignore`.

### Run locally

```bash
npm run dev
```

Open the URL shown in your terminal (usually http://localhost:5173).

### Build for production

```bash
npm run build
npm run preview
```

## 📜 Scripts

| Command           | Description                    |
| ----------------- | ------------------------------ |
| `npm run dev`     | Start the dev server           |
| `npm run build`   | Create a production build      |
| `npm run preview` | Preview the production build   |
| `npm run lint`    | Run ESLint                     |

## 🌐 Deployment

Pushes to `main` are deployed to GitHub Pages automatically through the workflow in `.github/workflows`.

## 🤝 Contributing

1. Fork the repo
2. Create a branch: `git checkout -b feature/your-feature`
3. Commit your changes and push
4. Open a pull request

## 📄 License

Add a license of your choice (for example, MIT) in a `LICENSE` file.
