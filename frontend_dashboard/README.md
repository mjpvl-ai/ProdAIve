 # ProdAIve Dashboard

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

An intelligent, AI-driven dashboard for real-time monitoring and optimization of industrial processes. ProdAIve provides a modern, responsive, and data-rich experience to proactively identify and resolve operational anomalies.

---

<!-- Optional: Add a screenshot or GIF of the dashboard in action -->
<!-- ![ProdAIve Dashboard Demo](path/to/your/screenshot.png) -->

## ✨ Key Features

- **AI-Powered Assistance**: An integrated Gemini AI Assistant provides critical alerts, suggests standard operating procedures (SOPs), and enables natural language-based navigation.
- **Interactive Process Flow**: Visualizes the entire industrial process, highlighting areas with anomalies for guided troubleshooting.
- **Real-time Monitoring**: High-level plant-wide KPIs and detailed dashboards for specific areas like Kiln Health and Energy Consumption.
- **Predictive Analytics**: Leverages forecasting models to predict the impact of process deviations on final product quality.
- **Modern UI/UX**: Built with Material-UI and enhanced with smooth, fluid animations via Framer Motion for an intuitive user experience.
- **Guided Workflow**: Takes the guesswork out of troubleshooting by not just showing what's wrong, but where it's happening and how to respond.

## 🛠️ Tech Stack

![React](https://img.shields.io/badge/React-18.2.0-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4.5-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.3.1-purple?logo=vite)
![Material-UI](https://img.shields.io/badge/Material--UI-5.15.20-blue?logo=mui)
![Reactflow](https://img.shields.io/badge/Reactflow-11.11.4-orange)
![Recharts](https://img.shields.io/badge/Recharts-2.12.7-green)
![Framer Motion](https://img.shields.io/badge/Framer%20Motion-11.2.10-black?logo=framer)

- **Framework**: [React](https://reactjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **UI Library**: [Material-UI (MUI)](https://mui.com/)
- **Diagrams**: [Reactflow](https://reactflow.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Linting**: [ESLint](https://eslint.org/)

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.x or higher recommended)
- [npm](https://www.npmjs.com/) (or your favorite package manager)

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/prodaive-dashboard.git
    cd prodaive-dashboard
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Run the development server:**
    The app will be available at `http://localhost:5173`.
    ```sh
    npm run dev
    ```

## 📜 Available Scripts

In the project directory, you can run:

- `npm run dev`: Runs the app in development mode.
- `npm run build`: Builds the app for production to the `dist` folder.
- `npm run lint`: Lints the source code using ESLint.
- `npm run preview`: Serves the production build locally for preview.

## ☁️ Deployment

This project is configured for easy deployment using Firebase Hosting. The `firebase.json` file includes settings to serve the `dist` directory and handle client-side routing.

To deploy, ensure you have the Firebase CLI installed and configured, then run:
```sh
firebase deploy
```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.