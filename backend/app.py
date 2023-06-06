import os
from flask import Flask, jsonify
import csv

app = Flask(__name__)

@app.route('/datasets/original', methods=['GET'])
def list_original_data():
    directory = './datasets/original'  # Specify the directory you want to list files from
    files = [f for f in os.listdir(directory) if os.path.isfile(os.path.join(directory, f))]
    return jsonify(files)

@app.route('/datasets/private', methods=['GET'])
def list_private_data():
    directory = './datasets/private'
    files = [f for f in os.listdir(directory) if os.path.isfile(os.path.join(directory, f))]
    return jsonify(files)

@app.route('/getDataset', methods=['GET'])
def get_data():
    data = []
    with open('data.csv', 'r') as file:
        csv_reader = csv.DictReader(file)
        for row in csv_reader:
            data.append(row)
    return jsonify(data)

if __name__ == '__main__':
    app.run()