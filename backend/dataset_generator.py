import matplotlib.pyplot as plt
import numpy as np


def gen_clusters(n=2):    
    center1 = (30, 60)
    center2 = (70, 50)
    distance = 20
    x1 = np.random.uniform(center1[0], center1[0] + distance, size=(100,))
    y1 = np.random.normal(center1[1], distance, size=(100,)) 

    x2 = np.random.uniform(center2[0], center2[0] + distance, size=(100,))
    y2 = np.random.normal(center2[1], distance, size=(100,)) 

    plt.scatter(x1, y1)
    plt.scatter(x2, y2)
    plt.show()