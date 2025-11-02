import os
from simulate_kiln_data import generate_kiln_data
from load_data_to_bigquery import load_simulated_data_to_bigquery
from create_analysis_tables import create_analysis_tables
from populate_analysis_tables import populate_variance_analysis, populate_model_predictions, populate_weekly_performance, populate_correlation_data

# --- Configuration --- #
# IMPORTANT: Replace with your actual GCP Project ID
PROJECT_ID = "operations-472416"

def main():
    """Orchestrates the data simulation and loading process."""
    print("--- Starting Data Simulation and Loading Process ---")

    # 1. Generate and Load Simulated Data
    print("Generating and loading simulated kiln data...")
    load_simulated_data_to_bigquery()

    # 2. Create Analysis Tables
    print("Creating analysis tables...")
    create_analysis_tables()

    # 3. Populate Analysis Tables
    print("Populating analysis tables...")
    populate_variance_analysis()
    populate_model_predictions()
    populate_weekly_performance()
    populate_correlation_data()

    print("--- Data Simulation and Loading Process Complete ---")

if __name__ == "__main__":
    main()