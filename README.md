# 🔥 Calories Burned Predictor & Fitness Analytics

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-success?style=for-the-badge&logo=vercel)](https://calorie-burn-prediction-kappa.vercel.app/)
[![React](https://img.shields.io/badge/Frontend-React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://calorie-burn-prediction-kappa.vercel.app/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://github.com/vikramsingh920/Calorie-Burn-Prediction)
[![Machine Learning](https://img.shields.io/badge/ML-Scikit--Learn-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white)](https://github.com/vikramsingh920/Calorie-Burn-Prediction)

> 🚀 **Live Web Application:** [https://calorie-burn-prediction-kappa.vercel.app](https://calorie-burn-prediction-kappa.vercel.app/)

A full-stack, sports-science driven Machine Learning web application that predicts personal caloric expenditure during exercise with high accuracy ($R^2 > 0.99$) and provides deep physiological insights into energy expenditure, heart rate training zones, and metabolic baselines.

Inspired by the clean, utilitarian UX of **[tdeecalculator.net](https://tdeecalculator.net/)**, the platform pairs a high-performance **Random Forest Regressor** with a responsive **React 19 / Vite** dashboard.

---

## 🌟 Key Features

### 1. 🤖 Machine Learning Inference
* **High-Accuracy Modeling:** Trained on 15,000 real-world exercise sessions using an ensemble `RandomForestRegressor` with 100 decision trees.
* **Biometric & Intensity Factors:** Evaluates gender, age, height, weight, duration, heart rate, and body temperature.
* **Instantaneous Response:** Sub-170ms inference latency served via FastAPI.

### 2. 📊 Sports Science & Interactive Analytics
* **📈 Cumulative Calorie Progression Curve:**
  * Interactive SVG area chart charting calorie accumulation from minute 0 to total workout duration.
  * **Dual Trajectories:** Visualizes *Active Workout Burn* alongside the *Basal Metabolic Rate (BMR) Resting Baseline*.
  * **Interactive Hover Tooltips:** Displays minute-by-minute calorie milestones, baseline resting burn, and net active exercise gain.
* **🎯 5-Stage Heart Rate Training Zone Meter:**
  * Dynamically computes maximum heart rate ($\text{HR}_{\max} = 220 - \text{Age}$).
  * Visual 5-segment intensity gauge:
    * 🟦 **Zone 1 (50–60%):** Warmup & Active Recovery
    * 🟩 **Zone 2 (60–70%):** Fat Burn Zone (Peak Fat Oxidation)
    * 🟨 **Zone 3 (70–80%):** Aerobic Cardio (Heart Stroke Volume & Endurance)
    * 🟧 **Zone 4 (80–90%):** Anaerobic Threshold (Lactate Tolerance)
    * 🟥 **Zone 5 (90–100%):** Peak $\text{VO}_2$ Max (Sprint & Power Capacity)
  * Animated marker pin displaying exact BPM and intensity percentage.
  * Explains primary energy substrate (e.g., *65% Fat / 35% Carbohydrates*).
* **🍕 Food Equivalents:** Translates calories burned into real-world food items (Bananas, Pizza Slices, Lattes, Avocados).
* **⏱️ Calorie Milestone Targets:** Duration requirement table for burning 150, 300, 500, and 750 kcal at current workout intensity.
* **💧 Hydration Estimator:** Computes recommended fluid replacement volume based on workout length and thermal load.

### 3. 🎨 Modern, High-Performance UI (TDEE Style)
* **🔄 Bidirectional Dual Unit System:** Toggle between **Metric (`cm, kg, °C`)** and **Imperial (`ft, in, lbs, °F`)** with instant mathematical conversion that preserves your input.
* **🌓 Persistent Dark & Light Themes:**
  * Automatically detects system `prefers-color-scheme`.
  * Persists selection in `localStorage`.
  * Pre-hydration script eliminates light-mode flash on page refresh.
* **⚡ Inline Real-Time Validation:** Custom field constraints and error indicators (red borders and validation messages) for invalid inputs without blocking browser popups.
* **💡 Contextual UX Hints:** Helpful guide notes for harder biometric fields (e.g., typical exercise body temperature ranges).
* **📐 Above-The-Fold Layout:** Tightened spacing and responsive grid ensuring the entire calculator fits on screen without vertical scrolling.

---

## 🛠️ Tech Stack

### Frontend
* **Framework:** React 19 + Vite 6
* **Deployment:** Vercel ([Live Link](https://calorie-burn-prediction-kappa.vercel.app/))
* **Styling:** Modern Vanilla CSS with CSS Variables / Design Tokens (zero heavy UI libraries)
* **Visualizations:** Native, lightweight, responsive SVG charts (no heavy chart dependencies)
* **State & Persistence:** React Hooks (`useState`, `useEffect`) + Browser `localStorage`

### Backend & API
* **Framework:** FastAPI (Python 3.14)
* **Data Validation:** Pydantic models
* **Server:** Uvicorn ASGI server
* **CORS:** Configured for decoupled frontend-backend communication

### Machine Learning & Data Science
* **Modeling:** `scikit-learn` (`RandomForestRegressor`, `train_test_split`, `r2_score`, `mean_absolute_error`)
* **Data Manipulation:** `pandas`, `numpy`
* **Model Serialization:** `joblib` with level 3 compression
* **Alternative Dashboard:** Streamlit (`app.py`)

---

## 📂 Project Structure

```text
Calorie-Burn-Prediction/
├── Data/
│   ├── calories.csv             # Target calorie burn labels (15,000 records)
│   └── exercise.csv             # Biometric and workout features (15,000 records)
├── model/
│   └── model.joblib             # Serialized model bundle & column order schema
├── Notebooks/
│   └── eda-and-modeling.ipynb   # Exploratory Data Analysis & algorithm benchmarks
├── Frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.jsx              # Main React application & sports science logic
│   │   ├── App.css              # TDEE-inspired styling, charts & zone meters
│   │   ├── index.css            # Dark/light theme color tokens & typography
│   │   └── main.jsx             # React DOM entrypoint
│   ├── .env                     # API URL configuration (VITE_API_URL)
│   ├── index.html               # HTML shell with zero-flash theme bootstrap
│   ├── package.json             # NPM dependencies & build scripts
│   └── vite.config.js           # Vite server configuration (IPv4 127.0.0.1)
├── api.py                       # FastAPI REST API backend (/predict endpoint)
├── app.py                       # Alternative standalone Streamlit web app
├── train.py                     # ML pipeline training & export script
├── requirements.txt             # Python dependencies
└── README.md                    # Project documentation
```

---

## 🚀 Getting Started

### 🌐 Live Deployment
* **Web App (Vercel):** [https://calorie-burn-prediction-kappa.vercel.app](https://calorie-burn-prediction-kappa.vercel.app/)

---

### Local Development Setup

#### Prerequisites
* **Python:** 3.10 or higher (`py` launcher on Windows)
* **Node.js:** v18 or higher with `npm`

---

#### Step 1: Backend Setup (FastAPI)

1. Clone or open the repository directory:
   ```powershell
   cd Calorie-Burn-Prediction
   ```

2. Install Python dependencies:
   ```powershell
   pip install -r requirements.txt
   ```

3. Start the FastAPI backend:
   ```powershell
   py api.py
   ```
   * **API URL:** [http://127.0.0.1:8000](http://127.0.0.1:8000)
   * **Interactive Swagger Docs:** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

#### Step 2: Frontend Setup (React + Vite)

1. Open a new terminal and navigate to the `Frontend` directory:
   ```powershell
   cd Frontend
   ```

2. Install Node dependencies:
   ```powershell
   npm install
   ```

3. Start the Vite development server:
   ```powershell
   npm run dev
   ```
   * **Local Web App URL:** [http://127.0.0.1:5173](http://127.0.0.1:5173)

---

#### Alternative: Run via Streamlit

If you prefer running the single-file Streamlit application:
```powershell
py -m streamlit run app.py
```
* **Streamlit URL:** [http://localhost:8501](http://localhost:8501)

---

## 🧠 Model Training Details

To retrain the Random Forest model from raw dataset files:
```powershell
py train.py
```

### Dataset Features:
| Feature | Type | Description |
| :--- | :--- | :--- |
| `Gender` | Categorical | Encoded as `0` for Male, `1` for Female |
| `Age` | Numerical | Age in years (10 to 85) |
| `Height` | Numerical | Height in centimeters |
| `Weight` | Numerical | Weight in kilograms |
| `Duration` | Numerical | Active exercise duration in minutes |
| `Heart_Rate`| Numerical | Average workout heart rate in beats per minute |
| `Body_Temp` | Numerical | Core body temperature during exercise in °C |

### Model Performance:
* **Algorithm:** Random Forest Regressor (`n_estimators=100`, `random_state=42`)
* **MAE:** `< 1.8` kcal
* **$R^2$ Score:** `> 0.99`

---

## 👨‍💻 Author

**Made with ❤️ by Vikram**  
*Fitness planning calculations and machine learning modeling for educational purposes.*
