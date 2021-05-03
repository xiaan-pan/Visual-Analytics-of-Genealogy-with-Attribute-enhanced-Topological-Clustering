import json


if __name__=='__main__':
    trees = json.load(open('./data/subGraphs_1.json'))
    treess = json.load(open('./data/data_by_tsne.json'))
    attrList = {}
    for tree in trees:
        attrList[tree['id']] = tree['attr']
    for tree in treess:
        tree['attr'] = attrList[tree['type']]
    # final = [{
    #     'type': tree['id'],
    #     'attr': tree['attr']
    # } for tree in trees]
    with open('./data/data_by_tsne.json', 'w', encoding='utf8') as file:
        json.dump(treess, file)
