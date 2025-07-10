import pandas as pd
import joblib
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

try:
    pipeline = joblib.load('salary_pipeline.pkl')
except FileNotFoundError:
    print("Error: 'salary_pipeline.pkl' not found.")
    pipeline = None

@app.route('/predict', methods=['POST'])
def predict():
    if pipeline is None:
        return jsonify({"error": "Model not loaded. Please check server logs."}), 500

    data = request.get_json()

    if not data or 'job_title' not in data or 'work_location' not in data:
        return jsonify({"error": "Invalid input: 'job_title' and 'work_location' are required."}), 400

    try:
        input_df = pd.DataFrame({
            "job_title": [data['job_title']],
            "work_location": [data['work_location']]
        })

        prediction = pipeline.predict(input_df)

        predicted_salary = prediction[0]

        return jsonify({'predicted_salary': predicted_salary})

    except Exception as e:
        return jsonify({"error": f"An error occurred during prediction: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)