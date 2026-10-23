import pandas as pd
from sklearn.preprocessing import StandardScaler

# Dataset path
DATASET_PATH = "../dataset/Mall_Customers.csv"

# Load dataset
df = pd.read_csv(DATASET_PATH)

# Features for customer segmentation
FEATURES = [
    "Annual Income (k$)",
    "Spending Score (1-100)"
]

# Select only clustering features
X = df[FEATURES].copy()

# Scale the features
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Display results
print("--- SELECTED FEATURES ---")
print(X.head())

print("\n--- ORIGINAL DATA SHAPE ---")
print(X.shape)

print("\n--- SCALED DATA (FIRST 5 ROWS) ---")
print(X_scaled[:5])

print("\n--- SCALED DATA SHAPE ---")
print(X_scaled.shape)
