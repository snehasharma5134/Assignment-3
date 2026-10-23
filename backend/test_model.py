
import pandas as pd
import joblib

# Load saved model and scaler
kmeans = joblib.load("kmeans_model.pkl")
scaler = joblib.load("scaler.pkl")

# Sample customer data: Income and Spending Score
sample = pd.DataFrame({
    "Annual Income (k$)": [15, 90, 25],
    "Spending Score (1-100)": [80, 15, 75]
})

# Scale sample data and predict clusters
sample_scaled = scaler.transform(sample)
predictions = kmeans.predict(sample_scaled)

# Display predictions
sample["Predicted Cluster"] = predictions

print("--- TEST PREDICTIONS ---")
print(sample)
