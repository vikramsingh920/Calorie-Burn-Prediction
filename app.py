import streamlit as st
import pandas as pd
import joblib

st.set_page_config(page_title="Calories Burned Predictor", page_icon="🔥", layout="centered")

@st.cache_resource
def load_model():
    return joblib.load("model/model.joblib")

bundle = load_model()
model, cols = bundle["model"], bundle["columns"]

st.title("🔥 Calories Burned Predictor")
st.write("Enter your workout details to estimate calories burned using Machine Learning.")

col1, col2 = st.columns(2)

with col1:
    gender = st.selectbox("Gender", ["Male", "Female"])
    age = st.slider("Age (years)", 10, 85, 30)
    height = st.number_input("Height (cm)", 120.0, 220.0, 170.0)
    weight = st.number_input("Weight (kg)", 30.0, 200.0, 70.0)

with col2:
    duration = st.slider("Duration (minutes)", 1, 120, 20)
    heart_rate = st.slider("Heart rate (bpm)", 50, 220, 105)
    body_temp = st.slider("Body temperature (°C)", 36.0, 42.0, 39.0)

if st.button("Calculate Calories Burned", use_container_width=True):
    row = pd.DataFrame([{
        "Gender": 0 if gender == "Male" else 1,
        "Age": age,
        "Height": height,
        "Weight": weight,
        "Duration": duration,
        "Heart_Rate": heart_rate,
        "Body_Temp": body_temp,
    }])[cols]
    result = model.predict(row)[0]
    st.success(f"🔥 Estimated calories burned: **{result:.1f} kcal**")

