import json

def for_tree(tree):
    tree['symbol'] = 'rect' if int(tree['sex']) == 2 else 'circle'
    if 'children' in tree:
        for child in tree['children']:
            for_tree(child)

def handle(tree, c):
    if 'children' in tree:
        c.append(len(tree['children']))
        for child in tree['children']:
            handle(child, c)
    else:
        c.append(0)


if __name__ == '__main__':
    # trees = json.load(open('./data/subGraphs_1.json'))
    # for tree in trees:
    #     c = []
    #     handle(tree, c)
    #     tree['str']['AH'] = sum(c) / len(c)
    # log = {str(tree['id']): tree['str'] for tree in trees}
    # print(max([p['str']['nodes'] for p in trees]))
    # print(min([p['str']['nodes'] for p in trees]))
    # print(max([p['str']['depth'] for p in trees]))
    # print(min([p['str']['depth'] for p in trees]))
    # print(max([p['str']['AH'] for p in trees]))
    # print(min([p['str']['AH'] for p in trees]))
    # print(log)
    # with open('./boxplotData.json', 'w', encoding='utf8') as file:
    #     json.dump(log, file)
    d = [
        {'a': 23},
        {'a': 4232},
        {'a': 1}
    ]
    d.sort(key=lambda d:-d['a'])
    print(d)