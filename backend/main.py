from pydantic import BaseModel
import pandas as pd
import joblib
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Customer Clustering API",
    description="API for customer segmentation using K-Means",
    version="1.0.0"
)

# Allow our frontend to communicate with the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {
        "message": "Customer Clustering API is running!"
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }

# Load the saved ML model and scaler
kmeans = joblib.load("kmeans_model.pkl")
scaler = joblib.load("scaler.pkl")


class CustomerData(BaseModel):
    annual_income: float
    spending_score: float


@app.post("/predict")
def predict_cluster(customer: CustomerData):
    # Prepare the customer data
    data = pd.DataFrame([{
        "Annual Income (k$)": customer.annual_income,
        "Spending Score (1-100)": customer.spending_score
    }])

    # Scale and predict
    scaled_data = scaler.transform(data)
    cluster = int(kmeans.predict(scaled_data)[0])

    return {
        "annual_income": customer.annual_income,
        "spending_score": customer.spending_score,
        "predicted_cluster": cluster
    }


# Load customer records with their assigned clusters
@app.get("/customers")
def get_customers():
    df = pd.read_csv("clustered_customers.csv")

    # Return only the columns needed by the dashboard
    columns = [
        "CustomerID",
        "Gender",
        "Age",
        "Annual Income (k$)",
        "Spending Score (1-100)",
        "Cluster",
    ]

    return df[columns].to_dict(orient="records")


# Return summary statistics for every cluster
@app.get("/clusters")
def get_clusters():
    df = pd.read_csv("clustered_customers.csv")

    summary = (
        df.groupby("Cluster")
        .agg(
            customer_count=("CustomerID", "count"),
            average_income=("Annual Income (k$)", "mean"),
            average_spending=("Spending Score (1-100)", "mean"),
        )
        .reset_index()
    )

    return summary.round(2).to_dict(orient="records")
