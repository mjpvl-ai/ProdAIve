# ProdAIve: Autonomous Cement Plant Optimization
### Hackathon Mentorship Meeting
**October 27, 2025**
**Team ProdAIve**

---

## Agenda

1.  **The Core Problem:** The "Fix-on-Failure" Trap
2.  **Our Vision:** From Reactive to Proactive Control
3.  **Live Demo:** Prototype Walkthrough
4.  **Progress & Vision:** Where We Are & Where We're Going
5.  **Our Ask:** Key Questions for You
6.  **Roadmap:** Path to Showcase Day

---

## The Problem: The "Fix-on-Failure" Trap

*   The cement industry relies on **reactive quality control**.
*   Critical quality data (like f-CaO) is **delayed by hours**.
*   Operators are forced to make decisions based on **obsolete data**.
*   This leads to:
    *   Systemic Inefficiency
    *   Increased Energy Waste & Costs
    *   Lower Product Quality

**This is a multi-billion dollar problem.**

---

## Our Vision: "Predict-and-Prevent"

We are building an AI-driven platform to shift cement operations from a reactive to a **proactive, "predict-and-prevent"** model.

**How?**
*   **AI "Soft Sensor":** Predicts quality in real-time, eliminating data lag.
*   **Gemini AI Assistant:** Guides operators with proactive recommendations.
*   **Closed-Loop Control:** Enables automated process adjustments.

**The Goal: An autonomous plant that optimizes itself.**

---

## High-Level Architecture

```
+---------------------+   +---------------------+   +-----------------------+
|   Plant Sensors     |-->|   Google BigQuery   |-->|       Vertex AI       |
| (Real-time Data)    |   |  (Data Warehouse)   |   | (ML Models & Gemini)  |
+---------------------+   +---------------------+   +----------+------------+
                                                               |
                                                               v
+--------------------------------------------------------------+
|                  Frontend Dashboard (React)                  |
| (Real-time Visualization, AI Assistant, Guided Troubleshooting) |
+--------------------------------------------------------------+
```

---

## Live Demo

**(A brief showcase of the `frontend_dashboard` with the current mock data to demonstrate the user experience.)**

---

## Progress & Vision Summary

### Feature Status

| Feature/Component | Status | Next Step |
| :--- | :--- | :--- |
| **Frontend UI** | Implemented | Connect to live backend data |
| `EnergyCockpit` | Implemented (Mock Data) | Integrate with backend |
| `KilnHealthOverview`| Implemented (Mock Data) | Integrate with backend |
| `PredictiveQuality` | Implemented (Mock Data) | Integrate with backend |
| `GeminiAIAssistant` | Implemented (Mock Chat) | Integrate with real AI agent |
| **Backend API** | Implemented | Connect to BigQuery & Vertex AI |
| **ML Model** | Deployed (Poor Performance) | Improve model accuracy |
| **Data Pipeline** | Implemented | - |

---

## Showcase: The Alert Flow

This is how we demonstrate our "predict-and-prevent" vision in the current prototype:

1.  **Trigger:** A simulated high-temperature spike in the kiln.
2.  **Automated Response:**
    *   The **`GeminiAIAssistant`** automatically opens with a critical alert and a recommendation.
    *   The main view switches to the **`Process Flow`**.
    *   The problematic node ("Kiln Burning") is highlighted.
3.  **Guided Troubleshooting:** The operator is immediately guided to the problem's location and the recommended solution.

---

## Vision Demo: The "Golden Path"

This is the future state we are building towards:

1.  **Proactive Alert:** The system predicts a quality drop.
2.  **AI Intervention:** The `GeminiAIAssistant` suggests a corrective action (e.g., "increase kiln speed by 0.2 RPM").
3.  **Guided Analysis:** The dashboard automatically displays the relevant data to support the recommendation.
4.  **Operator Action:** The operator approves the action with a single click.
5.  **Closed Loop:** The system automatically adjusts the process, and the operator monitors the real-time impact.

---

## Challenges & Roadblocks

*   **ML Model Performance:** Our current RandomForest model is underperforming (negative R-squared). This is our biggest technical challenge.
*   **Backend Integration:** The backend is not yet connected to the live data in BigQuery or the Vertex AI model.

---

## Our Ask: Key Questions for You

*   **AI/ML Strategy:** How can we improve our model's performance? What models or feature engineering techniques would you recommend for this type of time-series data?
*   **Backend Integration:** What is the most efficient way to connect our FastAPI backend to BigQuery and Vertex AI?
*   **Prioritization:** Should we focus on improving the model or building out more frontend features for the showcase?

---

## Roadmap to Showcase Day

*   **Priority 1: Improve the ML Model.**
    *   Experiment with new models (LightGBM, LSTMs).
    *   Implement more sophisticated feature engineering.
*   **Priority 2: Backend Integration.**
    *   Connect the backend to BigQuery to serve real data.
*   **Priority 3: Frontend Integration.**
    *   Connect the frontend to the live data from the backend.

---

## Q&A

**Thank you!**

---
