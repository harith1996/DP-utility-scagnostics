#read data from data_denoised.json
import json
import numpy as np
# Opening JSON file
f = open('./backend/data_denoised.json')

  
# returns JSON object as 
# a dictionary
data = json.load(f)
  
og_data = data['ogData']
denoised_data = data['denoisedData']
private_data_unbinned = data['privateDataUnbinned']


path  = './backend/denoised_data/'

for d in denoised_data:
    #save a csv file for each denoised data
    filename = '_'.join([d['ogDataIndex'], str(d['unbin']), str(d['numBins'])]) + '.csv'
    np.savetxt(path + filename, d['data'], delimiter=',')


for d in private_data_unbinned:
    #save a csv file for each denoised data
    filename = '_'.join([d['ogDataIndex'], d['algorithm'], str(d['epsilon']), str(d['unbin']), str(d['numBins'])]) + '.csv'
    np.savetxt(path + filename, d['data'], delimiter=',')
