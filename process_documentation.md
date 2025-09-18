# ProdAIve Process Documentation

This document outlines the steps taken to load data, preprocess it, train a model, and deploy it.

## 1. Model Deployment

A pre-trained model was deployed to Vertex AI.

- **Script:** `mlops/deploy_model_to_vertex_ai.py`
- **Action:** Deployed the `clinker_quality_model.joblib` to a Vertex AI endpoint.

## 2. Data Simulation

Simulated kiln data was generated.

- **Script:** `data_simulation/simulate_kiln_data.py`
- **Output:** `data_simulation/simulated_kiln_data.csv`

## 3. Data Loading to BigQuery

The simulated data was loaded into Google BigQuery.

- **Script:** `data_simulation/load_data_to_bigquery.py`
- **Action:** Loaded the CSV data into the `kiln_data_dataset.simulated_kiln_data` table in BigQuery.
- **Command:** `export GOOGLE_APPLICATION_CREDENTIALS="..." && python data_simulation/load_data_to_bigquery.py`

## 4. Data Preprocessing

The data from BigQuery was preprocessed for model training.

- **Script:** `model_training/preprocess_data.py`
- **Action:** Fetched data from BigQuery, performed basic preprocessing, and saved it to a CSV file.
- **Output:** `model_training/processed_kiln_data.csv`
- **Command:** `export GOOGLE_APPLICATION_CREDENTIALS="..." && python model_training/preprocess_data.py`

## 5. Model Training

A new model was trained on the preprocessed data.

- **Script:** `model_training/train_clinker_model.py`
- **Action:** Trained a RandomForestRegressor model.
- **Output:** `model_training/clinker_quality_model.joblib`
- **Command:** `python model_training/train_clinker_model.py`

## 6. Model Evaluation and Next Steps

The trained model showed poor performance (negative R-squared value), indicating that it is not a good fit for the data.

- **Next Step Suggested:** Improve the model by adding feature engineering steps (e.g., lag features) in the `preprocess_data.py` script.
