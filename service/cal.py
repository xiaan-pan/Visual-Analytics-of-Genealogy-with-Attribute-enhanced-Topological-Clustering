import json, random
import numpy as np
from grakel.utils import graph_from_networkx
from grakel.kernels import WeisfeilerLehman, VertexHistogram
import networkx as nx


def cal(a, b):
    return (b - a) / max([a, b])

def cal_distance(p1, p2):
    return sum([(p1[i] - p2[i])**2 for i in range(len(p1))]) ** 0.5

def cal_sc(clusters, max_label, cluster_neighbor):
    sc = []
    for i, cluster in enumerate(clusters):
        samples = random.sample(cluster, 100 if len(cluster) > 100 else len(cluster))
        a = len([
            sum([cal_distance(p['coor'], sample['coor']) for p in clusters[i]]) / (len(cluster[i]) - 1)
            for sample in samples
        ]) / len(samples)
        b = sum([
            sum([cal_distance(p['coor'], sample['coor']) for p in clusters[cluster_neighbor[i]]]) / len(clusters[cluster_neighbor[i]])
            for sample in samples
        ]) / len(samples)
        sc.append(cal(a, b))
    return sum(sc) / len(sc)


def cal_sca(clusters, max_label, cluster_neighbor):
    attrs = ["PN", "AA", "VN", "TS", "AG"]
    sca = []
    for i, cluster in enumerate(clusters):
        samples = random.sample(cluster, 100 if len(cluster) > 100 else len(cluster))
        a = len([
            sum([cal_distance([p['attr'][attr] for attr in attrs], [sample['attr'][attr] for attr in attrs]) for p in clusters[i]]) / (len(cluster[i]) - 1)
            for sample in samples
        ]) / len(samples)
        b = sum([
            sum([cal_distance([p['attr'][attr] for attr in attrs], [sample['attr'][attr] for attr in attrs]) for p in clusters[cluster_neighbor[i]]]) / len(clusters[cluster_neighbor[i]])
            for sample in samples
        ]) / len(samples)
        sca.append(cal(a, b))
    return sum(sca) / len(sca)

def cal_variance(clusters, max_label, cluster_neighbor):
    attrs = ["PN", "AA", "VN", "TS", "AG"]
    variance = sum([
        sum([
            np.std([p['attr'][attr] for p in cluster], ddof = 1)
            for attr in attrs
        ]) / len(attrs)
        for cluster in clusters
    ]) / len(clusters)
    return variance

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

def Kernel_pls(file_list):
    # files = os.listdir(file_dir) # file_dir 目录下所有的文件名
    G = []
    for file in file_list:
        List = list(dataset_reader('./subGraphs_1/' + str(file) + '.json'))
        G.append([List[0].edges,List[1]])
    wl_kernel = WeisfeilerLehman(n_iter=5, normalize=True, base_graph_kernel=VertexHistogram)
    G_train = wl_kernel.fit_transform(G).tolist()
    # print("graphKernel Training finished")
    l = len(G_train)
    values = [G_train[i][j] for i in range(l) for j in range(i+1)]
    return sum(values) / len(values)
    # return max(values)

def cal_s(clusters):
    a = sum([
        Kernel_pls([p['type'] for p in cluster])
        for cluster in clusters
    ]) / len(clusters)
    return a

if __name__=='__main__':
    origin = json.load(open('./data/data_by_kmeans.json'))
    max_label = max([p['label'] for p in origin]) + 1
    clusters = [[] for i in range(max_label)]
    for p in origin:
        clusters[p['label']].append(p)
    cluster_neighbor = {}
    clusters_center = [[
        (max([p['coor'][0] for p in cluster]) + min([p['coor'][0] for p in cluster])) / 2,
        (max([p['coor'][1] for p in cluster]) + min([p['coor'][1] for p in cluster])) / 2,
    ] for cluster in clusters]
    for i, p in enumerate(clusters_center):
        m = 9999999989
        for j, t in enumerate(clusters_center):
            if i != j:
                if cal_distance(p, t) < m:
                    cluster_neighbor[i] = j
                    m = cal_distance(p, t)
    print('max_label = ', max_label)
    print('sc = ', cal_sc(clusters, max_label, cluster_neighbor))
    # print('sca = ', cal_sca(clusters, max_label, cluster_neighbor))
    # print('variance = ', cal_variance(clusters, max_label, cluster_neighbor))
    print('s = ', cal_s(clusters))
    


