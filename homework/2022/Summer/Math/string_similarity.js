function StringSimilarity_used(s, t) {
    var n = s.length, m = t.length, d = [];
    var i, j, s_i, t_j, cost;
    if (n == 0) return m;
    if (m == 0) return n;
    for (i = 0; i <= n; i++) {
        d[i] = [];
        d[i][0] = i;
    }
    for (j = 0; j <= m; j++) {
        d[0][j] = j;
    }
    for (i = 1; i <= n; i++) {
        s_i = s.charAt(i - 1);
        for (j = 1; j <= m; j++) {
            t_j = t.charAt(j - 1);
            if (s_i == t_j) {
                cost = 0;
            } else {
                cost = 1;
            }
            d[i][j] = min_3(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
        }
    }
    return d[n][m];
}

//两个字符串的相似程度，并返回相似度百分比
function StringSimilarity(s, t) {
    var l = s.length > t.length ? s.length : t.length;
    var d = StringSimilarity_used(s, t);
    return (1 - d / l) * 100.0.toFixed(2);
}

function min_3(a, b, c) {
    return a < b ? (a < c ? a : c) : (b < c ? b : c);
}