from sklearn.cross_decomposition import PLSRegression


if __name__ == '__main__':
    X = [[0., 0., 1.], [1.,0.,0.], [2.,2.,2.], [2.,5.,4.]]
    Y = [[0.1, -0.2], [0.9, 1.1], [6.2, 5.9], [11.9, 12.3]]
    pls2 = PLSRegression(n_components=2)
    p = pls2.fit_transform(X, Y)
    # Y_pred = pls2.predict(X)
    print(p)
    p0 = p[0].tolist()
    p1 = p[1].tolist()
    print([p0[i] + p1[i] for i in range(len(p0))])
