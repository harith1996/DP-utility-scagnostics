import matplotlib.pyplot as plt
import numpy as np
# generate related variables
from numpy import mean
from numpy import std
from numpy.random import randn
from numpy.random import seed
from sklearn.datasets import make_classification
from sklearn.datasets import make_blobs
from sklearn.datasets import make_gaussian_quantiles


plt.figure()
def gen_clusters(numPoints=4000,n=2):    
    plt.subplot(325)
    plt.title(" blobs", fontsize="small")
    X1, Y1 = make_blobs(n_samples=[500, 1000, 2500], n_features=2, cluster_std=
                    1)
    plt.scatter(X1[:, 0], X1[:, 1], marker="o", c=Y1, s=25, edgecolor="k")


def gen_correlation(sample_size=4000,slope=10, intercept=50):
    
    plt.subplot(326)
    # seed random number generator
    seed(1)
    # prepare data
    data1 = 20 * randn(1000) + 100
    data2 = data1 + (slope * randn(1000) + intercept)
    # summarize
    print('data1: mean=%.3f stdv=%.3f' % (mean(data1), std(data1)))
    print('data2: mean=%.3f stdv=%.3f' % (mean(data2), std(data2)))
    # plot
    plt.scatter(data1, data2)

gen_correlation(slope = 10, intercept = 50)
gen_clusters(n=4)

plt.show()