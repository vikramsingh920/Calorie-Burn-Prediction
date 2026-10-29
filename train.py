import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score


exercise = pd.read_csv("data/exercise.csv")
calories = pd.read_csv("data/calories.csv")
df = exercise.merge(calories, on="User_ID").drop(columns="User_ID")


df["Gender"] = df["Gender"].map({"male": 0, "female": 1})


X = df.drop(columns="Calories")
y = df["Calories"]
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

model = RandomForestRegressor(n_estimators=100, random_state=42, n_jobs=-1)
model.fit(X_train, y_train)

pred = model.predict(X_test)
print("MAE:", mean_absolute_error(y_test, pred))
print("R2:", r2_score(y_test, pred))

joblib.dump({"model": model, "columns": list(X.columns)}, "model/model.joblib", compress=3)
print("Model saved to model/model.joblib")