import os
from flask import Flask, jsonify
import csv

app = Flask(__name__)

ROOT_PATH = './backend/'

filenames = {'original': [], 'private': []}
#get names of all original datasets
for dataType in ['original', 'private']:
    directory = ROOT_PATH +  'datasets/' + dataType + '/'  # Specify the directory you want to list files from
    files = [f for f in os.listdir(directory) if os.path.isfile(os.path.join(directory, f))]
    filenames[dataType] = files

unique = {
    'datasetNames': set(),
    'features': set(),
    'algorithms': set(),
    'epsilons': set(),
    'numBins': set()
}

#parse the filenames as <datasetName>_<feature>_<algorithm>_<epsilon>_<numBins>.csv
#return a dictionary with unique values for each feature
def parse_private_filename(filename):
    filename = filename.split('.csv')[0]
    filename = filename.split('_')
    #Push unique values to the lists
    unique['datasetNames'].add(filename[0])
    unique['features'].add(filename[1])
    unique['algorithms'].add(filename[2])
    unique['epsilons'].add(filename[3])
    unique['numBins'].add(filename[4])

for filename in filenames['private']:
    parse_private_filename(filename)

#list available attributes
@app.route('/attributes', methods=['GET'])
def list_attributes():
    return jsonify(list(unique.keys()))

#list unqiue values
@app.route('/attributes/unique/<attribute>', methods=['GET'])
def list_unique(attribute):
    return jsonify(list(unique[attribute]))

#list datasets in a directory
@app.route('/datasets/<dataType>', methods=['GET'])
def list_original_data(dataType):
    return jsonify(filenames[dataType])

#get a specific dataset
@app.route('/datasets/<dataType>/<filename>', methods=['GET'])
def get_data(dataType, filename):
    data = []
    path = ROOT_PATH + 'datasets/' + dataType + '/'  + filename
    with open(path, 'r') as file:
        csv_reader = csv.DictReader(file)
        for row in csv_reader:
            data.append(row)
    return jsonify(data)

if __name__ == '__main__':
    app.run()