import json

def cal_kb(x1, y1, x2, y2):
    k = (y2 - y1) / (x2 - x1)
    b = y1 - k * x1
    return k, b

def for_trees(ages, tree):
    if int(tree['age']) > 0:
        ages.append(int(tree['age']))
    if 'children' in tree:
        for child in tree['children']:
            for_trees(ages, child)

if __name__ == '__main__':
    trees = json.load(open('./data/subGraphs_2.json'))
    ages = []
    for tree in trees:
        for_trees(ages, tree)
    ages_by_select = [age for age in ages if 0 < age <= 120]
    print('av = ', sum(ages_by_select) / len(ages_by_select))
    print('max = ', max(ages_by_select), 'min = ', min(ages_by_select))
    print(cal_kb(min(ages_by_select), 3, max(ages_by_select), 20))
    # print(max([p['attr']['nodes'] for p in trees]))
    # print(min([p['attr']['nodes'] for p in trees]))
    # print(max([p['attr']['depth'] for p in trees]))
    # print(min([p['attr']['depth'] for p in trees]))
    # print(max([p['attr']['nodes'] for p in trees]))
    # print(max([p['attr']['nodes'] for p in trees]))

