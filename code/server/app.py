import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib  # Replace with your model's library for loading
import uvicorn

# Load the model
try:
    model = joblib.load("model.pkl")

    if model:
        print("Model loaded successfully!")
except Exception as e:
    raise RuntimeError(f"Error loading the model: {e}")

# Define input data schema


# class ModelInput(BaseModel):
#     features: list

class ModelInput(BaseModel):
    age: float
    monthly_income: float
    job_satisfaction: int
    over_time: str  # Accept "Yes"/"No"
    work_life_balance: int


DEFAULT_FEATURES = {
    "TravelProfile_Rarely": 1,
    "TravelProfile_Yes": 0,
    "TravelProfile_nan": 0,
    "Department_Marketing": 0,
    "Department_Sales": 1,
    "Department_nan": 0,
    "EducationField_Engineer": 1,
    "EducationField_MBA": 0,
    "EducationField_Marketing Diploma": 0,
    "EducationField_Other": 0,
    "EducationField_Statistics": 0,
    "EducationField_nan": 0,
    "Gender_Female": 0,
    "Gender_Male": 1,
    "Gender_nan": 0,
    "Designation_Executive": 1,
    "Designation_Manager": 0,
    "Designation_Senior Manager": 0,
    "Designation_VP": 0,
    "Designation_nan": 0,
    "MaritalStatus_M": 0,
    "MaritalStatus_Married": 0,
    "MaritalStatus_Single": 1,
    "MaritalStatus_nan": 0,
    "Age": 30,  # Default value
    "CurrentProfile": 5,
    "ESOPs": 0,
    "EmployeeID": 1,
    "HomeToWork": 10,
    "HourlnWeek": 40,
    "Involvement": 3,
    "JobSatisfaction": 3,
    "LastPromotion": 2,
    "MonthlyIncome": 50000,  # Default value
    "NumCompaniesWorked": 2,
    "OverTime": 0,  # Default value for "No"
    "SalaryHikelastYear": 10,
    "WorkExperience": 8,
    "WorkLifeBalance": 3
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
    # Change to specific origin if needed (e.g., ["http://localhost:3000"])
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/predict")
def predict(input_data: ModelInput):
    try:
        # Debug: Log the input
        print("Received data:", input_data)

        # Start with default features
        features = DEFAULT_FEATURES.copy()

        # Update features with provided input
        features.update({
            "Age": input_data.age,
            "MonthlyIncome": input_data.monthly_income,
            "JobSatisfaction": input_data.job_satisfaction,
            "OverTime": 1 if input_data.over_time.lower() == "yes" else 0,
            "WorkLifeBalance": input_data.work_life_balance,
        })

        # Create a DataFrame in the correct feature order
        input_df = pd.DataFrame([features], columns=FEATURE_ORDER)

        # Debug: Log the DataFrame
        print("DataFrame for Prediction:\n", input_df)

        # Make prediction
        prediction = model.predict(input_df)

        # Debug: Log the prediction
        print(f'Prediction = {prediction}')

        # Return the prediction as JSON
        return {"prediction": prediction.tolist()}
    except Exception as e:
        raise HTTPException(
            status_code=400, detail=f"Model prediction error: {e}")


# Run locally on port 4000
if __name__ == "__main__":

    uvicorn.run(app, host="0.0.0.0", port=4000)
