/* eslint-disable */

async function retornarcie345() {
    let docs = await db.cie10.where("codigoItem").anyOf('U071','U072').or("codigoItem").startsWithAnyOf("J0","J1","J2").toArray();
    docs = docs.map(x => {
        return {
            codigoItem: x.codigoItem,
            descripcionLista: x.descripcionLista
        }
    })
    return new Response(JSON.stringify(docs), dataHeaders);
}
