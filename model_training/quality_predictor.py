import pandas as pd
from google.cloud import bigquery
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
import joblib
import os

# --- Configuration --- #
PROJECT_ID = os.getenv("GCP_PROJECT_ID", "operations-472416")
DATASET_ID = "kiln_data_dataset"
TABLE_ID = "simulated_kiln_data"
MODEL_DIR = "./models"
MODEL_FILENAME = "clinker_quality_model.joblib"

def train_and_save_model():
    """
    Trains a model to predict clinker quality and saves it to a file.
    """
    client = bigquery.Client(project=PROJECT_ID)

    # Load data from BigQuery
    query = f"""
        SELECT 
            actual_fcao, 
            raw_material_feed_rate, 
            kiln_temperature, 
            fuel_consumption, 
            vibration, 
            motor_current_draw, 
            pressure, 
            oxygen
        FROM `{PROJECT_ID}.{DATASET_ID}.{TABLE_ID}`
    """
    df = client.query(query).to_dataframe()

    # Prepare data for training
    X = df.drop("actual_fcao", axis=1)
    y = df["actual_fcao"]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Train the model
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    # Evaluate the model
    score = model.score(X_test, y_test)
    print(f"Model score: {score}")

    # Save the model
    if not os.path.exists(MODEL_DIR):
        os.makedirs(MODEL_DIR)

    joblib.dump(model, os.path.join(MODEL_DIR, MODEL_FILENAME))
    print(f"Model saved to {os.path.join(MODEL_DIR, MODEL_FILENAME)}")

if __name__ == "__main__":
    train_and_save_model()
