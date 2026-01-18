from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import pandas as pd

app = Flask(__name__)
CORS(app)

model = joblib.load("models/battery_health_model.joblib")

FEATURE_ORDER = [
    "voltage_mean",
    "voltage_max",
    "voltage_std",
    "current_mean",
    "current_std",
    "temp_max",
    "temp_mean",
    "discharge_time",
    "voltage_drop",
    "thermal_stress",
    "discharge_intensity",
    "voltage_mean_sq",
    "temp_max_sq",
    "inv_voltage",
    "inv_time",
    "low_voltage_flag"
]


def extract_base_features(df):
    df["timestamp"] = pd.to_datetime(df["timestamp"], errors="raise")

    voltage_mean = df["voltage_v"].mean()
    voltage_max = df["voltage_v"].max()
    voltage_std = df["voltage_v"].std()

    current_mean = df["current_ma"].mean()
    current_std = df["current_ma"].std()

    temp_max = df["temperature_c"].max()
    temp_mean = df["temperature_c"].mean()

    discharge_time = (df["timestamp"].max() - df["timestamp"].min()).total_seconds()


    return {
        "voltage_mean": voltage_mean,
        "voltage_max": voltage_max,
        "voltage_std": voltage_std,
        "current_mean": current_mean,
        "current_std": current_std,
        "temp_max": temp_max,
        "temp_mean": temp_mean,
        "discharge_time": discharge_time
    }

def engineer_features(f):
    f["voltage_drop"] = f["voltage_max"] - f["voltage_mean"]

    f["thermal_stress"] = f["temp_max"] * f["current_mean"]

    f["discharge_intensity"] = (
        f["current_mean"] / (f["discharge_time"] + 1e-6)
    )

    f["voltage_mean_sq"] = f["voltage_mean"] ** 2
    f["temp_max_sq"] = f["temp_max"] ** 2

    f["inv_voltage"] = 1 / (f["voltage_mean"] + 1e-6)
    f["inv_time"] = 1 / (f["discharge_time"] + 1e-6)

    # ⚠️ IMPORTANT: quantile must be GLOBAL, not per CSV
    # Use a fixed threshold from training
    LOW_VOLTAGE_THRESHOLD = 3.6  # <-- adjust to your training data

    f["low_voltage_flag"] = int(
        f["voltage_mean"] < LOW_VOLTAGE_THRESHOLD
    )

    return f

def build_feature_array(features):
    return np.array([[features[col] for col in FEATURE_ORDER]])

def battery_status(health):
    if health >= 80:
        return "Good"
    elif health >= 60:
        return "Moderate"
    elif health >= 40:
        return "Degraded"
    else:
        return "Replace Soon"


@app.route("/predict_csv", methods=["POST"])
def predict_from_csv():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    df = pd.read_csv(file)

    base_features = extract_base_features(df)
    full_features = engineer_features(base_features)

    feature_array = build_feature_array(full_features)

    prediction = model.predict(feature_array)[0]
    prediction = max(0, min(100, prediction))
    status = battery_status(prediction)

    return jsonify({
        "predicted_battery_health": round(float(prediction), 2),
        "battery_status": status,

        "averages": {
            "avg_voltage": round(base_features["voltage_mean"], 3),
            "avg_current": round(base_features["current_mean"], 3),
            "avg_temperature": round(base_features["temp_mean"], 2)
        }
    })


@app.route("/health")
def health():
    return {"status": "ok"}


if __name__ == "__main__":
    app.run(debug=True, port=5000)
