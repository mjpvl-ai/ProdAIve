# Gen AI Exchange Hackathon - Final Product Presentation

---

## Team & Project Overview

*   **Team Name**: Team ProdAIve
*   **Team Leader Name**: Jayaprakash Murugan
*   **Problem Statement**: The cement industry's reliance on reactive quality control, caused by significant time delays in measuring key quality indicators like f-CaO, leads to systemic inefficiency, increased costs, and diminished performance.

---

## Product Summary (What’s Live Now)

*   **Product summary (what’s live now)**: A web-based dashboard that provides a real-time, comprehensive view of cement plant operations.
*   **What does the product do today?**: It visualizes key operational areas (`EnergyCockpit`, `KilnHealthOverview`, `PredictiveQualityDashboard`), displays a process flow diagram, and includes a conversational AI assistant with both text and voice interfaces. The application is fully functional and connected to a live backend.
*   **Who is it for?**: Plant operators, process engineers, and plant managers in the cement manufacturing industry.
*   **What is the main outcome for the user?**: To gain immediate, at-a-glance insights into plant performance and to be guided towards potential issues with live data.

---

## Innovation, Impact, & Alignment

*   **Innovation, Impact, & Alignment**: The product's innovation lies in its "predict-and-prevent" approach, moving beyond simple monitoring to proactive optimization.
*   **What feels new or clearly better than existing options?**: The integration of a conversational Gemini AI assistant that not only alerts operators but also guides them through a troubleshooting workflow directly within the UI is a significant step up from traditional SCADA systems. The addition of a voice interface provides a hands-free way to interact with the system.
*   **How does it directly address the chosen theme?**: It directly addresses the theme of industrial optimization by using AI to tackle a core inefficiency in a heavy industry, aiming to reduce energy consumption and improve product quality.
*   **Who benefits, and what positive change will they feel?**: Plant operators benefit from reduced cognitive load and faster decision-making. The business benefits from lower operational costs and improved sustainability metrics.

---

## Working Product & Demo

*   **Does the full journey run end-to-end without breaking?**: Yes, the full journey runs end-to-end without breaking. The user can navigate all sections, view visualizations with live data, and interact with the AI assistant via text or voice.
*   **Link to your demo video (3 min) showcasing walkthrough of your product & its features**: [Placeholder for 3-minute demo video link]

---

## Process Flow (User Journey)

*   **What are the key steps the user takes from start to finish?**:
    1.  User logs in and sees the main `Overview` dashboard with high-level KPIs.
    2.  An alert is triggered for a high kiln temperature based on live data.
    3.  The `GeminiAIAssistant` automatically opens with the alert and a recommendation.
    4.  The view switches to the `Process Flow`, highlighting the "Kiln Burning" node.
    5.  The user can then navigate to the `KilnHealthOverview` for a detailed analysis or interact with the AI assistant for more information using text or voice.
*   **Where do they see value at each step?**:
    *   **Step 1:** Quick situational awareness.
    *   **Step 2-4:** Immediate, guided attention to a critical problem, its location, and a potential solution.
    *   **Step 5:** Empowerment to deep-dive into the problem with relevant data, with the added convenience of a voice interface.

---

## Architecture Diagram

```
+---------------------+   +---------------------+   +-----------------------+
|   Plant Sensors     |-->|   Google BigQuery   |-->|       Vertex AI       |
| (Real-time Data)    |   |  (Data Warehouse)   |   | (ML Models & Gemini)  |
+---------------------+   +---------------------+   +----------+------------+
                                                               |
                                                               v
+--------------------------------------------------------------+
|                    Backend Services (FastAPI on Cloud Run)   |
| (API Endpoints, Voice Assistant, LiveKit Agent)              |
+--------------------------------------------------------------+
                                                               |
                                                               v
+--------------------------------------------------------------+
|                  Frontend Dashboard (React on Firebase)      |
| (Real-time Visualization, AI Assistant, Guided Troubleshooting) |
+--------------------------------------------------------------+
```

