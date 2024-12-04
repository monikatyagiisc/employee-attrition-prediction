import React, { useState } from 'react';
import './App.css';

function App() {
    const [employeeData, setEmployeeData] = useState({
        age: '',
        monthly_income: '',
        job_satisfaction: '',
        over_time: '',
        work_life_balance: '',
    });

    const [prediction, setPrediction] = useState(null);
    const [error, setError] = useState(null);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmployeeData({ ...employeeData, [name]: value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const apiUrl = 'http://127.0.0.1:4000/predict';

        try {
            console.log('Payload:', employeeData); // Log the payload

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(employeeData),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            // Extract the first element from the prediction array
            const predictionValue = data.prediction[0];

            // Map prediction result to meaningful text
            const predictionMessage =
                predictionValue === 1 ? 'High Attrition Risk' : 'Low Attrition Risk';

            setPrediction(predictionMessage);
            setError(null); // Clear previous errors
        } catch (err) {
            console.error('Error fetching prediction:', err);
            setPrediction(null);
            setError('Failed to fetch prediction. Please try again.');
        }
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>Employee Attrition Prediction</h1>
                <form onSubmit={handleSubmit} className="Prediction-form">
                    <div className="form-group">
                        <label htmlFor="age">Age:</label>
                        <input
                            type="number"
                            id="age"
                            name="age"
                            value={employeeData.age}
                            onChange={handleChange}
                            required
                            placeholder="Enter age"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="monthly_income">Monthly Income:</label>
                        <input
                            type="number"
                            id="monthly_income"
                            name="monthly_income"
                            value={employeeData.monthly_income}
                            onChange={handleChange}
                            required
                            placeholder="Enter monthly income"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="job_satisfaction">Job Satisfaction (1-4):</label>
                        <input
                            type="number"
                            id="job_satisfaction"
                            name="job_satisfaction"
                            value={employeeData.job_satisfaction}
                            onChange={handleChange}
                            min="1"
                            max="4"
                            required
                            placeholder="Enter job satisfaction"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="over_time">OverTime (Yes/No):</label>
                        <select
                            id="over_time"
                            name="over_time"
                            value={employeeData.over_time}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="work_life_balance">Work-Life Balance (1-4):</label>
                        <input
                            type="number"
                            id="work_life_balance"
                            name="work_life_balance"
                            value={employeeData.work_life_balance}
                            onChange={handleChange}
                            min="1"
                            max="4"
                            required
                            placeholder="Enter work-life balance"
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
            </header>
        </div>
    );
}

export default App;
