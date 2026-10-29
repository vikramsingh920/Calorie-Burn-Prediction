from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import joblib

app = FastAPI(title="Calories Burned API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

bundle = joblib.load("model/model.joblib")
model, cols = bundle["model"], bundle["columns"]


class Workout(BaseModel):
    gender: str          # "Male" or "Female"
    age: int
    height: float        # cm
    weight: float        # kg
    duration: float      # minutes
    heart_rate: float    # bpm
    body_temp: float     # °C


@app.get("/")
def health():
    return {"status": "ok"}


@app.post("/predict")
def predict(w: Workout):
    row = pd.DataFrame([{
        "Gender": 0 if w.gender.lower() == "male" else 1,
        "Age": w.age,
        "Height": w.height,
        "Weight": w.weight,
        "Duration": w.duration,
        "Heart_Rate": w.heart_rate,
        "Body_Temp": w.body_temp,
    }])[cols]
    calories = float(model.predict(row)[0])
    return {"calories": round(calories, 1)}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api:app", host="127.0.0.1", port=8000, reload=False)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api:app", host="127.0.0.1", port=8000, reload=False)
    return {"calories": round(calories, 1)}
