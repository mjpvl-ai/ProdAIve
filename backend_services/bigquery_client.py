from google.cloud import bigquery
import pandas as pd
import os
import logging
import time
from threading import Lock
import yaml

# --- Configuration --- #
PROJECT_ID = os.getenv("GCP_PROJECT_ID", "operations-472416")
DATASET_ID = "kiln_data_dataset"
MODEL_PREDICTIONS_TABLE_ID = "model_predictions"
VARIANCE_ANALYSIS_TABLE_ID = "variance_analysis"
MOCK_DATA_TABLE_ID = "mock_data"
CACHE_TTL_SECONDS = 60  # Time-to-live for the cache in seconds
TOOLS_FILE = os.path.join(os.path.dirname(__file__), 'tools.yaml')

# --- Logging --- #
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# --- Caches --- #
_analysis_cache = {"data": pd.DataFrame(), "last_updated": 0}
_analysis_cache_lock = Lock()

_mock_data_cache = {"data": None, "last_updated": 0}
_mock_data_cache_lock = Lock()

_predictions_cache = {"data": pd.DataFrame(), "last_updated": 0}
_predictions_cache_lock = Lock()

class BigQueryToolbox:
    def __init__(self, tools_file=TOOLS_FILE):
        self.tools = self._load_tools(tools_file)
        self.client = bigquery.Client(project=PROJECT_ID)

    def _load_tools(self, tools_file):
        try:
            with open(tools_file, 'r') as f:
                return yaml.safe_load(f)
        except FileNotFoundError:
            logger.error(f"Tools file not found at: {tools_file}")
            return None
        except yaml.YAMLError as e:
            logger.error(f"Error parsing YAML file: {e}")
            return None

    def get_tools(self):
        return self.tools.get('tools', [])

    def execute_tool(self, tool_name, parameters):
        if not self.tools:
            return None

        tool = next((t for t in self.tools.get('tools', []) if t['name'] == tool_name), None)

        if not tool:
            logger.error(f"Tool '{tool_name}' not found.")
            return None

        query = tool['statement']
        job_config = bigquery.QueryJobConfig(
            query_parameters=[
                bigquery.ScalarQueryParameter(param['name'], param['type'].upper(), parameters[param['name']])
                for param in tool.get('parameters', [])
            ]
        )

        try:
            logger.info(f"Executing tool '{tool_name}' with parameters: {parameters}")
            query_job = self.client.query(query, job_config=job_config)
            results = query_job.to_dataframe()
            return results
        except Exception as e:
            logger.error(f"An error occurred while executing tool '{tool_name}': {e}")
            return None

def load_variance_analysis_data() -> pd.DataFrame:
    with _analysis_cache_lock:
        if time.time() - _analysis_cache["last_updated"] < CACHE_TTL_SECONDS:
            return _analysis_cache["data"]
        client = bigquery.Client(project=PROJECT_ID)
        query = f"SELECT * FROM `{PROJECT_ID}.{DATASET_ID}.{VARIANCE_ANALYSIS_TABLE_ID}`"
        try:
            df = client.query(query).to_dataframe()
            _analysis_cache["data"] = df
            _analysis_cache["last_updated"] = time.time()
            return df
        except Exception as e:
            logger.error(f"An error occurred while loading analysis data: {e}")
            return pd.DataFrame()

def load_mock_data_from_bigquery() -> dict:
    with _mock_data_cache_lock:
        if time.time() - _mock_data_cache["last_updated"] < CACHE_TTL_SECONDS:
            return _mock_data_cache["data"]
        client = bigquery.Client(project=PROJECT_ID)
        query = f"SELECT key, data FROM `{PROJECT_ID}.{DATASET_ID}.{MOCK_DATA_TABLE_ID}`"
        try:
            query_job = client.query(query)
            results = query_job.result()
            mock_data = {row.key: row.data for row in results}
            _mock_data_cache["data"] = mock_data
            _mock_data_cache["last_updated"] = time.time()
            return mock_data
        except Exception as e:
            logger.error(f"An error occurred while loading mock data: {e}")
            return {}

def load_model_predictions_data() -> pd.DataFrame:
    with _predictions_cache_lock:
        if time.time() - _predictions_cache["last_updated"] < CACHE_TTL_SECONDS:
            return _predictions_cache["data"]
        client = bigquery.Client(project=PROJECT_ID)
        query = f"SELECT * FROM `{PROJECT_ID}.{DATASET_ID}.{MODEL_PREDICTIONS_TABLE_ID}`"
        try:
            df = client.query(query).to_dataframe()
            _predictions_cache["data"] = df
            _predictions_cache["last_updated"] = time.time()
            return df
        except Exception as e:
            logger.error(f"An error occurred while loading predictions data: {e}")
            return pd.DataFrame()
