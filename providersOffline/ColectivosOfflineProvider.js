/* eslint-disable */
async function retornarListaEventosColectivos(peticion) {
    let docs = await db.TipoEvento.where("descripcionLista").equalsIgnoreCase('eventoColectivo').or('descripcionLista').equals('Brote').toArray();
    docs = docs.map(a => {
        return {
            cod_eve: a.cod_eve,
            nom_eve: a.cod_eve + ' - ' + a.nom_eve,
            tipoColectivo: a.tipoColectivo
        }
    }).sort((a, b) => (parseInt(a.cod_eve) > parseInt(b.cod_eve)) ? 1 : ((parseInt(b.cod_eve) > parseInt(a.cod_eve)) ? -1 : 0));
    return new Response(JSON.stringify(docs), dataHeaders);
}

async function obtenerColectivo(peticion) {
    const requestClone = peticion.clone();
    const params = await requestClone.json().catch((err) => err);
    if (params.idEvento.startsWith("OF")) {
        let tipoEvento = await db.TipoEvento.where('cod_eve').equals(params.cod_eve).first();
        const idEvento = parseInt(params.idEvento.replace('OF', ''));
        let doc = {}
        switch (tipoEvento.tipoColectivo) {
            case "s":
                doc = await db.EventosColectivosSemana.get(idEvento);
                break;
            case "m":
                doc = await db.EventosColectivosMes.get(idEvento);
                break;
            case "b":
                doc = await db.Brotes.get(idEvento);
                break;
            default:
                break;
        }
        if(doc != undefined) doc.Fechahora = formatDate(doc.Fechahora);
        return new Response(JSON.stringify([doc]), dataHeaders);
    } else if (params.idEvento == 0) return new Response(JSON.stringify([]), dataHeaders);
    else return fetch(peticion)
}

async function ObtenerColectivoSemana(peticion) {
}

async function ObtenerColectivoMes(peticion) {
}

async function ObtenerBrote(peticion) {
}
