from google.cloud import bigquery
import pandas as pd
from sklearn.preprocessing import StandardScaler

# --- Configuration --- #
PROJECT_ID = "operations-472416" # Replace with your actual GCP Project ID
DATASET_ID = "kiln_data_dataset"
TABLE_ID = "simulated_kiln_data"
PROCESSED_DATA_PATH = "model_training/processed_kiln_data.csv"

def preprocess_data():
    client = bigquery.Client(project=PROJECT_ID)
    query = f"""
        SELECT *
        FROM `{PROJECT_ID}.{DATASET_ID}.{TABLE_ID}`
        ORDER BY timestamp
    """
    df = client.query(query).to_dataframe()

    print(f"Original data shape: {df.shape}")
    print(f"Columns: {df.columns.tolist()}")

    # --- Preprocessing Steps --- #
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    df.sort_values(by='timestamp', inplace=True)

    # 1. Feature Engineering: Create lag features
    print("Creating lag features...")
    df['f_cao_lag1'] = df['f_cao'].shift(1)
    df.dropna(inplace=True) # Drop rows with NaN created by shifting

    # 2. Feature Scaling
    print("Applying feature scaling...")
    scaler = StandardScaler()
    features_to_scale = ['raw_material_feed_rate', 'kiln_temperature', 'fuel_consumption', 'vibration', 'motor_current_draw']
    df[features_to_scale] = scaler.fit_transform(df[features_to_scale])

    print(f"Processed data shape: {df.shape}")
    df.to_csv(PROCESSED_DATA_PATH, index=False)
    print(f"Processed data saved to {PROCESSED_DATA_PATH}")
    print(df.head())

if __name__ == "__main__":
    print("Starting data preprocessing with feature engineering...")
    preprocess_data()
    print("Data preprocessing complete.")