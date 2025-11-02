from google.cloud import bigquery
import os
from simulate_kiln_data import generate_kiln_data

# --- Configuration --- #
DATASET_ID = "kiln_data_dataset"
TABLE_ID = "simulated_kiln_data"
ALERTS_TABLE_ID = "alerts"
PROJECT_ID = os.getenv("GCP_PROJECT_ID", "operations-472416")

# --- BigQuery Schema Definition --- #
schema = [
    bigquery.SchemaField("timestamp", "TIMESTAMP", mode="REQUIRED"),
    bigquery.SchemaField("actual_fcao", "FLOAT", mode="REQUIRED"),
    bigquery.SchemaField("raw_material_feed_rate", "FLOAT", mode="REQUIRED"),
    bigquery.SchemaField("kiln_temperature", "FLOAT", mode="REQUIRED"),
    bigquery.SchemaField("fuel_consumption", "FLOAT", mode="REQUIRED"),
    bigquery.SchemaField("vibration", "FLOAT", mode="REQUIRED"),
    bigquery.SchemaField("motor_current_draw", "FLOAT", mode="REQUIRED"),
    bigquery.SchemaField("pressure", "FLOAT", mode="REQUIRED"),
    bigquery.SchemaField("oxygen", "FLOAT", mode="REQUIRED"),
    bigquery.SchemaField("clinker_production", "FLOAT", mode="REQUIRED"),
    bigquery.SchemaField("energy_consumption_kwh", "FLOAT", mode="REQUIRED"),
    bigquery.SchemaField("specific_energy_consumption", "FLOAT", mode="REQUIRED"),
    bigquery.SchemaField("target_kiln_temperature", "FLOAT", mode="REQUIRED"),
    bigquery.SchemaField("target_fuel_consumption", "FLOAT", mode="REQUIRED"),
    bigquery.SchemaField("is_anomaly", "BOOLEAN", mode="REQUIRED"),
]

alerts_schema = [
    bigquery.SchemaField("id", "INTEGER", mode="REQUIRED"),
    bigquery.SchemaField("message", "STRING", mode="REQUIRED"),
    bigquery.SchemaField("timestamp", "TIMESTAMP", mode="REQUIRED"),
    bigquery.SchemaField("type", "STRING", mode="REQUIRED"),
]

def load_simulated_data_to_bigquery():
    """
    Generates simulated kiln data and loads it into a BigQuery table.
    """
    client = bigquery.Client(project=PROJECT_ID)
    table_id = f"{PROJECT_ID}.{DATASET_ID}.{TABLE_ID}"
    alerts_table_id = f"{PROJECT_ID}.{DATASET_ID}.{ALERTS_TABLE_ID}"

    # Generate data
    print("Generating simulated kiln data...")
    df, alerts_df = generate_kiln_data(num_days=7)
    print(f"Generated {len(df)} rows of data and {len(alerts_df)} alerts.")

    # Configure the BigQuery job for simulated_kiln_data
    job_config = bigquery.LoadJobConfig(
        schema=schema,
        write_disposition=bigquery.WriteDisposition.WRITE_TRUNCATE, # Overwrite table
    )

    # Load the DataFrame into BigQuery
    job = client.load_table_from_dataframe(
        df, table_id, job_config=job_config
    )
    job.result()  # Wait for the job to complete

    print(f"Loaded {job.output_rows} rows into {table_id}.")

    # Configure the BigQuery job for alerts
    job_config = bigquery.LoadJobConfig(
        schema=alerts_schema,
        write_disposition=bigquery.WriteDisposition.WRITE_TRUNCATE, # Overwrite table
    )

    # Load the DataFrame into BigQuery
    job = client.load_table_from_dataframe(
        alerts_df, alerts_table_id, job_config=job_config
    )
    job.result()  # Wait for the job to complete

    print(f"Loaded {job.output_rows} rows into {alerts_table_id}.")

if __name__ == "__main__":
    load_simulated_data_to_bigquery()