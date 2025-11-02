from google.cloud import bigquery
import os

# --- Configuration --- #
PROJECT_ID = os.getenv("GCP_PROJECT_ID", "operations-472416")
DATASET_ID = "kiln_data_dataset"
MODEL_PREDICTIONS_TABLE_ID = "model_predictions"
VARIANCE_ANALYSIS_TABLE_ID = "variance_analysis"
WEEKLY_PERFORMANCE_TABLE_ID = "weekly_performance"
CORRELATION_DATA_TABLE_ID = "correlation_data"

# --- Schemas --- #
model_predictions_schema = [
    bigquery.SchemaField("timestamp", "TIMESTAMP", mode="REQUIRED"),
    bigquery.SchemaField("predicted_fcao", "FLOAT", mode="REQUIRED"),
    bigquery.SchemaField("prediction_confidence", "FLOAT", mode="REQUIRED"),
]

variance_analysis_schema = [
    bigquery.SchemaField("timestamp", "TIMESTAMP", mode="REQUIRED"),
    bigquery.SchemaField("metric_name", "STRING", mode="REQUIRED"),
    bigquery.SchemaField("value", "FLOAT", mode="REQUIRED"),
    bigquery.SchemaField("target", "FLOAT", mode="NULLABLE"),
    bigquery.SchemaField("deviation", "FLOAT", mode="NULLABLE"),
    bigquery.SchemaField("is_anomaly", "BOOLEAN", mode="REQUIRED"),
]

weekly_performance_schema = [
    bigquery.SchemaField("name", "STRING", mode="REQUIRED"),
    bigquery.SchemaField("energy_mwh", "FLOAT", mode="REQUIRED"),
    bigquery.SchemaField("quality_pct", "FLOAT", mode="REQUIRED"),
    bigquery.SchemaField("warnings", "INTEGER", mode="REQUIRED"),
]

correlation_data_schema = [
    bigquery.SchemaField("temp", "FLOAT", mode="REQUIRED"),
    bigquery.SchemaField("fcao", "FLOAT", mode="REQUIRED"),
]

def create_table(client, dataset_ref, table_id, schema):
    table_ref = dataset_ref.table(table_id)
    try:
        client.get_table(table_ref)
        print(f"Table {table_id} already exists.")
    except Exception:
        table = bigquery.Table(table_ref, schema=schema)
        client.create_table(table)
        print(f"Table {table_id} created.")

def create_analysis_tables():
    """
    Creates the tables needed for storing analysis and prediction data.
    """
    client = bigquery.Client(project=PROJECT_ID)
    dataset_ref = client.dataset(DATASET_ID)

    # Create dataset if it doesn't exist
    try:
        client.get_dataset(dataset_ref)
    except Exception:
        client.create_dataset(dataset_ref)
        print(f"Dataset {DATASET_ID} created.")

    # Create the tables
    create_table(client, dataset_ref, MODEL_PREDICTIONS_TABLE_ID, model_predictions_schema)
    create_table(client, dataset_ref, VARIANCE_ANALYSIS_TABLE_ID, variance_analysis_schema)
    create_table(client, dataset_ref, WEEKLY_PERFORMANCE_TABLE_ID, weekly_performance_schema)
    create_table(client, dataset_ref, CORRELATION_DATA_TABLE_ID, correlation_data_schema)

if __name__ == "__main__":
    create_analysis_tables()