# ClusterIQ — Customer Segmentation Dashboard

## Project Overview

**ClusterIQ** is a machine learning-based customer segmentation dashboard that groups customers according to their annual income and spending score using the **K-Means clustering algorithm**.

The project combines a React frontend with a FastAPI backend to visualise customer groups, explore customer records, and predict the cluster of a new customer.

## Key Features

- **Customer Overview Dashboard:** Displays customer statistics, cluster counts, and model information.
- **Customer Cluster Visualisation:** Scatter plot showing annual income versus spending score.
- **Cluster Summaries:** Displays customer counts and average income and spending for each cluster.
- **Customer Directory:** Displays customer records with field-based search for Customer ID, Gender, Age, Annual Income, Spending Score, and Cluster.
- **Cluster Details:** Allows users to inspect and search customer records within a selected cluster.
- **Customer Segment Prediction:** Predicts a cluster for a new customer using annual income and spending score.
- **Interactive Dashboard:** Provides charts, cluster cards, and customer tables.

## Technology Stack

### Frontend
- React
- Vite
- JavaScript
- Recharts
- Lucide React
- CSS

### Backend
- Python
- FastAPI
- Uvicorn
- pandas
- NumPy
- scikit-learn

### Machine Learning
- K-Means clustering
- StandardScaler for feature scaling
- Annual Income and Spending Score as clustering features

## Dataset

The project uses the **Mall Customers dataset**, stored as `Mall_Customers.csv`.

Important attributes include:

| Column | Description |
|---|---|
| `CustomerID` | Customer identifier |
| `Gender` | Customer gender |
| `Age` | Customer age |
| `Annual Income (k$)` | Annual income in thousands of dollars |
| `Spending Score (1-100)` | Spending score from 1 to 100 |
| `Cluster` | Assigned cluster label, if included in the processed data |

The original Mall Customers dataset contains 200 customer records. The clustering workflow uses annual income and spending score to group customers with similar characteristics.

## Project Structure

```text
Assignment(3)/
├── backend/
│   ├── main.py
│   ├── preprocess.py
│   ├── requirements.txt
│   └── other model and backend files
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   └── App.css
│   ├── package.json
│   └── other frontend files
├── dataset/
│   └── Mall_Customers.csv
└── README.md
```

*The structure above is illustrative. Keep the dataset in the exact location expected by the backend code, and adjust the file listing to match the repository.*

## Prerequisites

Install the following software before running the project:

- Python
- Node.js and npm
- Git (optional)

## How to Run the Project

Run the backend and frontend in **two separate terminals**.

### 1. Start the Backend

Open Git Bash and navigate to the backend folder:

```bash
cd ~/Desktop/Internship/Assignment\(3\)/backend
```

If the project is inside OneDrive, use:

```bash
cd ~/OneDrive/Desktop/Internship/Assignment\(3\)/backend
```

Create a virtual environment:

```bash
python -m venv .venv
```

Activate it in Git Bash on Windows:

```bash
source .venv/Scripts/activate
```

Install dependencies. If `requirements.txt` exists:

```bash
pip install -r requirements.txt
```

If it does not exist, install the commonly required packages:

```bash
pip install fastapi "uvicorn[standard]" pandas numpy scikit-learn joblib
```

Start the FastAPI server:

```bash
python -m uvicorn main:app --reload
```

Backend URLs:

- API: `http://127.0.0.1:8000`
- Interactive API documentation: `http://127.0.0.1:8000/docs`

Keep this terminal running.

### 2. Start the Frontend

Open a **second Git Bash terminal**:

```bash
cd ~/Desktop/Internship/Assignment\(3\)/frontend
```

For a OneDrive Desktop location:

```bash
cd ~/OneDrive/Desktop/Internship/Assignment\(3\)/frontend
```

Install frontend dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

Open the local URL printed in the terminal, commonly:

`http://localhost:5173`

Keep both the backend and frontend running while using the dashboard.

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/customers` | Retrieves customer records |
| GET | `/clusters` | Retrieves cluster summaries |
| POST | `/predict` | Predicts a cluster for a new customer |

Example prediction request:

```json
{
  "annual_income": 50,
  "spending_score": 70
}
```

The response format is defined by the backend implementation.

## Machine Learning Workflow

1. Load customer data from the Mall Customers dataset.
2. Select annual income and spending score.
3. Scale the selected features using StandardScaler.
4. Apply K-Means clustering to group customers.
5. Provide customer records and cluster summaries through FastAPI.
6. Accept new customer inputs and predict their cluster.
7. Display customer groups and prediction results in the React dashboard.

The dashboard displays a silhouette score of `0.555`. Verify this value against the actual model evaluation before using it in a formal report or presentation.

## Troubleshooting

**The dashboard cannot connect to the backend**
- Confirm that FastAPI is running at `http://127.0.0.1:8000`.
- Check the backend terminal for errors.

**The dataset cannot be found**
- Verify the CSV location configured in the backend.
- Ensure the filename is exactly `Mall_Customers.csv`.

**Python dependencies are missing**
- Activate the backend virtual environment.
- Install the packages listed in `requirements.txt`, if available.

**The frontend does not start**
- Confirm Node.js and npm are installed.
- Run `npm install` inside the `frontend` folder.

## Future Improvements

- Automated model evaluation and metric reporting.
- More detailed cluster profiling.
- Automated tests for API endpoints and customer search.
- Deployment support with configurable API URLs.

## Project Information

- **Project Name:** ClusterIQ
- **Category:** Machine Learning and Full-Stack Web Development
- **Algorithm:** K-Means Clustering
- **Frontend:** React + Vite
- **Backend:** FastAPI
- **Dataset:** Mall Customers

This project is intended for educational and demonstration purposes. Cluster assignments are exploratory and should not be treated as definitive assessments of individual customers.