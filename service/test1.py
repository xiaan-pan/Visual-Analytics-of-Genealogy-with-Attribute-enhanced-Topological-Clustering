import json


def build(tree, final):
    stk = [tree]
    head_id = -1
    k = 1
    while len(stk) > 0:
        head = stk.pop(0)
        head_id += 1
        final['features'][str(head_id)] = 0
        if 'children' in head:
            for child in head['children']:
                stk.append(child)
                final['edges'].append([head_id, k])
                k += 1
    




if __name__=='__main__':
    trees = json.load(open('./data/subGraphs_6.json'))
    for tree in trees:
        final = {'edges': [], 'features': {}}
        build(tree, final)
        for edge in final['edges']:
            final['features'][str(edge[0])] += 1
            final['features'][str(edge[1])] += 1
        with open('./subGraphs_6/' + str(tree['id']) + '.json', 'w', encoding='utf8') as file:
            json.dump(final, file)
    pass