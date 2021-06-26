import json, math, sys

# {
    # innerRadius: 0,
    # outerRadius: 100,
    # startAngle: 0,
    # endAngle: Math.PI / 2
# }

def calAngle(startAngle, endAngle, s1, s2):
    tAngle = (s2 * endAngle + s1 * startAngle) / (s1 + s2)
    return tAngle

def calRadius(innerRadius, outerRadius, s1, s2):
    tRadius = (s1 * outerRadius**2 + s2 * innerRadius**2) / (s1 + s2)
    return tRadius**0.5

def divide_area(final, data, innerRadius, outerRadius, startAngle, endAngle, attr, center):
    if len(data) > 1:
        index = len(data) // 2
        values = [p[attr] for p in data]
        s0 = abs(sum(values[:index]) - sum(values[index:]))
        s1 = abs(sum(values[:index-1]) - sum(values[index-1:]))
        s2 = abs(sum(values[:index+1]) - sum(values[index+1:]))
        smin = min([s0, s1, s2])
        while s0 > smin:
            if smin == s1:
                index -= 1
            else:
                index += 1
            s0 = abs(sum(values[:index]) - sum(values[index:]))
            s1 = abs(sum(values[:index-1]) - sum(values[index-1:]))
            s2 = abs(sum(values[:index+1]) - sum(values[index+1:]))
            smin = min([s0, s1, s2])
        if (endAngle - startAngle) * (innerRadius + outerRadius) / 2 > (outerRadius - innerRadius): # 沿角切
            tAngle = calAngle(startAngle, endAngle, sum(values[:index]), sum(values[index:]))
            divide_area(final, data[:index], innerRadius, outerRadius, startAngle, tAngle, attr, center)
            divide_area(final, data[index:], innerRadius, outerRadius, tAngle, endAngle, attr, center)
        else:
            tRadius = calRadius(innerRadius, outerRadius, sum(values[:index]), sum(values[index:]))
            divide_area(final, data[:index], innerRadius, tRadius, startAngle, endAngle, attr, center)
            divide_area(final, data[index:], tRadius, outerRadius, startAngle, endAngle, attr, center)
    else:
        final.append({
            'type': data[0]['type'],
            attr: data[0][attr],
            'attr': attr,
            'center': center,
            "innerRadius": innerRadius,
            'outerRadius': outerRadius,
            'startAngle': startAngle,
            'endAngle': endAngle
        })
    pass

def setColor(final, data):
    attrs = ['PN', 'AA', 'VN', 'TS', 'AG']
    # Colors = {
    #     # 'PN': ['#9ecae1', '#6baed6', '#0066cc', '#0033cc', '#0000cc'],
    #     'PN': [''],
    #     'AA': ['#9e9ac8', '#807dba', '#6a51a3'],
    #     'VN': ['#ffcccc', '#ff99cc', '#ff66cc'],
    #     'TS': ['#fee391', '#fec44f', '#fe9929'],
    #     'AG': ['#a1d99b', '#74c476', '#41ab5d']
    # }
    Colors = {
        # 'PN': ['#9ecae1', '#6baed6', '#0066cc', '#0033cc', '#0000cc'],
        'PN': ['#fc9272', '#fc9272', '#fc9272', '#fc9272', '#fc9272'],
        'AA': ['#807dba', '#807dba', '#807dba', '#807dba', '#807dba'],
        'VN': ['#ff99cc', '#ff99cc', '#ff99cc', '#ff99cc', '#ff99cc'],
        'TS': ['#fec44f', '#fec44f', '#fec44f', '#fec44f', '#fec44f'],
        'AG': ['#74c476', '#74c476', '#74c476', '#74c476', '#74c476']
    }
    for attr in attrs:
        colors = Colors[attr]
        v1, v2 = min([p[attr] for p in data]), max([p[attr] for p in data])
        number = 5
        d = (v2 - v1) / number
        for p in final:
            if p['attr'] != attr:
                continue
            for i in range(number):
                if v1 + i*d <= p[attr] <= v1 + i*d+d:
                    p['color'] = colors[i]
                    break

# k, b = (0.37815126050420167, 4.621848739495798)

