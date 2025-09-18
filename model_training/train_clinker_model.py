import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score
import joblib

# --- Configuration --- #
PROCESSED_DATA_PATH = "model_training/processed_kiln_data.csv"
MODEL_PATH = "model_training/clinker_quality_model.joblib"

def train_model():
    print("Loading processed data...")
    df = pd.read_csv(PROCESSED_DATA_PATH)

    # Convert timestamp to datetime and set as index for time-series considerations
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    df = df.set_index('timestamp')

    # Define features (X) and target (y)
    # For a simple regression, we'll use other sensor readings to predict f_cao
    features = ['raw_material_feed_rate', 'kiln_temperature', 'fuel_consumption', 'vibration', 'motor_current_draw', 'f_cao_lag1']
    target = 'f_cao'

    X = df[features]
    y = df[target]

    # Split data into training and testing sets
    # For time-series, a simple train_test_split might not be ideal, but for MVP it's sufficient.
    # A more robust approach would be time-series split or walk-forward validation.
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    print(f"Training data shape: {X_train.shape}")
    print(f"Testing data shape: {X_test.shape}")

    # Initialize and train the RandomForestRegressor model
    print("Training RandomForestRegressor model...")
    model = RandomForestRegressor(n_estimators=100, random_state=42, n_jobs=-1)
    model.fit(X_train, y_train)

    # Make predictions on the test set
    y_pred = model.predict(X_test)

    # Evaluate the model
    mse = mean_squared_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)

    print(f"Model Evaluation:")
    print(f"  Mean Squared Error (MSE): {mse:.4f}")
    print(f"  R-squared (R2): {r2:.4f}")

    # Save the trained model
    joblib.dump(model, MODEL_PATH)
    print(f"Model saved to {MODEL_PATH}")

if __name__ == "__main__":
    print("Starting model training...")
    train_model()
    print("Model training complete.")
