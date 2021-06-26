import json
from sklearn.manifold import TSNE
from sklearn.cluster import KMeans
from sklearn.metrics import calinski_harabaz_score, davies_bouldin_score



def handle_tsne():
    origin = json.load(open('./data/subGraphs_1.json'))
    attrs = ["PN", "AA", "VN", "TS", "AG"]
    data = [[tree['attr'][attr] for attr in attrs] for tree in origin]
    # print(data)
    # tsne降维
    tsne = TSNE(n_components=2).fit_transform(data).tolist()
    final = [{
        'type': origin[index]['id'],
        'coor': coor,
        'attr': origin[index]['attr']
    } for index, coor in enumerate(tsne)]
    with open('./data/data_by_tsne_0.json', 'w', encoding='utf8') as file:
        json.dump(final, file)

def handle_kmeans():
    origin = json.load(open('./data/data_by_tsne_PN_VN_AA_TS_AG.json'))
    cluster_number = 20
    transfer = KMeans(n_clusters=cluster_number)
    transfer.fit([tree['coor'] for tree in origin])
    labels = [int(v) for v in transfer.labels_]
    for i, tree in enumerate(origin):
        tree['label'] = labels[i]
    # print(json.dumps(trees))
    with open('./data/data_by_kmeans.json', 'w', encoding='utf8') as file:
        json.dump(origin, file)
    print(calinski_harabaz_score([tree['coor'] for tree in origin], labels))
    print(davies_bouldin_score([tree['coor'] for tree in origin], labels))



if __name__ == '__main__':
    # handle_tsne()
    handle_kmeans()