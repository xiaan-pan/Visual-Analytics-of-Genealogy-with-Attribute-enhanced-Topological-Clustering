import json
from sklearn.manifold import TSNE


class TSNEModel():
    def __init__(self, data):
        self.data = data
    
    def build(self):
        Tsne = TSNE(n_components=2, angle=0.2)
        coordinates = Tsne.fit_transform(self.data)
        return coordinates


