from flask import Flask, jsonify
import pandas as pd

app = Flask(__name__)

# Load the CSV data into a pandas DataFrame
df = pd.read_csv("alt_fuel.fuel_stations.csv")

@app.route("/")
def root():
    """List all available api routes."""
    return (
        f"Available Routes:<br/>"
        f"<a href='/total_stations_by_fuel_type'>/total_stations_by_fuel_type</a><br/>"
        f"<a href='/total_stations_by_status'>/total_stations_by_status</a><br/>"
        f"<a href='/total_stations_by_state'>/total_stations_by_state</a><br/>"
        f"<a href='/total_stations_by_access_code'>/total_stations_by_access_code</a><br/>"
    )


@app.route('/total_stations_by_fuel_type', methods=['GET'])
def total_stations_by_fuel_type():
    fuel_type_counts = df['fuel_type_code'].value_counts().to_dict()
    return jsonify(fuel_type_counts)

@app.route('/total_stations_by_status', methods=['GET'])
def total_stations_by_status():
    status_counts = df['status_code'].value_counts().to_dict()
    return jsonify(status_counts)

@app.route('/total_stations_by_state', methods=['GET'])
def total_stations_by_state():
    state_counts = df['state'].value_counts().to_dict()
    return jsonify(state_counts)

@app.route('/total_stations_by_access_code', methods=['GET'])
def total_stations_by_access_code():
    access_code_counts = df['access_code'].value_counts().to_dict()
    return jsonify(access_code_counts)

if __name__ == '__main__':
    app.run(debug=True)
