import pandas as pd
import numpy as np
from datetime import datetime, timedelta

def generate_kiln_data(num_days=7, start_date=datetime(2023, 1, 1)):
    """
    Generates simulated cement kiln operational data with anomalies and targets.
    """
    data = []
    alerts = []
    current_datetime = start_date
    
    # Define targets
    target_kiln_temperature = 1450
    target_fuel_consumption = 80

    for i in range(num_days * 24 * 60):  # Minute-by-minute data
        timestamp = current_datetime
        
        # --- Base Simulation ---
        actual_fcao = np.random.normal(loc=2.0, scale=0.1) + np.sin(current_datetime.hour / 24 * 2 * np.pi) * 0.05
        actual_fcao = max(1.8, min(2.2, actual_fcao))

        raw_material_feed_rate = np.random.normal(loc=100, scale=2) + np.sin(current_datetime.minute / 60 * 2 * np.pi) * 1
        kiln_temperature = np.random.normal(loc=1450, scale=5) + np.cos(current_datetime.hour / 24 * 2 * np.pi) * 2
        fuel_consumption = np.random.normal(loc=80, scale=2) + np.sin(current_datetime.hour / 24 * 2 * np.pi) * 0.5
        vibration = np.random.normal(loc=0.5, scale=0.05)
        motor_current_draw = np.random.normal(loc=50, scale=1) + np.cos(current_datetime.minute / 60 * 2 * np.pi) * 0.5
        pressure = np.random.normal(loc=50, scale=2)
        oxygen = np.random.normal(loc=2.5, scale=0.05)
        
        clinker_production = raw_material_feed_rate * 0.6  # Assume 60% conversion rate
        energy_consumption_kwh = fuel_consumption * 1000 # Assume conversion factor
        specific_energy_consumption = energy_consumption_kwh / clinker_production if clinker_production > 0 else 0

        # --- Anomaly Injection ---
        is_anomaly = False
        if i % (24 * 60) == 1000:
            kiln_temperature -= 100
            is_anomaly = True
            alerts.append({'id': len(alerts) + 1, 'message': 'Kiln temperature dropped significantly', 'timestamp': timestamp, 'type': 'Warning'})
        
        if i % (12 * 60) == 300:
            vibration *= 5
            is_anomaly = True
            alerts.append({'id': len(alerts) + 1, 'message': 'High vibration detected in the kiln', 'timestamp': timestamp, 'type': 'Critical'})

        if i % (24 * 60) == 500:
            pressure += 30
            is_anomaly = True
            alerts.append({'id': len(alerts) + 1, 'message': 'Kiln pressure is unusually high', 'timestamp': timestamp, 'type': 'Warning'})

        if i % (24 * 60) == 1500:
            oxygen -= 1.5
            is_anomaly = True
            alerts.append({'id': len(alerts) + 1, 'message': 'Low oxygen level in the kiln', 'timestamp': timestamp, 'type': 'Critical'})

        data.append({
            'timestamp': timestamp,
            'actual_fcao': actual_fcao,
            'raw_material_feed_rate': raw_material_feed_rate,
            'kiln_temperature': kiln_temperature,
            'fuel_consumption': fuel_consumption,
            'vibration': vibration,
            'motor_current_draw': motor_current_draw,
            'pressure': pressure,
            'oxygen': oxygen,
            'clinker_production': clinker_production,
            'energy_consumption_kwh': energy_consumption_kwh,
            'specific_energy_consumption': specific_energy_consumption,
            'target_kiln_temperature': target_kiln_temperature,
            'target_fuel_consumption': target_fuel_consumption,
            'is_anomaly': is_anomaly
        })
        
        current_datetime += timedelta(minutes=1)
    
    df = pd.DataFrame(data)
    alerts_df = pd.DataFrame(alerts)
    
    return df, alerts_df