import os
import joblib
from google.cloud import storage
from google.cloud import aiplatform

# --- Configuration --- #
PROJECT_ID = "operations-472416"  # Replace with your actual GCP Project ID
REGION = "us-central1"  # Or your preferred region
MODEL_PATH = "model_training/clinker_quality_model.joblib"
GCS_BUCKET_NAME = f"{PROJECT_ID}-vertex-ai-models"
GCS_MODEL_PATH = "clinker_quality_model/model.joblib"
MODEL_DISPLAY_NAME = "clinker_quality_prediction_model"
ENDPOINT_DISPLAY_NAME = "clinker_quality_prediction_endpoint"

def deploy_model():
    aiplatform.init(project=PROJECT_ID, location=REGION)

    # 1. Create GCS bucket and upload model artifact
    print(f"Checking GCS bucket '{GCS_BUCKET_NAME}'...")
    storage_client = storage.Client(project=PROJECT_ID)
    bucket = storage_client.bucket(GCS_BUCKET_NAME)
    if not bucket.exists():
        bucket.create(location=REGION)
        print(f"Bucket '{GCS_BUCKET_NAME}' created.")
    else:
        print(f"Bucket '{GCS_BUCKET_NAME}' already exists.")

    blob = bucket.blob(GCS_MODEL_PATH)
    blob.upload_from_filename(MODEL_PATH)
    gcs_uri = f"gs://{GCS_BUCKET_NAME}/{GCS_MODEL_PATH}"
    print(f"Model artifact uploaded to GCS: {gcs_uri}")

    # 2. Create Vertex AI Model resource
    print(f"Creating Vertex AI Model '{MODEL_DISPLAY_NAME}'...")
    model = aiplatform.Model.upload(
        display_name=MODEL_DISPLAY_NAME,
        artifact_uri=os.path.dirname(gcs_uri),  # Directory containing the model artifact
        serving_container_image_uri="us-docker.pkg.dev/vertex-ai/prediction/sklearn-cpu.1-0:latest", # Scikit-learn pre-built container
        description="RandomForestRegressor model for clinker f-CaO prediction",
        sync=True
    )
    print(f"Vertex AI Model created: {model.resource_name}")

    # 3. Create Vertex AI Endpoint resource
    print(f"Creating Vertex AI Endpoint '{ENDPOINT_DISPLAY_NAME}'...")
    endpoints = aiplatform.Endpoint.list(filter=f'display_name="{ENDPOINT_DISPLAY_NAME}"')
    if endpoints:
        endpoint = endpoints[0]
        print(f"Endpoint '{ENDPOINT_DISPLAY_NAME}' already exists: {endpoint.resource_name}")
    else:
        endpoint = aiplatform.Endpoint.create(
            display_name=ENDPOINT_DISPLAY_NAME,
            description="Endpoint for clinker quality prediction",
            sync=True
        )
        print(f"Vertex AI Endpoint created: {endpoint.resource_name}")

    # 4. Deploy the model to the Endpoint
    print(f"Deploying model '{MODEL_DISPLAY_NAME}' to endpoint '{ENDPOINT_DISPLAY_NAME}'...")
    endpoint.deploy(
        model=model,
        deployed_model_display_name=f"{MODEL_DISPLAY_NAME}_deployed",
        machine_type="n1-standard-2",  # Adjust machine type as needed
        min_replica_count=1,
        max_replica_count=1,
        sync=True
    )
    print(f"Model deployed to endpoint: {endpoint.resource_name}")
    print(f"You can now send prediction requests to this endpoint.")

if __name__ == "__main__":
    print("WARNING: Deploying models to Vertex AI Endpoints can incur costs. Please ensure you understand the pricing.")
    print("Starting model deployment to Vertex AI...")
    deploy_model()
    print("Model deployment process complete.")
