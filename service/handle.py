import csv, json
from Tsne import TSNEModel


def read_csv(path: str) -> list:
    with open(path, 'r', encoding='utf8') as file:
        csv_file = csv.reader(file)
        names, data_list = [], []
        for index, p in enumerate(csv_file):
            if index == 0:
                names = p
            else:
                data_list.append(dict(zip(names, p)))
    # print(data_list)
    return data_list

if __name__ == '__main__':
    trees_list = read_csv('./data/nci2.csv')
    # print(trees_list)
    data = [ 
        {
            'type': int(p['type']),
            'data': [float(p['x_' + str(i)]) for i in range(0, 128)]
        }
        for p in trees_list
    ]
    Model = TSNEModel([p['data'] for p in data])
    coordinates = Model.build()
    final = [{
        'type': data[i]['type'],
        'coor': [float(coordinates[i][0]), float(coordinates[i][1])]
    } for i in range(len(data))]
    with open('./data/data_by_tsne.json', 'w', encoding='utf8') as file:
        json.dump(final, file)
    # print(coordinates)
