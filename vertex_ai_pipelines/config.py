# Copyright 2024 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
"""Configuration file for the Vertex AI pipeline."""

import os

# Project and pipeline configuration
PROJECT_ID = os.getenv("PROJECT_ID", "your-gcp-project-id")
REGION = os.getenv("REGION", "us-central1")
PIPELINE_ROOT = os.getenv("PIPELINE_ROOT", "gs://your-bucket/pipeline-root")
PIPELINE_NAME = "cement-production-optimization-pipeline"

# Data configuration
DATASET_URI = "bq://your-gcp-project-id.your_dataset.your_table"

# Model training configuration
MODEL_DISPLAY_NAME = "clinker-quality-predictor"
TRAINING_CONTAINER_URI = "us-docker.pkg.dev/vertex-ai/training/lightgbm-cpu.1-0:latest"

# Deployment configuration
SERVING_CONTAINER_URI = "us-docker.pkg.dev/vertex-ai/prediction/sklearn-cpu.1-0:latest"
ENDPOINT_NAME = "clinker-quality-endpoint"
