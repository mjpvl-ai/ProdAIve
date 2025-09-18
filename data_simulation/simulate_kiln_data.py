import pandas as pd
import numpy as np
from datetime import datetime, timedelta

def generate_kiln_data(num_days=7, start_date=datetime(2023, 1, 1)):
    """
    Generates simulated cement kiln operational data.
    """
    data = []
    current_datetime = start_date
    for _ in range(num_days * 24 * 60):  # Minute-by-minute data
        timestamp = current_datetime
        
        # Simulate f-CaO with some fluctuations and a general trend
        f_cao = np.random.normal(loc=2.0, scale=0.2) + np.sin(current_datetime.hour / 24 * 2 * np.pi) * 0.1
        f_cao = max(1.5, min(2.5, f_cao)) # Keep within a reasonable range

        # Simulate other parameters with some correlation and noise
        raw_material_feed_rate = np.random.normal(loc=100, scale=5) + np.sin(current_datetime.minute / 60 * 2 * np.pi) * 2
        kiln_temperature = np.random.normal(loc=1450, scale=10) + np.cos(current_datetime.hour / 24 * 2 * np.pi) * 5
        fuel_consumption = np.random.normal(loc=80, scale=3) + np.sin(current_datetime.hour / 24 * 2 * np.pi) * 1
        vibration = np.random.normal(loc=0.5, scale=0.1)
        motor_current_draw = np.random.normal(loc=50, scale=2) + np.cos(current_datetime.minute / 60 * 2 * np.pi) * 1

        data.append({
            'timestamp': timestamp,
            'f_cao': f_cao,
            'raw_material_feed_rate': raw_material_feed_rate,
            'kiln_temperature': kiln_temperature,
            'fuel_consumption': fuel_consumption,
            'vibration': vibration,
            'motor_current_draw': motor_current_draw
        })
        current_datetime += timedelta(minutes=1)
    
    df = pd.DataFrame(data)
    return df

if __name__ == "__main__":
    print("Generating simulated kiln data...")
    simulated_data = generate_kiln_data(num_days=7)
    output_path = 'data_simulation/simulated_kiln_data.csv'
    simulated_data.to_csv(output_path, index=False)
    print(f"Simulated data saved to {output_path}")
    print(simulated_data.head())