*   **What are the main parts behind the scenes?**: Plant Sensors (simulated), Google BigQuery, Vertex AI (for ML models and Gemini), a FastAPI backend deployed on Google Cloud Run, and a React frontend hosted on Firebase.
*   **How do these parts talk to each other?**: Sensors send data to BigQuery. The FastAPI backend provides API endpoints that the React frontend consumes. The backend queries BigQuery and Vertex AI to provide live data and predictions. The voice assistant uses Google Cloud Speech-to-Text and Text-to-Speech, and the LiveKit agent provides a real-time voice interface.

---

## Detailed Tech Flow

```
+------------------------------------------------------------------------------------------------+
|                                        Frontend (React)                                        |
|------------------------------------------------------------------------------------------------|
|      +-----------------+      +-----------------+      +-----------------+      +-------------+   |
|      |   Material-UI   |      |     Recharts    |      |  Framer Motion  |      |   LiveKit   |   |
|      |  (UI Components) |      |   (Charts)      |      |  (Animations)   |      |  (Real-time)|   |
|      +-----------------+      +-----------------+      +-----------------+      +-------------+   |
+---------------------------------|--------------------------------|-------------------------------+ 
                                  |                                | 
                                  v                                v
+------------------------------------------------------------------------------------------------+
|                                Backend (FastAPI on Cloud Run)                                  |
|------------------------------------------------------------------------------------------------|
|      +-----------------+      +----------------------+      +--------------------------------+   |
|      |  API Endpoints  |----->|  Data Science Agent  |----->|      Vertex AI (Gemini)        |   |
|      |  (/api/*)       |      |  (ADK)               |      |      (Conversational AI)       |   |
|      +-----------------+      +----------------------+      +--------------------------------+   |
|              |                                                       |                               |
|              v                                                       v                               |
|      +--------------------------------+      +--------------------------------+                       |
|      |   Voice Assistant (STT/TTS)    |      |   Predictive Model (Vertex AI) |                       |
|      +--------------------------------+      +--------------------------------+                       |
|              |                                                                                       |
|              v                                                                                       |
|      +--------------------------------+                                                              |
|      |      LiveKit (Real-time)       |                                                              |
|      +--------------------------------+                                                              |
|              |                                                                                       |
|              v                                                                                       |
|      +------------------------------------------------------------------------------------------+    |
|      |                                     Google BigQuery                                      |    |
|      |                                     (Data Warehouse)                                     |    |
|      +------------------------------------------------------------------------------------------+    |
+------------------------------------------------------------------------------------------------+
```


## Google AI Tools Usage (Where & Why)

*   **Where do you use Google’s AI tools in the product?**:
    *   **Vertex AI:** Used for training and deploying the predictive quality model (currently a RandomForest model).
    *   **Gemini & Agent Builder:** Powers the `GeminiAIAssistant` for conversational insights and guided troubleshooting.
    *   **BigQuery:** Used as the central data warehouse for all operational and sensor data.
    *   **Google Cloud Speech-to-Text & Text-to-Speech:** Used in the `voice_assistant.py` to enable the voice interface.
    *   **Google Cloud Run**: Hosts the FastAPI backend, providing a scalable and serverless platform.
*   **How do these tools add clear value to the user?**: They transform raw data into predictive insights and actionable recommendations, enabling the shift from reactive to proactive control. The voice interface provides a hands-free way to interact with the system, which can be particularly useful in an industrial setting.

---

## Tech Stack

*   **What tools power the app, server, and database?**:
    *   **App:** React, TypeScript, Vite, Material-UI, Recharts, Framer Motion, LiveKit Client
    *   **Server:** Python, FastAPI, Uvicorn
    *   **Database:** Google BigQuery
*   **Where do the Google AI tools layer into the product?**: They are the core of the backend's intelligence, providing the predictions and conversational abilities that are surfaced in the frontend.
*   **Where is it hosted, and how do you roll out updates?**: The frontend is hosted on Firebase, and updates are rolled out via the Firebase CLI (`firebase deploy`). The backend is deployed on Google Cloud Run, and updates are rolled out by deploying a new revision.

---

## User Experience

