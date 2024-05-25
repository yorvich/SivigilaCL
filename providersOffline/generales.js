function errorOnRequest() {
    return "EL recurso al que intenta acceder no se encuentra disponible Offline"
}

function formatearDistritos(cod_mun) {
    switch (cod_mun) {
        case '08001':
            cod_mun = '09'
            break;
        case '13001':
            cod_mun = '14'
            break;
        case '47001':
            cod_mun = '48'
            break;
        case '76109':
            cod_mun = '76'
            break;
        case '11001':
            cod_mun = '11'
            break;
        default:
            cod_mun
            break;
    }
    return cod_mun
}

function ordenarMultiple(fields) { // ordena un arreglo de objetos por multiples campos
    return function (a, b) {
        return fields
            .map(function (o) {
                var dir = 1;
                if (o[0] === '-') {
                    dir = -1;
                    o = o.substring(1);
                }
                if (a[o] > b[o]) return dir;
                if (a[o] < b[o]) return -(dir);
                return 0;
            })
            .reduce(function firstNonZeroValue(p, n) {
                return p ? p : n;
            }, 0);
    };
}

function formatDate(date) {
    if (date == '' || date == null) return;
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}