import pandas as pd

# Dataset path
DATASET_PATH = "../dataset/Mall_Customers.csv"

# Read CSV file 
df = pd.read_csv(DATASET_PATH)

# Basic information of Dataset
print("\n--- FIRST 5 ROWS ---")
print(df.head())

print("\n--- DATASET SHAPE ---")
print(df.shape)

print("\n--- COLUMN NAMES ---")
print(df.columns.tolist())

print("\n--- DATA TYPES ---")
print(df.dtypes)

print("\n--- MISSING VALUES ---")
print(df.isnull().sum())

print("\n--- DUPLICATE ROWS ---")
print(df.duplicated().sum())

print("\n--- UNIQUE VALUES ---")
print("Gender:", df["Gender"].unique())
print("Age range:", df["Age"].min(), "to", df["Age"].max())
print(
    "Income range:",
    df["Annual Income (k$)"].min(),
    "to",
    df["Annual Income (k$)"].max()
)
print(
    "Spending score range:",
    df["Spending Score (1-100)"].min(),
    "to",
    df["Spending Score (1-100)"].max()
)

print("\n--- STATISTICAL SUMMARY ---")
print(df.describe())
