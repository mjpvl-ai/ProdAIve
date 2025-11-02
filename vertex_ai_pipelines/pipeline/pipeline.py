from google.cloud import bigquery
import pandas as pd
import numpy as np
import os

# --- Configuration --- #
PROJECT_ID = os.getenv("GCP_PROJECT_ID", "operations-472416")
DATASET_ID = "kiln_data_dataset"
SOURCE_TABLE_ID = "simulated_kiln_data"
MODEL_PREDICTIONS_TABLE_ID = "model_predictions"
VARIANCE_ANALYSIS_TABLE_ID = "variance_analysis"

# --- Analysis Parameters ---
ROLLING_WINDOW_SIZE = 60  # For calculating rolling stats
ANOMALY_THRESHOLD_STD = 3    # Number of std deviations for anomaly detection

def run_analysis_pipeline():
    """
    Runs the data analysis pipeline.
    """
    client = bigquery.Client(project=PROJECT_ID)

    # 1. Load data from BigQuery
    print("Loading data from BigQuery...")
    query = f"SELECT * FROM `{PROJECT_ID}.{DATASET_ID}.{SOURCE_TABLE_ID}`"
    df = client.query(query).to_dataframe()
    print(f"Loaded {len(df)} rows.")

    # 2. Simulate model predictions
    print("Simulating model predictions...")
    df['predicted_fcao'] = df['actual_fcao'] + np.random.normal(0, 0.1, size=len(df))
    df['prediction_confidence'] = np.random.uniform(0.8, 0.99, size=len(df))
    
    predictions_df = df[['timestamp', 'predicted_fcao', 'prediction_confidence']]
    
    # Load predictions to BigQuery
    predictions_table_id = f"{PROJECT_ID}.{DATASET_ID}.{MODEL_PREDICTIONS_TABLE_ID}"
    job_config = bigquery.LoadJobConfig(
        write_disposition=bigquery.WriteDisposition.WRITE_TRUNCATE,
    )
    job = client.load_table_from_dataframe(
        predictions_df, predictions_table_id, job_config=job_config
    )
    job.result()
    print(f"Loaded {job.output_rows} rows into {predictions_table_id}.")

    # 3. Variance and Anomaly Analysis
    print("Performing variance and anomaly analysis...")
    analysis_results = []
    metrics_to_analyze = ['kiln_temperature', 'fuel_consumption', 'vibration', 'pressure', 'oxygen']

    for metric in metrics_to_analyze:
        df[f'{metric}_rolling_mean'] = df[metric].rolling(window=ROLLING_WINDOW_SIZE).mean()
        df[f'{metric}_rolling_std'] = df[metric].rolling(window=ROLLING_WINDOW_SIZE).std()
        
        # Detect anomalies
        df['is_anomaly'] = (
            np.abs(df[metric] - df[f'{metric}_rolling_mean']) > 
            df[f'{metric}_rolling_std'] * ANOMALY_THRESHOLD_STD
        )
        
        # Prepare results for BigQuery
        for _, row in df.iterrows():
            analysis_results.append({
                'timestamp': row['timestamp'],
                'metric_name': metric,
                'value': row[metric],
                'target': row.get(f'target_{metric}'), # Get target if it exists
                'deviation': row[metric] - row.get(f'target_{metric}', row[metric]),
                'is_anomaly': bool(row['is_anomaly'])
            })

    analysis_df = pd.DataFrame(analysis_results)

    # 4. Store analysis results in BigQuery
    print("Storing analysis results in BigQuery...")
    analysis_table_id = f"{PROJECT_ID}.{DATASET_ID}.{VARIANCE_ANALYSIS_TABLE_ID}"
    job_config = bigquery.LoadJobConfig(
        write_disposition=bigquery.WriteDisposition.WRITE_TRUNCATE,
    )
    job = client.load_table_from_dataframe(
        analysis_df, analysis_table_id, job_config=job_config
    )
    job.result()
    print(f"Loaded {job.output_rows} rows into {analysis_table_id}.")

if __name__ == "__main__":
    run_analysis_pipeline()
