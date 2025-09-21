 # ProdAIve

![React](https://img.shields.io/badge/React-Frontend-blue?logo=react)
![Python](https://img.shields.io/badge/Python-ML/Data-blue?logo=python)
![Google Cloud](https://img.shields.io/badge/Google_Cloud-Platform-blue?logo=google-cloud)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

**An intelligent, AI-driven platform for real-time monitoring and optimization of industrial processes.**

ProdAIve aims to make complex industrial data accessible and actionable. It combines a modern, responsive user interface with powerful AI-driven insights to help users proactively identify, understand, and resolve operational anomalies.

## ✨ Project Vision

> To provide an intelligent, intuitive, and visually engaging platform that empowers users to monitor, analyze, and optimize industrial processes with AI-driven insights, making complex data accessible to both experts and laypersons.

This vision guides the development of all components within the ProdAIve ecosystem, ensuring a focus on clarity, interactivity, and actionability.

## 📂 Repository Structure

```
.
├── docs/                # Project documentation, design documents, and diagrams (PDFs, etc.)
├── frontend_dashboard/  # React-based frontend application
│   └── README.md        # --> Detailed frontend setup and documentation
│
├── mlops/               # (Planned) Scripts for MLOps pipeline (deployment, monitoring)
├── data_simulation/     # (Planned) Scripts to generate synthetic industrial data
├── model_training/      # (Planned) Notebooks and scripts for training ML models
│
└── README.md            # This file: High-level overview of the ProdAIve project
```

## 🏛️ Architecture Overview

The ProdAIve platform is composed of three main components that work together to deliver a seamless, data-driven experience:

1.  **Frontend Dashboard**: A modern, responsive web application that serves as the primary user interface for data visualization and interaction.
2.  **Data & ML Pipeline**: A set of scripts and services responsible for data simulation, storage, preprocessing, and model training/deployment on Google Cloud.
3.  **Backend Services (Planned)**: The future API layer that will connect the frontend to the live data pipeline and orchestrate AI assistant interactions.

## 📂 Project Components

### 🖥️ Frontend Dashboard (`/frontend_dashboard`)

The main web application and user interface for the ProdAIve dashboard. It provides an interactive and visually rich experience for monitoring industrial processes.

*   **Purpose**: To visualize complex industrial data, present AI-driven alerts, and guide users through troubleshooting workflows.
*   **Tech Stack**: React, TypeScript, Vite, Material-UI, Recharts, Reactflow, Framer Motion.
*   **Key Features**: AI Assistant, interactive process flow diagrams, real-time KPI monitoring, and predictive quality dashboards.
*   **Status**: Core UI/UX is implemented with mock data. Ready for backend integration.

> **For detailed setup and development instructions, please see the frontend_dashboard/README.md.**

### 🔬 Data & ML Pipeline (`/mlops`, `/data_simulation`, `/model_training`)

This is the data backbone of the project. It includes scripts for simulating industrial data, managing it in the cloud, and training the machine learning models that power the platform's predictive insights.

*   **Purpose**: To create a realistic data environment and deploy a predictive model for clinker quality.
*   **Tech Stack**: Python, Google BigQuery, Google Vertex AI, Scikit-learn.
*   **Workflow**:
    1.  `simulate_kiln_data.py`: Generates simulated kiln process data.
    2.  `load_data_to_bigquery.py`: Loads the simulated data into a BigQuery table.
    3.  `preprocess_data.py`: Fetches and preprocesses data from BigQuery for training.
    4.  `train_clinker_model.py`: Trains a RandomForest model on the processed data.
    5.  `deploy_model_to_vertex_ai.py`: Deploys the trained model to a Vertex AI endpoint for real-time predictions.

### ⚙️ Backend Services (Planned)

This component will serve as the central nervous system of the platform, connecting the frontend to the data pipeline and enabling real-time functionality.

*   **Purpose**: To serve live data from BigQuery to the frontend, handle API requests, and manage the logic for the Gemini AI Assistant.
*   **Tech Stack (Proposed)**: Python (FastAPI/Flask), Google Cloud Functions, or another scalable serverless solution.
*   **Status**: Not yet implemented. This is the next major development phase.

## 🚀 Project Status & Next Steps

The high-level UI/UX design and core frontend structure are complete, with visual enhancements and mock data integration. The initial data and machine learning pipeline has been established and deployed on Google Cloud.

The next crucial step is to **integrate the frontend with actual backend services**. This will involve:

1.  Building a robust API to fetch real-time data from BigQuery.
2.  Connecting the frontend components to this live data feed.
3.  Developing the AI assistant's logic to interact with live data and provide actionable insights based on model predictions from Vertex AI.

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file in the respective package for details.