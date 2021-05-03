import json, sys
from sklearn.cluster import KMeans


if __name__=='__main__':
    cluster_number = int(sys.argv[1])
    # cluster_number = 6
    trees = json.load(open('./data/data_by_tsne.json'))
    transfer = KMeans(n_clusters=cluster_number)
    transfer.fit([tree['coor'] for tree in trees])
    labels = [int(v) for v in transfer.labels_]
    for i, tree in enumerate(trees):
        tree['label'] = labels[i]
    # print(json.dumps(trees))
    with open('./data/data_by_kmeans.json', 'w', encoding='utf8') as file:
        json.dump(trees, file)

