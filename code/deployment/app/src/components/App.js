import React, { useState } from "react";
import "./App.css";

function App() {
    const [employeeData, setEmployeeData] = useState({
        TravelProfile: "",
        Department: "",
        EducationField: "",
        Gender: "",
        Designation: "",
        MaritalStatus: "",
        Age: "",
        CurrentProfile: "",
        ESOPs: "",
        EmployeeID: "",
        HomeToWork: "",
        HourlnWeek: "",
        Involvement: "",
        JobSatisfaction: "",
        LastPromotion: "",
        MonthlyIncome: "",
        NumCompaniesWorked: "",
        OverTime: "",
        SalaryHikelastYear: "",
        WorkExperience: "",
        WorkLifeBalance: "",
    });

    const [prediction, setPrediction] = useState(null);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmployeeData({ ...employeeData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const apiUrl = "http://127.0.0.1:4000/predict";

        try {
            console.log("Payload:", employeeData);

            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(employeeData),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            const predictionValue = data.prediction[0];
            const predictionMessage =
                predictionValue === 1 ? "High Attrition Risk" : "Low Attrition Risk";

            setPrediction(predictionMessage);
            setError(null);
        } catch (err) {
            console.error("Error fetching prediction:", err);
            setPrediction(null);
            setError("Failed to fetch prediction. Please try again.");
        }
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>Employee Attrition Prediction</h1>
            </header>
            <form onSubmit={handleSubmit} className="Prediction-form">
                {/* All Fields */}
                <div className="form-group">
                    <label htmlFor="TravelProfile">Travel Profile:</label>
                    <select
                        id="TravelProfile"
                        name="TravelProfile"
                        value={employeeData.TravelProfile}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select</option>
                        <option value="Rarely">Rarely</option>
                        <option value="Yes">Yes</option>
                        <option value="nan">nan</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="Department">Department:</label>
                    <select
                        id="Department"
                        name="Department"
                        value={employeeData.Department}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Sales">Sales</option>
                        <option value="nan">nan</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="EducationField">Education Field:</label>
                    <select
                        id="EducationField"
                        name="EducationField"
                        value={employeeData.EducationField}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select</option>
                        <option value="Engineer">Engineer</option>
                        <option value="MBA">MBA</option>
                        <option value="Marketing Diploma">Marketing Diploma</option>
                        <option value="Other">Other</option>
                        <option value="Statistics">Statistics</option>
                        <option value="nan">nan</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="Gender">Gender:</label>
                    <select
                        id="Gender"
                        name="Gender"
                        value={employeeData.Gender}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select</option>
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="nan">nan</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="Designation">Designation:</label>
                    <select
                        id="Designation"
                        name="Designation"
                        value={employeeData.Designation}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select</option>
                        <option value="Executive">Executive</option>
                        <option value="Manager">Manager</option>
                        <option value="Senior Manager">Senior Manager</option>
                        <option value="VP">VP</option>
                        <option value="nan">nan</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="MaritalStatus">Marital Status:</label>
                    <select
                        id="MaritalStatus"
                        name="MaritalStatus"
                        value={employeeData.MaritalStatus}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select</option>
                        <option value="M">M</option>
                        <option value="Married">Married</option>
                        <option value="Single">Single</option>
                        <option value="nan">nan</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="Age">Age:</label>
                    <input
                        type="number"
                        id="Age"
                        name="Age"
                        value={employeeData.Age}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="CurrentProfile">Current Profile:</label>
                    <input
                        type="number"
                        id="CurrentProfile"
                        name="CurrentProfile"
                        value={employeeData.CurrentProfile}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="ESOPs">ESOPs:</label>
                    <input
                        type="number"
                        id="ESOPs"
                        name="ESOPs"
                        value={employeeData.ESOPs}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="EmployeeID">Employee ID:</label>
                    <input
                        type="number"
                        id="EmployeeID"
                        name="EmployeeID"
                        value={employeeData.EmployeeID}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="HomeToWork">Home to Work Distance:</label>
                    <input
                        type="number"
                        id="HomeToWork"
                        name="HomeToWork"
                        value={employeeData.HomeToWork}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="HourlnWeek">Hours in Week:</label>
                    <input
                        type="number"
                        id="HourlnWeek"
                        name="HourlnWeek"
                        value={employeeData.HourlnWeek}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="Involvement">Involvement:</label>
                    <input
                        type="number"
                        id="Involvement"
                        name="Involvement"
                        value={employeeData.Involvement}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="OverTime">OverTime:</label>
                    <select
                        id="OverTime"
                        name="OverTime"
                        value={employeeData.OverTime}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="SalaryHikelastYear">Salary Hike Last Year:</label>
                    <input
                        type="number"
                        id="SalaryHikelastYear"
                        name="SalaryHikelastYear"
                        value={employeeData.SalaryHikelastYear}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="WorkExperience">Work Experience:</label>
                    <input
                        type="number"
                        id="WorkExperience"
                        name="WorkExperience"
                        value={employeeData.WorkExperience}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="WorkLifeBalance">Work Life Balance:</label>
                    <input
                        type="number"
                        id="WorkLifeBalance"
                        name="WorkLifeBalance"
                        value={employeeData.WorkLifeBalance}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="JobSatisfaction">Job Satisfaction:</label>
                    <input
                        type="number"
                        id="JobSatisfaction"
                        name="JobSatisfaction"
                        value={employeeData.JobSatisfaction}
                        onChange={handleChange}
                        placeholder="Enter Job Satisfaction score (1-5)"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="LastPromotion">Years Since Last Promotion:</label>
                    <input
                        type="number"
                        id="LastPromotion"
                        name="LastPromotion"
                        value={employeeData.LastPromotion}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="MonthlyIncome">Monthly Income:</label>
                    <input
                        type="number"
                        id="MonthlyIncome"
                        name="MonthlyIncome"
                        value={employeeData.MonthlyIncome}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="NumCompaniesWorked">Number of Companies Worked:</label>
                    <input
                        type="number"
                        id="NumCompaniesWorked"
                        name="NumCompaniesWorked"
                        value={employeeData.NumCompaniesWorked}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit" className="submit-button">
                    Predict
                </button>
            </form>

            {prediction && (
                <div className="Prediction">
                    <h2>Prediction Result:</h2>
                    <p>{prediction}</p>
                </div>
            )}

            {error && (
                <div className="Error">
                    <h2>Error:</h2>
                    <p>{error}</p>
                </div>
            )}
        </div>
    );
}

export default App;