*   **Can a first-time user complete the main task quickly and comfortably?**: Yes, the UI is designed to be intuitive. The guided alert flow ensures that even a first-time user can immediately understand and react to a critical event. The voice assistant provides an alternative, hands-free way to interact with the system.
*   **Is it easy to use on phone and desktop with clear messages?**: The application is designed to be responsive, though it is optimized for a desktop experience given the data density.

---

## Market & Adoption

*   **Who will use it first, and how will you reach them?**: The initial users will be process engineers and control room operators at a single pilot plant. We will reach them through a direct partnership with the plant's management.
*   **What is the monthly cost to run, and is it sensible?**: The cost will be primarily driven by BigQuery storage/querying, Vertex AI endpoint hosting, and Cloud Run. We estimate it to be in the range of $500-$2000/month for a single plant, which is highly sensible given the potential for millions in savings from improved efficiency.
*   **What are you next 30-90 days (try/launch/measure)?**:
    *   **30 Days:** Onboard the pilot plant users and gather feedback on the live system.
    *   **60 Days:** Conduct a "shadow mode" trial at the pilot plant, where the system runs in parallel with existing processes to validate its predictions and recommendations.
    *   **90 Days:** Begin a closed-loop control trial for a single process variable, and measure the impact on energy consumption and product quality.

---

# Thank you

---

## Evaluation Criteria: Technical Merit (50%)

*   **Working build**: The full product runs end-to-end without breaking, including one edge case and a clear fallback. The voice interface has a fallback to a text-based chat, ensuring uninterrupted operation.
*   **Use of Google’s AI tools**: Google’s AI tools are used effectively and creatively to add real value. Vertex AI is used for training and deploying the predictive quality model, Gemini powers the conversational AI assistant, and Google Cloud Speech-to-Text and Text-to-Speech are used for the voice interface. BigQuery is our data warehouse, and Cloud Run hosts our backend.
*   **Clear build & room to grow**: The architecture is designed for scalability and maintainability. The use of a serverless backend on Cloud Run allows the system to handle a growing number of users and data without compromising performance. The modular design of the frontend and backend allows for easy integration of new features and data sources.

---

## Evaluation Criteria: User Experience (10%)

*   **Intuitive interface**: A first-time user can complete the main task quickly and comfortably. The guided alert flow directs the user's attention to critical events and provides clear, actionable recommendations.
*   **Accessibility and mobile**: The application is designed to be responsive and is usable on both desktop and mobile devices. Clear messages and visual cues guide the user, ensuring a positive experience across all platforms.

---

## Evaluation Criteria: Alignment with Cause (10%)

*   **Problem alignment**: The solution directly addresses the chosen theme of industrial optimization by tackling a core inefficiency in the cement industry. By providing real-time insights and predictive capabilities, we help reduce energy consumption and improve product quality.
*   **Positive impact**: The solution clearly helps the intended community of plant operators and engineers by reducing cognitive load and enabling faster, more informed decision-making. This leads to improved operational efficiency, lower costs, and a more sustainable manufacturing process.

---

## Evaluation Criteria: Innovation and Creativity (20%)

*   **Uniqueness and originality**: The integration of a conversational Gemini AI assistant that not only alerts operators but also guides them through a troubleshooting workflow directly within the UI is a significant step up from traditional SCADA systems, which are often passive and require manual data interpretation.
*   **Potential for change**: The solution has the potential to meaningfully improve how cement plants are operated. By shifting from a reactive to a proactive control strategy, we can enable closed-loop control, where the AI system automatically adjusts process parameters to optimize performance.

---

## Evaluation Criteria: Market Feasibility (10%)

*   **Market viability**: There is a clear user group and real demand for this solution. The cement industry is actively seeking ways to improve efficiency and reduce costs, and our solution directly addresses these needs.
*   **Adoption and cost**: There is a practical path to roll out and run the solution within a sensible cost. The use of serverless technologies helps to minimize operational overhead. We estimate the monthly cost to be in the range of $500-$2000 for a single plant, which is highly sensible given the potential for millions in savings.
*   **Readiness to show and share**: This one-page overview, along with a short 2-3 minute video, and simple next steps make it easy to try the solution.
