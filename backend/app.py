import os
from flask import Flask, jsonify
from flask_cors import CORS, cross_origin
import csv

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

ROOT_PATH = './backend/'

filenames = {'original': [], 'private': []}
#get names of all original datasets
for dataType in ['original', 'private']:
    directory = ROOT_PATH +  'datasets/' + dataType + '/'  # Specify the directory you want to list files from
    files = [f for f in os.listdir(directory) if os.path.isfile(os.path.join(directory, f))]
    filenames[dataType] = files

unique = {
    'datasetNames': set(),
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
    unique['algorithms'].add(filename[1])
    unique['epsilons'].add(filename[2])
    unique['numBins'].add(filename[3])

for filename in filenames['private']:
    parse_private_filename(filename)

#convert the sets to lists
for key in unique:
    unique[key] = list(unique[key])

#list available attributes
@app.route('/attributes', methods=['GET'])
@cross_origin()
def list_attributes():
    return jsonify(list(unique.keys()))

#list unique values of all attributes
@app.route('/filterParams', methods=['GET'])
@cross_origin()
def filter_params():
    return jsonify(unique)

#list unqiue values
@app.route('/attributes/<attribute>/unique', methods=['GET'])
@cross_origin()
def list_unique(attribute):
    return jsonify(list(unique[attribute]))

#list datasets in a directory
@app.route('/datasets/<dataType>', methods=['GET'])
@cross_origin()
def list_original_data(dataType):
    return jsonify(filenames[dataType])

#get a specific dataset
@app.route('/datasets/<dataType>/<filename>', methods=['GET'])
@cross_origin()
def get_data(dataType, filename):
    data = []
    path = ROOT_PATH + 'datasets/' + dataType + '/'  + filename
    with open(path, 'r') as file:
        if(dataType == 'private'):
            csv_reader = csv.reader(file)
        else:
            csv_reader = csv.DictReader(file)
        for row in csv_reader:
            data.append(row)
    return jsonify(data)

if __name__ == '__main__':
    app.run()