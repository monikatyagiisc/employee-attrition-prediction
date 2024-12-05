from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import pandas as pd
import joblib
import uvicorn

# Load the model
try:
    model = joblib.load("model.pkl")
    if model:
        print("Model loaded successfully!")
except Exception as e:
    raise RuntimeError(f"Error loading the model: {e}")

# Define input schema for FastAPI
class ModelInput(BaseModel):
    TravelProfile: Optional[str] = None
    Department: Optional[str] = None
    EducationField: Optional[str] = None
    Gender: Optional[str] = None
    Designation: Optional[str] = None
    MaritalStatus: Optional[str] = None
    Age: Optional[float] = 30.0  # Default value
    CurrentProfile: Optional[float] = 1.0  # Default value
    ESOPs: Optional[int] = 0  # Default value
    EmployeeID: Optional[int] = 1  # Default value
    HomeToWork: Optional[float] = 10.0  # Default value
    HourlnWeek: Optional[float] = 40.0  # Default value
    Involvement: Optional[int] = 3  # Default value
    JobSatisfaction: Optional[int] = 3  # Default value
    LastPromotion: Optional[float] = 2.0  # Default value
    MonthlyIncome: Optional[float] = 50000.0  # Default value
    NumCompaniesWorked: Optional[float] = 2.0  # Default value
    OverTime: Optional[str] = "No"  # Default value
    SalaryHikelastYear: Optional[float] = 10.0  # Default value
    WorkExperience: Optional[float] = 8.0  # Default value
    WorkLifeBalance: Optional[int] = 3  # Default value

    class Config:
        extra = "ignore"


# Default feature values and order
DEFAULT_FEATURES = {
    "TravelProfile_Rarely": 0,
    "TravelProfile_Yes": 0,
    "TravelProfile_nan": 0,
    "Department_Marketing": 0,
    "Department_Sales": 0,
    "Department_nan": 0,
    "EducationField_Engineer": 0,
    "EducationField_MBA": 0,
    "EducationField_Marketing Diploma": 0,
    "EducationField_Other": 0,
    "EducationField_Statistics": 0,
    "EducationField_nan": 0,
    "Gender_Female": 0,
    "Gender_Male": 0,
    "Gender_nan": 0,
    "Designation_Executive": 0,
    "Designation_Manager": 0,
    "Designation_Senior Manager": 0,
    "Designation_VP": 0,
    "Designation_nan": 0,
    "MaritalStatus_M": 0,
    "MaritalStatus_Married": 0,
    "MaritalStatus_Single": 0,
    "MaritalStatus_nan": 0,
    "Age": 30,
    "CurrentProfile": 5,
    "ESOPs": 0,
    "EmployeeID": 1,
    "HomeToWork": 10,
    "HourlnWeek": 40,
    "Involvement": 3,
    "JobSatisfaction": 3,
    "LastPromotion": 2,
    "MonthlyIncome": 50000,
    "NumCompaniesWorked": 2,
    "OverTime": 0,
    "SalaryHikelastYear": 10,
    "WorkExperience": 8,
    "WorkLifeBalance": 3,
}

FEATURE_ORDER = [
    "TravelProfile_Rarely", "TravelProfile_Yes", "TravelProfile_nan",
    "Department_Marketing", "Department_Sales", "Department_nan",
    "EducationField_Engineer", "EducationField_MBA",
    "EducationField_Marketing Diploma", "EducationField_Other",
    "EducationField_Statistics", "EducationField_nan", "Gender_Female",
    "Gender_Male", "Gender_nan", "Designation_Executive", "Designation_Manager",
    "Designation_Senior Manager", "Designation_VP", "Designation_nan",
    "MaritalStatus_M", "MaritalStatus_Married", "MaritalStatus_Single",
    "MaritalStatus_nan", "Age", "CurrentProfile", "ESOPs", "EmployeeID",
    "HomeToWork", "HourlnWeek", "Involvement", "JobSatisfaction", "LastPromotion",
    "MonthlyIncome", "NumCompaniesWorked", "OverTime", "SalaryHikelastYear",
    "WorkExperience", "WorkLifeBalance"
]

# Initialize FastAPI app
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def preprocess_payload(input_data: ModelInput):
    # Start with default features
    features = DEFAULT_FEATURES.copy()

    # Update numerical fields, using defaults for missing or invalid values
    features.update({
        "Age": input_data.Age or 30,
        "MonthlyIncome": input_data.MonthlyIncome or 50000,
        "JobSatisfaction": int(input_data.JobSatisfaction) or 3,
        "OverTime": 1 if (input_data.OverTime or "No").lower() == "yes" else 0,
        "WorkLifeBalance": input_data.WorkLifeBalance or 3,
        "CurrentProfile": input_data.CurrentProfile or 5,
        "ESOPs": input_data.ESOPs or 0,
        "HomeToWork": input_data.HomeToWork or 10,
        "HourlnWeek": input_data.HourlnWeek or 40,
        "Involvement": input_data.Involvement or 3,
        "LastPromotion": input_data.LastPromotion or 2,
        "NumCompaniesWorked": input_data.NumCompaniesWorked or 2,
        "SalaryHikelastYear": input_data.SalaryHikelastYear or 10,
        "WorkExperience": input_data.WorkExperience or 8,
    })

    # Dynamic one-hot encoding for categorical fields
    for field in ["TravelProfile", "Department", "EducationField", "Gender", "Designation", "MaritalStatus"]:
        value = getattr(input_data, field, None)
        if value:
            for key in features.keys():
                if key.startswith(f"{field}_"):
                    features[key] = 0
            features[f"{field}_{value.strip()}"] = 1

    # Align features with FEATURE_ORDER
    final_features = {key: features.get(key, 0) for key in FEATURE_ORDER}

    return final_features


@app.post("/predict")
def predict(input_data: ModelInput):
    try:
        # Preprocess the input data
        processed_data = preprocess_payload(input_data)

        # Create a DataFrame with the correct feature order
        input_df = pd.DataFrame([processed_data], columns=FEATURE_ORDER)

        # Make prediction
        prediction = model.predict(input_df)

        # Return the prediction as JSON
        return {"prediction": prediction.tolist()}
    except Exception as e:
        raise HTTPException(
            status_code=400, detail=f"Model prediction error: {e}"
        )


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=4000)
