async function EventosConLaboratorios() {
    let docs = await db.TipoEvento.where("exa_lab").equals('1').toArray();
    docs = docs.map(r => {
        return {
            cod_eve: r.cod_eve,
            nom_eve: r.cod_eve + " - " + r.nom_eve,
        }
    })
    return new Response(JSON.stringify(docs), dataHeaders);
}
async function retornarAjustesLaboratorios() {
    let docs = await db.ajustesLaboratorios.toArray();
    docs = docs.map(r => {
        return {
            codigoItem: r.codigoItem,
            descripcionLista: r.codigoItem + " - " + r.descripcionLista,
        }
    })
    return new Response(JSON.stringify(docs), dataHeaders);
}
async function UltimosLaboratorios() {
    let docs = await db.AnalisisLaboratorio.toArray();
    return new Response(JSON.stringify(docs), dataHeaders);
}
async function consultarLaboratorio(param) {
    const requestClone = param.clone();
    const params = await requestClone.json().catch((err) => err);
    let docs = await db.AnalisisLaboratorio.toArray();
    params.idLab=params.idLab.slice(2)
    for(let a of docs) {
        if(a._id == params.idLab) {
            return new Response(JSON.stringify(a), dataHeaders);
        }
    }
}

async function ElementosLaboratorio(param) {
    const requestClone = param.clone();
    const params = await requestClone.json().catch((err) => err);
    var elementosLaboratorios = []
    var tabla = params.aliasLista
    var idevent = params.cod_eve
    var existe = false;
    let docs = await db[tabla].toArray();
    let elementosLaboratorio = await db.ElementosLaboratorio.where('cod_eve').equals(idevent).toArray();

    for (let i of elementosLaboratorio) {
        for (let a of docs) {
            if (i.aliasLista == a.aliasLista && i.codigoItem == a.codigoItem) {

                delete a._id
                if (a.codigoItem[0] == "M" && a.codigoItem[1] == "O") {

                    a.codigoItem = a.codigoItem.replace("MO", '')

                } else if (a.codigoItem[0] == "E" && a.codigoItem[1] == "T" && a.codigoItem[2] == "A") {
                    a.codigoItem = a.codigoItem.replace("ETA", '')
                }
                for (let b of elementosLaboratorios) {

                    if (a.aliasLista == b.aliasLista && a.codigoItem == b.codigoItem) {
                        existe = true
                    }
                }
                if (!existe) {
                    elementosLaboratorios.push({codigoItem:a.codigoItem,descripcionLista:a.descripcionLista})
                } else {
                    existe = false
                }
            }
        }
    }
    return new Response(JSON.stringify(elementosLaboratorios), dataHeaders);
}
function removeDuplicates(arrayIn) {
    var arrayOut = [];
    arrayIn.forEach(item => {
        try {
            if (JSON.stringify(arrayOut[arrayOut.length - 1].zone) !== JSON.stringify(item.zone)) {
                arrayOut.push(item);
            }
        } catch (err) {
            arrayOut.push(item);
        }
    })
    return arrayOut;
}