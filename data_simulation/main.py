import os
from simulate_kiln_data import generate_kiln_data
from load_data_to_bigquery import create_dataset_and_table, load_csv_to_bigquery

# --- Configuration --- #
# IMPORTANT: Replace with your actual GCP Project ID
PROJECT_ID = "operations-472416"
CSV_FILE_PATH = "data_simulation/simulated_kiln_data.csv"

def main():
    """Orchestrates the data simulation and loading process."""
    print("--- Starting Data Simulation and Loading Process ---")

    # 1. Generate Simulated Data
    print("Generating simulated kiln data...")
    simulated_data = generate_kiln_data(num_days=7)
    
    # 2. Save Data to CSV
    print(f"Saving simulated data to {CSV_FILE_PATH}...")
    # Ensure the directory exists
    os.makedirs(os.path.dirname(CSV_FILE_PATH), exist_ok=True)
    simulated_data.to_csv(CSV_FILE_PATH, index=False)
    print("Simulated data saved successfully.")

    # 3. Create BigQuery Dataset and Table
    print("Creating BigQuery dataset and table...")
    create_dataset_and_table(project_id=PROJECT_ID)

    # 4. Load Data into BigQuery
    print("Loading simulated data to BigQuery...")
    load_csv_to_bigquery(project_id=PROJECT_ID)

    print("--- Data Simulation and Loading Process Complete ---")

if __name__ == "__main__":
    main()