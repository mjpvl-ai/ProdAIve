# ProdAIve MLOps Process Documentation

This document outlines the automated MLOps workflow for the ProdAIve project, which leverages Google Cloud's Vertex AI to orchestrate the end-to-end machine learning lifecycle.

## 1. MLOps Strategy and Architecture

The project has transitioned from a manual, script-based process to a fully automated MLOps pipeline using Vertex AI. This new architecture ensures a more robust, scalable, and reproducible workflow.

The key components of the MLOps strategy are:

*   **Model:** We are using **LightGBM**, a highly efficient gradient boosting framework, for both regression and classification tasks.
*   **Platform:** **Vertex AI** is used for the entire MLOps lifecycle, including training, deployment, and monitoring.
*   **Deployment:** Trained models are deployed as scalable, serverless endpoints on **Cloud Run**.

## 2. Vertex AI Pipeline

The core of the MLOps workflow is a Vertex AI pipeline, defined in `vertex_ai_pipelines/pipeline/pipeline.py`. This pipeline automates the following steps:

1.  **Data Preprocessing:**
    *   A pipeline component automatically fetches the raw data from the specified BigQuery table.
    *   It performs the necessary preprocessing steps to prepare the data for training.
    *   The preprocessed data is then passed to the next step in the pipeline.

2.  **Model Training:**
    *   A custom Vertex AI training job is triggered, using a pre-built container for LightGBM.
    *   The training job takes the preprocessed data as input and trains the model.
    *   The trained model is then registered in the Vertex AI Model Registry.

3.  **Model Deployment:**
    *   A new Vertex AI Endpoint is created to host the model.
    *   The registered model is deployed to this endpoint.
    *   The deployed model is now available for real-time inference.

## 3. How to Run the Pipeline

To execute the pipeline, you need to follow these steps:

1.  **Configure the Pipeline:**
    *   Open the `vertex_ai_pipelines/config.py` file.
    *   Update the following variables with your specific GCP environment details:
        *   `PROJECT_ID`: Your Google Cloud project ID.
        *   `REGION`: The GCP region where you want to run the pipeline.
        *   `PIPELINE_ROOT`: A path to a Google Cloud Storage (GCS) bucket where the pipeline artifacts will be stored.
        *   `DATASET_URI`: The BigQuery table URI for your dataset.

2.  **Build the Pipeline:**
    *   The `vertex_ai_pipelines/build_pipeline.py` script is used to compile the pipeline definition into a JSON file.
    *   This script is typically run as part of a CI/CD process, but can also be run manually.

3.  **Submit the Pipeline to Vertex AI:**
    *   Once the pipeline is compiled, you can submit the generated JSON file to Vertex AI to trigger a pipeline run. This can be done via the gcloud CLI or the Google Cloud Console.

This new, automated workflow replaces the previous manual steps for data loading, preprocessing, training, and deployment. It provides a much more efficient and reliable way to manage the machine learning models for the ProdAIve project.