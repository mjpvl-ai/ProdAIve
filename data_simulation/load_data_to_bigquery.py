from google.cloud import bigquery
import os

# --- Configuration --- #
# IMPORTANT: Replace with your actual GCP Project ID
PROJECT_ID = "operations-472416" 
DATASET_ID = "kiln_data_dataset"
TABLE_ID = "simulated_kiln_data"
CSV_FILE_PATH = "data_simulation/simulated_kiln_data.csv"

# --- BigQuery Schema Definition --- #
schema = [
    bigquery.SchemaField("timestamp", "TIMESTAMP", mode="REQUIRED"),
    bigquery.SchemaField("f_cao", "FLOAT", mode="REQUIRED"),
    bigquery.SchemaField("raw_material_feed_rate", "FLOAT", mode="REQUIRED"),
    bigquery.SchemaField("kiln_temperature", "FLOAT", mode="REQUIRED"),
    bigquery.SchemaField("fuel_consumption", "FLOAT", mode="REQUIRED"),
    bigquery.SchemaField("vibration", "FLOAT", mode="REQUIRED"),
    bigquery.SchemaField("motor_current_draw", "FLOAT", mode="REQUIRED"),
]

def create_dataset_and_table():
    client = bigquery.Client(project=PROJECT_ID)
    dataset_ref = client.dataset(DATASET_ID)
    table_ref = dataset_ref.table(TABLE_ID)

    # Create Dataset if it doesn't exist
    try:
        client.get_dataset(dataset_ref)
        print(f"Dataset '{DATASET_ID}' already exists.")
    except Exception:
        dataset = bigquery.Dataset(dataset_ref)
        dataset.location = "US"  # You can change the location if needed
        client.create_dataset(dataset)
        print(f"Dataset '{DATASET_ID}' created.")

    # Create Table if it doesn't exist
    try:
        client.get_table(table_ref)
        print(f"Table '{TABLE_ID}' already exists.")
    except Exception:
        table = bigquery.Table(table_ref, schema=schema)
        client.create_table(table)
        print(f"Table '{TABLE_ID}' created with schema.")

def load_csv_to_bigquery():
    client = bigquery.Client(project=PROJECT_ID)
    table_id = f"{PROJECT_ID}.{DATASET_ID}.{TABLE_ID}"

    job_config = bigquery.LoadJobConfig(
        schema=schema,
        source_format=bigquery.SourceFormat.CSV,
        skip_leading_rows=1,  # Skip header row
        autodetect=False,     # We provide schema explicitly
        write_disposition=bigquery.WriteDisposition.WRITE_TRUNCATE, # Overwrite table if it exists
    )

    with open(CSV_FILE_PATH, "rb") as source_file:
        job = client.load_table_from_file(source_file, table_id, job_config=job_config)

    job.result()  # Waits for the job to complete.

    print(f"Loaded {job.output_rows} rows into {table_id}.")

if __name__ == "__main__":
    print("Creating BigQuery dataset and table...")
    create_dataset_and_table()
    print("Loading simulated data to BigQuery...")
    load_csv_to_bigquery()
    print("Data loading to BigQuery complete.")
