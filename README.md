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

## 🛠️ Technology Stack

The ProdAIve platform is built on a modern, scalable technology stack, leveraging best-in-class tools for frontend, data processing, and artificial intelligence.

| Category                | Technology                                                                                                                                                           |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend**            | ![React](https://img.shields.io/badge/React-blue?logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-blue?logo=typescript) ![Vite](https://img.shields.io/badge/Vite-purple?logo=vite) ![Material-UI](https://img.shields.io/badge/MUI-blue?logo=mui) ![Reactflow](https://img.shields.io/badge/Reactflow-orange) ![Recharts](https://img.shields.io/badge/Recharts-green) ![Framer Motion](https://img.shields.io/badge/Framer-black?logo=framer) |
| **Data & ML**           | ![Python](https://img.shields.io/badge/Python-blue?logo=python) ![Scikit-learn](https://img.shields.io/badge/Scikit--learn-orange?logo=scikit-learn)                     |
| **Cloud & MLOps**       | ![Google Cloud](https://img.shields.io/badge/Google_Cloud-blue?logo=google-cloud) ![Google BigQuery](https://img.shields.io/badge/BigQuery-blue?logo=google-bigquery) ![Vertex AI](https://img.shields.io/badge/Vertex_AI-blue?logo=google-cloud) |
| **Agentic AI**          | ![Google Gemini](https://img.shields.io/badge/Google_Gemini-blue?logo=google-gemini)                                                                                 |

## 🤖 Agentic AI Integration Flow

The core innovation of ProdAIve is its **agentic AI**, powered by Google's Gemini model. The AI is not just a passive chatbot; it's an active, intelligent partner that guides the user through complex data analysis and troubleshooting workflows.

The integration flow is designed to be proactive and intuitive:

1.  **Proactive Anomaly Detection**: The system continuously monitors real-time data streams from the industrial process.
2.  **AI-Triggered Alert**: When the backend detects a significant anomaly (e.g., a temperature spike in the kiln), it triggers the AI agent.
3.  **Guided Response**: The Gemini AI Assistant automatically opens in the UI, presenting a clear, concise alert. Simultaneously, it provides a direct link to the relevant Standard Operating Procedure (SOP) and pivots the main dashboard view to the exact location of the problem on the Process Flow diagram, highlighting the affected component.
4.  **Conversational Navigation**: The user can then engage with the AI using natural language. For example, asking "Show me the kiln's health details" or "What's the impact on energy consumption?"
5.  **Orchestrated UI Changes**: The AI agent interprets these commands and orchestrates the frontend, seamlessly navigating the user to the correct dashboard (e.g., Kiln Health, Energy Cockpit) with smooth, animated transitions. This creates a fluid "analytical story" where the AI guides the user from problem detection to deep-dive analysis and resolution.
6.  **Interactive & Flexible**: The AI panel is fully interactive, allowing for an immersive chat experience or the ability to hide it to focus solely on the data visualizations.

## Repository Structure

```
.
├── adk_data_science_agent/ # A data science agent
├── backend_services/       # Backend services for the platform
├── data_simulation/        # Scripts to generate synthetic industrial data
├── docs/                   # Project documentation, design documents, and diagrams
├── frontend_dashboard/     # React-based frontend application
├── mlops/                  # Scripts for MLOps pipeline (deployment, monitoring)
├── model_training/         # Notebooks and scripts for training ML models
├── vertex_ai_pipelines/    # Vertex AI pipeline definitions
└── README.md               # This file: High-level overview of the project
```

## Architecture Overview

The ProdAIve platform is composed of several key components that work together to deliver a seamless, data-driven experience:

1.  **Frontend Dashboard**: A modern, responsive web application that serves as the primary user interface for data visualization and interaction.
2.  **Backend Services**: The API layer that connects the frontend to the live data pipeline and orchestrates AI assistant interactions.
3.  **Data & ML Pipeline**: A set of scripts and services responsible for data simulation, storage, preprocessing, and model training/deployment on Google Cloud.
4.  **Data Science Agent**: An autonomous agent for data analysis and insights.

## Project Components

### 🖥️ Frontend Dashboard (`/frontend_dashboard`)

The main web application and user interface for the ProdAIve dashboard. It provides an interactive and visually rich experience for monitoring industrial processes.

*   **Purpose**: To visualize complex industrial data, present AI-driven alerts, and guide users through troubleshooting workflows.
*   **Tech Stack**: React, TypeScript, Vite, Material-UI, Recharts, Reactflow, Framer Motion.
*   **Key Features**: AI Assistant, interactive process flow diagrams, real-time KPI monitoring, and predictive quality dashboards.
*   **Status**: Implemented and integrated.

> **For detailed setup and development instructions, please see the `frontend_dashboard/README.md`.**

### ⚙️ Backend Services (`/backend_services`)

This component serves as the central nervous system of the platform, connecting the frontend to the data pipeline and enabling real-time functionality.

*   **Purpose**: To serve live data from BigQuery to the frontend, handle API requests, and manage the logic for the Gemini AI Assistant.
*   **Tech Stack**: Python (FastAPI), Google Cloud Functions.
*   **Status**: Implemented and integrated.

### 🔬 Data & ML Pipeline (`/mlops`, `/data_simulation`, `/model_training`, `/vertex_ai_pipelines`)

This is the data backbone of the project. It includes scripts for simulating industrial data, managing it in the cloud, and training the machine learning models that power the platform's predictive insights.

*   **Purpose**: To create a realistic data environment and deploy a predictive model for clinker quality.
*   **Tech Stack**: Python, Google BigQuery, Google Vertex AI, Scikit-learn.
*   **Workflow**:
    1.  `data_simulation/`: Generates simulated kiln process data.
    2.  `model_training/`: Trains machine learning models on the simulated data.
    3.  `mlops/`: Deploys the trained models to Vertex AI.
    4.  `vertex_ai_pipelines/`: Defines and manages the Vertex AI pipelines.
*   **Status**: Core pipeline is implemented and deployed on Google Cloud.

### 🤖 Data Science Agent (`/adk_data_science_agent`)

An autonomous agent that can perform data analysis tasks.

*   **Purpose**: To provide automated data science capabilities, such as data exploration, analysis, and visualization.
*   **Tech Stack**: Python, LangChain.
*   **Status**: Implemented and integrated.

## 📈 Project Progress

The ProdAIve project has made significant strides in developing an AI-driven platform for optimizing cement manufacturing. Here's a summary of our progress, milestones, and challenges:

### Milestones Achieved:
*   **Frontend Dashboard:** A comprehensive and visually rich UI has been developed using React, TypeScript, and Material-UI, featuring dashboards for Energy Cockpit, Kiln Health Overview, Predictive Quality, Process Flow, and a Gemini AI Assistant.
*   **Backend Services:** A FastAPI backend has been created with endpoints for all major frontend components, serving mock data and including LiveKit integration for video calls.
*   **Data & ML Pipeline:** Scripts for data simulation, preprocessing, and model training have been created. Simulated data has been loaded into BigQuery.
*   **ML Model Deployment:** A RandomForest model has been trained and deployed to a Vertex AI endpoint, though its performance requires improvement.
*   **Agentic AI Integration:** The core architecture for integrating Google's Gemini AI Assistant for proactive alerts and guided troubleshooting is in place.
*   **Documentation:** Detailed design concepts, demo plans, strategic proposals, and SOPs have been developed.

### Difficulties Encountered:
*   **ML Model Performance:** The initial RandomForest model deployed showed poor performance (negative R-squared), indicating it's not a good fit for the time-series data. This is a major roadblock that needs to be addressed with more sophisticated modeling approaches.
*   **Backend-Data Integration:** The backend is currently serving mock data and is not yet fully connected to live data in BigQuery or the Vertex AI models. This integration is crucial for real-time insights.

### Current Status:
The project has a solid foundation with a significant portion of the frontend and backend complete. The main focus now is on improving the ML model's accuracy and integrating the backend with real-time data sources and deployed models.

## 🚀 Next Steps

Our immediate next steps are focused on enhancing the core intelligence and data integration of the ProdAIve platform:

1.  **Improve ML Model Accuracy:** Experiment with alternative modeling approaches (e.g., LightGBM, LSTMs, GRUs, Transformer-based models) and advanced feature engineering techniques to significantly improve the predictive performance for time-series data.
2.  **Backend-Data Integration:** Connect the FastAPI backend to Google BigQuery to fetch and serve real-time data to the frontend.
3.  **ML Model Integration:** Integrate the improved ML models from Vertex AI into the backend API to provide live predictions and insights.
4.  **Frontend-Backend Integration:** Connect the frontend components to the live data and predictions served by the backend.
5.  **Comprehensive Testing:** Develop and implement a comprehensive test suite for both frontend and backend components to ensure robustness and reliability.
6.  **Refinement and Optimization**: Further enhancing performance, scalability, and user experience.
7.  **Advanced Feature Development**: Implementing additional features and functionalities based on user feedback and evolving requirements.
8.  **Deployment and Monitoring**: Preparing for production deployment and setting up continuous monitoring.

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file in the respective package for details.

## 📚 Project Documentation

Here is a list of all key documentation files for the ProdAIve project:

*   [BACKEND.md](BACKEND.md) - Backend services overview.
*   [DESIGN.md](DESIGN.md) - Refined design concept for the ProdAIve Dashboard.
*   [demo_plan.md](demo_plan.md) - 3-Minute Demo Plan for ProdAIve.
*   [final_ppt.md](final_ppt.md) - Final Product Presentation for Gen AI Exchange Hackathon.
*   [gemini.md](gemini.md) - General Gemini related documentation.
*   [jk_cement_proposal_ppt.md](jk_cement_proposal_ppt.md) - Strategic Partnership Proposal for JK Cement.
*   [meeting.md](meeting.md) - Hackathon Mentorship Meeting Agenda.
*   [meeting_notes.md](meeting_notes.md) - Meeting Strategy and Pitch.
*   [meeting_ppt.md](meeting_ppt.md) - Hackathon Mentorship Meeting Presentation.
*   [process_documentation.md](process_documentation.md) - ProdAIve MLOps Process Documentation.
*   [project_progress.md](project_progress.md) - Detailed Project Progress Report.
*   [SOP.md](SOP.md) - Complete Standard Operating Procedure for Cement Manufacturing (Dry Process).
*   [SOP_rag.md](SOP_rag.md) - Structured Data for RAG Ingestion based on the SOP.
*   [adk_data_science_agent/README.md](adk_data_science_agent/README.md) - Data Science with Multiple Agents.
*   [adk_data_science_agent/data_science/sub_agents/bigquery/chase_sql/sql_postprocessor/README.md](adk_data_science_agent/data_science/sub_agents/bigquery/chase_sql/sql_postprocessor/README.md) - Support Post-processing of SQL after Agentic Generation.
*   [backend_services/README.md](backend_services/README.md) - ProdAIve Backend Services.
*   [data_simulation/README.md](data_simulation/README.md) - General data simulation documentation.
*   [docs/models.md](docs/models.md) - Machine Learning Models for AI-Driven Soft Sensor and Predictive Maintenance.
*   [docs/README.md](docs/README.md) - Project Documentation.
*   [docs/sop.md](docs/sop.md) - AI-Optimized Cement Manufacturing (Raw Material to Dispatch) SOP.
*   [docs/Strategic Blueprint for Phase II.md](docs/Strategic Blueprint for Phase II.md) - Strategic Blueprint for Phase II: Operationalizing AI Optimization in Cement Manufacturing.
*   [docs/technical_plan.md](docs/technical_plan.md) - General technical plan documentation.
*   [frontend_dashboard/README.md](frontend_dashboard/README.md) - ProdAIve Dashboard.