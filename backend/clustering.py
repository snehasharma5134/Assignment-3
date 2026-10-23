import pandas as pd
import joblib
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score

# 1. Load dataset
DATASET_PATH = "../dataset/Mall_Customers.csv"
df = pd.read_csv(DATASET_PATH)

# 2. Select features
FEATURES = [
    "Annual Income (k$)",
    "Spending Score (1-100)"
]
X = df[FEATURES]

# 3. Scale the data
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# 4. Create K-Means model
kmeans = KMeans(
    n_clusters=5,
    random_state=42,
    n_init=10
)

# 5. Train the model and assign clusters
df["Cluster"] = kmeans.fit_predict(X_scaled)

# 6. Evaluate clustering
score = silhouette_score(X_scaled, df["Cluster"])

print("--- CLUSTERING RESULTS ---")
print("Number of clusters:", df["Cluster"].nunique())
print("Silhouette Score:", round(score, 3))

print("\n--- CUSTOMERS PER CLUSTER ---")
print(df["Cluster"].value_counts().sort_index())

print("\n--- CLUSTER PROFILES ---")
print(
    df.groupby("Cluster")[FEATURES]
    .mean()
    .round(2)
)

print("\n--- FIRST 10 CUSTOMERS WITH CLUSTERS ---")
print(df[["CustomerID", *FEATURES, "Cluster"]].head(10))


# 7. Save the trained model and scaler
joblib.dump(kmeans, "kmeans_model.pkl")
joblib.dump(scaler, "scaler.pkl")

# 8. Save clustered customer data
df.to_csv("clustered_customers.csv", index=False)

print("\n--- FILES SAVED SUCCESSFULLY ---")
print("Model saved: kmeans_model.pkl")
print("Scaler saved: scaler.pkl")
print("Customer data saved: clustered_customers.csv")
