from google.cloud import bigquery
import os
import pandas as pd
import numpy as np

# --- Configuration --- #
PROJECT_ID = os.getenv("GCP_PROJECT_ID", "operations-472416")
DATASET_ID = "kiln_data_dataset"
SOURCE_TABLE_ID = "simulated_kiln_data"
VARIANCE_ANALYSIS_TABLE_ID = "variance_analysis"
MODEL_PREDICTIONS_TABLE_ID = "model_predictions"
WEEKLY_PERFORMANCE_TABLE_ID = "weekly_performance"
CORRELATION_DATA_TABLE_ID = "correlation_data"

def populate_variance_analysis():
    """
    Populates the variance_analysis table with data from the simulated_kiln_data table.
    """
    client = bigquery.Client(project=PROJECT_ID)
    
    # Read data from the source table
    query = f"""
        SELECT *
        FROM `{PROJECT_ID}.{DATASET_ID}.{SOURCE_TABLE_ID}`
    """
    df = client.query(query).to_dataframe()

    # Unpivot the DataFrame to have one row per metric per timestamp
    metrics_to_unpivot = [
        'actual_fcao', 'raw_material_feed_rate', 'kiln_temperature', 
        'fuel_consumption', 'vibration', 'motor_current_draw', 
        'pressure', 'oxygen', 'clinker_production', 'energy_consumption_kwh', 
        'specific_energy_consumption'
    ]
    
    df_unpivoted = df.melt(id_vars=['timestamp', 'is_anomaly'], value_vars=metrics_to_unpivot, 
                             var_name='metric_name', value_name='value')

    # Add target and deviation columns
    df_unpivoted['target'] = None
    df_unpivoted['deviation'] = None

    # Calculate deviation for kiln_temperature
    df_unpivoted.loc[df_unpivoted['metric_name'] == 'kiln_temperature', 'target'] = df['target_kiln_temperature']
    df_unpivoted.loc[df_unpivoted['metric_name'] == 'kiln_temperature', 'deviation'] = \
        df_unpivoted['value'] - df_unpivoted['target']

    # Calculate deviation for fuel_consumption
    df_unpivoted.loc[df_unpivoted['metric_name'] == 'fuel_consumption', 'target'] = df['target_fuel_consumption']
    df_unpivoted.loc[df_unpivoted['metric_name'] == 'fuel_consumption', 'deviation'] = \
        df_unpivoted['value'] - df_unpivoted['target']

    # Calculate deviation for actual_fcao
    df_unpivoted.loc[df_unpivoted['metric_name'] == 'actual_fcao', 'target'] = 2.0  # Example target
    df_unpivoted.loc[df_unpivoted['metric_name'] == 'actual_fcao', 'deviation'] = \
        df_unpivoted['value'] - df_unpivoted['target']

    # Fill remaining NaN deviations with 0
    df_unpivoted['deviation'] = df_unpivoted['deviation'].fillna(0)

    # Set anomaly flag based on deviation
    df_unpivoted.loc[(df_unpivoted['metric_name'] == 'kiln_temperature') & (df_unpivoted['deviation'].abs() > 50), 'is_anomaly'] = True
    df_unpivoted.loc[(df_unpivoted['metric_name'] == 'fuel_consumption') & (df_unpivoted['deviation'].abs() > 10), 'is_anomaly'] = True
    df_unpivoted.loc[(df_unpivoted['metric_name'] == 'actual_fcao') & (df_unpivoted['deviation'].abs() > 0.2), 'is_anomaly'] = True

    # Load the data into the variance_analysis table
    table_id = f"{PROJECT_ID}.{DATASET_ID}.{VARIANCE_ANALYSIS_TABLE_ID}"
    job_config = bigquery.LoadJobConfig(
        write_disposition=bigquery.WriteDisposition.WRITE_TRUNCATE,
    )
    job = client.load_table_from_dataframe(
        df_unpivoted, table_id, job_config=job_config
    )
    job.result()
    print(f"Loaded {job.output_rows} rows into {table_id}.")

def populate_model_predictions():
    """
    Populates the model_predictions table with mock data.
    """
    client = bigquery.Client(project=PROJECT_ID)
    
    # Generate mock predictions
    query = f"""
        SELECT timestamp, actual_fcao
        FROM `{PROJECT_ID}.{DATASET_ID}.{SOURCE_TABLE_ID}`
    """
    df = client.query(query).to_dataframe()
    df['predicted_fcao'] = df['actual_fcao'] * 0.95 # Mock prediction
    df['prediction_confidence'] = 0.9
    df = df[['timestamp', 'predicted_fcao', 'prediction_confidence']]

    # Load the data into the model_predictions table
    table_id = f"{PROJECT_ID}.{DATASET_ID}.{MODEL_PREDICTIONS_TABLE_ID}"
    job_config = bigquery.LoadJobConfig(
        write_disposition=bigquery.WriteDisposition.WRITE_TRUNCATE,
    )
    job = client.load_table_from_dataframe(
        df, table_id, job_config=job_config
    )
    job.result()
    print(f"Loaded {job.output_rows} rows into {table_id}.")

def populate_weekly_performance():
    """
    Populates the weekly_performance table with mock data.
    """
    client = bigquery.Client(project=PROJECT_ID)
    
    # Generate mock weekly performance data
    data = {
        'name': ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        'energy_mwh': [500, 520, 480, 510],
        'quality_pct': [98.5, 99.0, 98.0, 98.8],
        'warnings': [5, 3, 7, 4]
    }
    df = pd.DataFrame(data)

    # Load the data into the weekly_performance table
    table_id = f"{PROJECT_ID}.{DATASET_ID}.{WEEKLY_PERFORMANCE_TABLE_ID}"
    job_config = bigquery.LoadJobConfig(
        write_disposition=bigquery.WriteDisposition.WRITE_TRUNCATE,
    )
    job = client.load_table_from_dataframe(
        df, table_id, job_config=job_config
    )
    job.result()
    print(f"Loaded {job.output_rows} rows into {table_id}.")

def populate_correlation_data():
    """
    Populates the correlation_data table with mock data.
    """
    client = bigquery.Client(project=PROJECT_ID)
    
    # Generate mock correlation data
    query = f"""
        SELECT kiln_temperature, actual_fcao
        FROM `{PROJECT_ID}.{DATASET_ID}.{SOURCE_TABLE_ID}`
    """
    df = client.query(query).to_dataframe()
    df.rename(columns={'kiln_temperature': 'temp', 'actual_fcao': 'fcao'}, inplace=True)

    # Load the data into the correlation_data table
    table_id = f"{PROJECT_ID}.{DATASET_ID}.{CORRELATION_DATA_TABLE_ID}"
    job_config = bigquery.LoadJobConfig(
        write_disposition=bigquery.WriteDisposition.WRITE_TRUNCATE,
    )
    job = client.load_table_from_dataframe(
        df, table_id, job_config=job_config
    )
    job.result()
    print(f"Loaded {job.output_rows} rows into {table_id}.")

if __name__ == "__main__":
    populate_variance_analysis()
    populate_model_predictions()
    populate_weekly_performance()
    populate_correlation_data()