def divide_sunburst(final, tree, innerRadius, outerRadius, startAngle, endAngle, dai, center, k, b):#av = 37
    # colors = [
    #     '#8dd3c7','#fb8072' ,'#80b1d3' ,
    #     '#fdb462' ,'#b3de69' ,'#fccde5' ,'#d9d9d9' ,'#bc80bd' ,
    #     '#ccebc5' ,'#ffed6f'
    # ]
    colors = [
        '#2171b5',
        '#4292c6',
        '#6baed6',
        '#9ecae1',
        '#c6dbef',
        '#d0d1e6',
        '#eff3ff'
    ]

    final.append({
        'type': tree['id'],
        'center': center,
        "innerRadius": innerRadius,
        'outerRadius': outerRadius,
        'startAngle': startAngle,
        'endAngle': endAngle,
        'color': colors[dai]
    })
    if 'children' in tree:
        children_sum_list = []
        for child in tree['children']:
            if 'children' in child:
                children_sum_list.append(len(child['children']))
            else:
                children_sum_list.append(1)
        s = sum(children_sum_list)
        ts = 0
        stepAngle = (endAngle - startAngle) / s
        for i, child in enumerate(tree['children']):
            age = int(child['age']) if 0 < int(child['age']) <= 120 else 37
            new_innerRadius, new_outerRadius = outerRadius, outerRadius + k * age + b
            new_startAngle, new_endAngle = startAngle + ts * stepAngle, startAngle + (ts + children_sum_list[i]) * stepAngle
            ts += children_sum_list[i]
            divide_sunburst(final, child, new_innerRadius, new_outerRadius, new_startAngle, new_endAngle, dai + 1, center, k, b)
    

def handle(origin, attrs, label, outputData, is_all):
    attrs = ['PN', 'AA', 'VN', 'TS', 'AG']
    data = [{
        'type': p['type'],
        'PN': p['attr']['PN'] + 0.0000001,
        'AA': p['attr']['AA'],
        'VN': p['attr']['VN'],
        'TS': p['attr']['TS'],
        'AG': p['attr']['AG'] + 0.0000001
    } for p in origin if p['label'] == label]
    
    # 计算中心点
    xs, ys = [p['coor'][0] for p in origin if p['label'] == label], [p['coor'][1] for p in origin if p['label'] == label]
    xmin, xmax, ymin, ymax = min(xs), max(xs), min(ys), max(ys)
    center = [(xmin + xmax) / 2, (ymax + ymin) / 2]
    # 分中间的圆
    final = []
    stepAngle = math.pi * 2 / 5
    # R = 30 if is_all else 200 
    R = 30 if is_all else 200 

    for i, attr in enumerate(attrs):
        # data.sort(key=lambda d:-d[attr])
        divide_area(final, data[:50], 0, R, stepAngle*i, stepAngle*(i+1), attr, [(xmin + xmax) / 2, (ymax + ymin) / 2] if is_all else [534, 346])
    setColor(final, data[:50])
    # 找到最接近中心点的树
    idd, d = 0, 9999999
    for p in origin:
        if (p['coor'][0] - center[0])**2 + (p['coor'][1] - center[1])**2 < d:
            idd = p['type']
            d = (p['coor'][0] - center[0])**2 + (p['coor'][1] - center[1])**2
    k = 0.3949579831932773 if not is_all else 0.14285714285714285
    b = 2.6050420168067228 if not is_all else 2.857142857142857
    trees = json.load(open('./data/subGraphs_1.json'))
    for tree in trees:
        if int(tree['id']) == idd:#(0.18487394957983194, 2.815126050420168), (0.19747899159663865, 1.3025210084033614), (, )
            age = int(tree['age']) if 0 < int(tree['age']) <= 120 else 37
            divide_sunburst(final, tree, R, R + k * age + b, 0, math.pi * 2, 0, [(xmin + xmax) / 2, (ymax + ymin) / 2] if is_all else [534, 346], k, b)
            break
    for p in final:
        outputData.append(p)
    # outputData.append({
    #     'center': center,
    #     'data': final
    # })


if __name__ == '__main__':
    origin = json.load(open('./data/data_by_kmeans.json'))
    attrs = ['PN', 'AA', 'VN', 'TS', 'AG']
    # cluster_number = int(sys.argv[1])
    cluster_number = max([p['label'] for p in origin]) + 1
    outputData = []
    for i in range(cluster_number):
        if i == int(sys.argv[1]) or int(sys.argv[1]) == 666:
            handle(origin, attrs, i, outputData, int(sys.argv[1]) == 666)
    
    with open('./data/data_by_divide.json', 'w', encoding='utf8') as file:
        json.dump(outputData, file)
