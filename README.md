# 🔋 Battery Health Predictor

An end-to-end **Machine Learning + Full-Stack** application that predicts **battery health (%)** from real battery discharge logs.  
The system uses engineered electrical and thermal features from time-series CSV logs and serves predictions through a Flask API with a modern Next.js dashboard.

---

## 🚀 Features

- 📊 Predicts **battery health percentage (0–100%)**
- 📂 Upload real battery CSV log files
- 🧠 ML model trained on **NASA Battery Dataset**
- ⚙️ Advanced feature engineering (thermal stress, voltage drop, discharge intensity)
- 🌐 Full-stack app with **Next.js frontend + Flask backend**
- 🐳 Dockerized backend & frontend
- 🔄 CI pipeline with **GitHub Actions**

---

## 🧠 Machine Learning Overview

### Dataset
- **NASA Battery Dataset**
- Raw discharge cycle CSV files
- Sensor data: voltage, current, temperature, timestamps

### ML Pipeline
1. Exploratory Data Analysis (EDA)
2. Feature Engineering
3. Model Training (Random Forest Regressor)
4. Model Evaluation
5. Model Serialization (`joblib`)

### Engineered Features
- Voltage drop
- Thermal stress
- Discharge intensity
- Squared & inverse features
- Low-voltage flag

### Model Performance
| Metric | Value |
| :--- | :--- |
| **MAE** | ~5.5 |
| **RMSE** | ~10.3 |
| **R²** | ~0.92 |

---

## 🏗️ Project Architecture

### 📁 Folder Structure

```text
Battery-health-predictor/
├── docker-compose.yml
├── docker-compose.dev.yml
├── docker-compose.prod.yml
├── backend/
│   ├── app.py
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── data/
│   │   ├── raw/
│   │   ├── processed/
│   │   └── cleaned_battery_data.csv
│   ├── models/
│   │   └── battery_health_model.joblib
│   └── notebooks/
│       ├── 01_eda.ipynb
│       ├── 02_feature_engineering.ipynb
│       ├── 03_model_training.ipynb
│       └── 04_model_evaluation_and_insights.ipynb
└── frontend/
    ├── Dockerfile
    ├── package.json
    ├── app/
    ├── components/
    └── context/
```
## ⚙️ Tech Stack

### Frontend
- **Next.js** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Chart.js / Recharts**

### Backend
- **Flask**
- **Pandas / NumPy**
- **Scikit-learn**
- **Joblib**
- **Gunicorn**

### DevOps
- **Docker & Docker Compose**
- **GitHub Actions** (CI)

---

## 🐳 Run Locally (Docker)

### Development
```bash
docker-compose -f docker-compose.dev.yml up --build
```
## 🌐 API Endpoints

### Health Check
`GET /health`

### Predict from CSV
`POST /predict_csv`

**Request:**
* **Type:** Multipart form-data
* **Key:** `file`
* **Value:** CSV file with columns: `timestamp`, `voltage_v`, `current_ma`, `temperature_c`

**Response:**
```json
{
  "predicted_battery_health": 82.45,
  "battery_status": "Good",
  "averages": {
    "avg_voltage": 3.72,
    "avg_current": 1.45,
    "avg_temperature": 29.4
  }
}
```
## 📊 Frontend Functionality

* **CSV upload & validation** – Securely handle and verify battery log data formats.
* **Battery health score visualization** – Clear, intuitive display of the predicted health percentage.
* **Voltage, current & temperature charts** – Interactive time-series data visualization for sensor metrics.
* **Health status classification:**
    * ✅ **Good**
    * ⚠️ **Moderate**
    * 🟠 **Degraded**
    * 🚨 **Replace Soon**


