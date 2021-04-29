import json, os
import numpy as np
import networkx as nx
from sklearn.manifold import TSNE
from grakel.utils import graph_from_networkx
from grakel.kernels import WeisfeilerLehman, VertexHistogram
from sklearn.cross_decomposition import PLSRegression


def dataset_reader(path):
    """
    Function to read the graph and features from a json file.
    :param path: The path to the graph json.
    :return graph: The graph object.
    :return features: Features hash table.
    :return name: Name of the graph.
    """
    name = path.strip(".json").split("/")[-1]
    data = json.load(open(path))
    graph = nx.from_edgelist(data['edges'])
    if "features" in data.keys():
        features = data['features']
    else:
        features = nx.degree(graph)
    features = {int(k):v for k,v, in features.items()}
    return graph, features, name

def Kernel_pls(file_dir, attrList):
    files = os.listdir(file_dir) # file_dir 目录下所有的文件名
    G, attrs = [], []
    keys = ['PN', 'AA', 'VN', 'TS', 'AG', 'AW', 'AWS', 'NN']
    for file in files:
        List = list(dataset_reader(file_dir + file))
        G.append([List[0].edges,List[1]])
        attrs.append([attrList[int(List[2])][key] for key in keys])
    wl_kernel = WeisfeilerLehman(n_iter=5, normalize=True, base_graph_kernel=VertexHistogram)
    G_train = wl_kernel.fit_transform(G).tolist()
    # print("graphKernel Training finished")
    # pls2 = PLSRegression(n_components=2)
    # p = pls2.fit_transform(G_train, attrs)
    # p0 = p[0].tolist()
    # p1 = p[1].tolist()
    # data_by_merge = [p0[i] + p1[i] for i in range(len(p0))]
    # tsne降维
    tsne = TSNE(n_components=2).fit_transform(G_train).tolist()
    with open('./coors_structure.json', 'w', encoding='utf8') as file:
        json.dump(tsne, file)


if __name__=='__main__':
    file_dir = './subGraphs_6/'
    trees = json.load(open('./data/subGraphs_6.json'))
    attrList = {}
    for tree in trees:
        attrList[tree['id']] = tree['attr']
    # print(attrList)
    Kernel_pls(file_dir, attrList)
