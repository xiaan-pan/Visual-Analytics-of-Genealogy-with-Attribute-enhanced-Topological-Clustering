import numpy as np
import pandas as pd

if __name__ == '__main__':
    # with open("./data/Data.txt", "r") as f:
    #     data = f.readline()
    #     print(data)
    df_news = pd.read_table('./data/test.txt')
    print(df_news[0])