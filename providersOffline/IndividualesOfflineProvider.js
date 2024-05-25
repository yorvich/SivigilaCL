/* eslint-disable */
async function retornarOrdenCamposBDUA() {
    let docs = await db.OrdenCamposBDUA.toArray();
    docs.sort((a, b) => (parseInt(a._id) > parseInt(b._id)) ? 1 : ((parseInt(b._id) > parseInt(a._id)) ? -1 : 0))
    return new Response(JSON.stringify(docs), dataHeaders);
}

async function retornarListaEventos() {// version de dexie
    let docs = await db.TipoEvento.where("descripcionLista").equals("eventoBasico").toArray();
    docs = docs.map(r => {
        return {
            cod_eve: r.cod_eve,
            nom_eve: r.cod_eve + ' - ' + r.nom_eve
        }
    }).sort((a, b) => (parseInt(a.cod_eve) > parseInt(b.cod_eve)) ? 1 : ((parseInt(b.cod_eve) > parseInt(a.cod_eve)) ? -1 : 0));
    return new Response(JSON.stringify(docs), dataHeaders);
}

async function retornarTipoEvento(peticion) {
    const requestClone = peticion.clone();
    const params = await requestClone.json().catch((err) => err);
    let docs = await db.TipoEvento.where("cod_eve").equals(params.cod_eve).toArray()
    return new Response(JSON.stringify(docs), dataHeaders);
}

async function retornarEstructuraGuardadoBasicos(peticion) {
    const requestClone = peticion.clone();
    const params = await requestClone.json().catch((err) => err);
    let docs;
    if (params.cod_eve == 'Brotes') {
        docs = await db.TablaTipoEvento.where("cod_eve").equals(params.cod_eve).and(item => item.cl_tipo == null || !((item.cl_tipo ?? '').startsWith('CU'))).sortBy('cl_ordenFormulario');
        docs = docs.map(r => {
            r.nombre = r.nombre.toLowerCase();
            return r;
        })
    } else {
        docs = await db.TablaTipoEvento.where("cod_eve").equals(params.cod_eve).and(item => item.vigenciaDesde != null && item.cl_tipo != null).sortBy('cl_ordenFormulario');
        docs = docs.map(r => {
            r.nombre = !isNaN(params.cod_eve) ? r.nombre.toLowerCase() : r.nombre;
            return r;
        });
    }
    return new Response(JSON.stringify(docs), dataHeaders);
}

async function retornarDatosBasicos(peticion) {
    const requestClone = peticion.clone();
    const params = await requestClone.json().catch((err) => err);
    const cod_eve = params.cod_eve.split('|')[0];
    let elementosUnicos = await db.ElementosUnicosFormularios.where("cod_eve").equals(cod_eve).toArray();
    let docs = await db.TablaTipoEvento.where("cod_eve").equals("Eventos").and(item => item.cl_inactivo != true).sortBy('cl_ordenFormulario');
    docs = docs.map(x => {
        let y = {};
        if (elementosUnicos.length > 0) {
            y = elementosUnicos.find(element => element.idTablaTipoEvento == x._id) ?? {};
        }
        return {
            orden: x.cl_ordenFormulario,
            campo: x.nombre,
            tipo: x.cl_tipo,
            label: x.cl_descripcion,
            grupo: y.grupoFormulario || x.cl_grupo,
            tooltip: x.cl_tooltip ?? '',
            mask: x.cl_mask ?? '',
            fillmask: x.fillmask ?? -1,
            max: x.cl_maxlength ?? '',
            cl_lutValor: x.cl_lutValor,
            cl_lutDesc: x.cl_lutDesc,
            clase: x.cl_class ?? 'col-md-2',
            opciones: y.opciones || x.cl_opciones,
            tabla: x.cl_tabla,
            cl_fila: x.cl_fila,
            valorDefecto: x.cl_valorPorDefecto,
            valoresAdmitidos: x.cl_valoresAdmitidos,
            Deshabilitar: 0
        }
    })
    return new Response(JSON.stringify(docs), dataHeaders);
}

async function retornarValidaciones(peticion) {
    const requestClone = peticion.clone();
    const params = await requestClone.json().catch((err) => err);
    const cod_eve = params.cod_eve.split('|')[0];
    const cod_eveBasico = params.cod_eve.split('|')[1] ?? '';
    let te = await db.TipoEvento.where("cod_eve").equals(cod_eveBasico).first();
    let fecDet = (te != undefined) ? te.val_sem : '[FecDet]';
    fecDet = (cod_eve == 'Eventos') ? fecDet.charAt(0).toUpperCase() + fecDet.slice(1).toLowerCase() : fecDet.toLowerCase();
    let docs = await db.Validaciones.where("cod_eve").equals(cod_eve).toArray();
    docs = docs.map(r => {
        r.campo = r.campo == '[FecDet]' ? fecDet : r.campo;
        r.parametrosCrudos = (r.parametrosCrudos != null && r.parametrosCrudos.includes('[FecDet]')) ? r.parametrosCrudos.replace('[FecDet]', fecDet) : r.parametrosCrudos;
        return r;
    })
    return new Response(JSON.stringify(docs), dataHeaders);
}

async function retornarFuncionalidades(peticion) {
    const requestClone = peticion.clone();
    const params = await requestClone.json().catch((err) => err);
    const cod_eve = params.cod_eve.split('|')[0];
    const cod_eveBasico = params.cod_eve.split('|')[1] ?? '';
    let te = await db.TipoEvento.where("cod_eve").equals(cod_eveBasico).first();
    let fecDet = (te != undefined) ? te.val_sem : '[FecDet]';
    fecDet = (cod_eve == 'Eventos') ? fecDet.charAt(0).toUpperCase() + fecDet.slice(1).toLowerCase() : fecDet.toLowerCase();
    let docs = await db.Funcionalidades.where("cod_eve").equals(cod_eve).toArray();
    docs = docs.map(r => {
        r.campo = r.campo == '[FecDet]' ? fecDet : r.campo;
        r.parametrosCrudos = (r.parametrosCrudos != null && r.parametrosCrudos.includes('[FecDet]')) ? r.parametrosCrudos.replace('[FecDet]', fecDet) : r.parametrosCrudos;
        return r;
    })
    return new Response(JSON.stringify(docs), dataHeaders);
}

async function retornarDatosComplementarios(peticion) {
    const requestClone = peticion.clone();
    let params = await requestClone.json().catch((err) => err);
    let elementosUnicos = await db.ElementosUnicosFormularios.where("cod_eve").equals(params.cod_eve).toArray();
    const tipoEvento = !isNaN(params.cod_eve) ? await db.TipoEvento.where("cod_eve").equals(params.cod_eve).first() : {};
    const camposAOcultar = tipoEvento.camposOcultos ? tipoEvento.camposOcultos.toUpperCase() : '';
    let docs = await db.TablaTipoEvento.where("cod_eve").equals(params.cod_eve).and(x => x.cl_ordenGrupo != null && x.cl_ordenFormulario != null && x.cl_inactivo != true).toArray(); //(pend) falta where de campos a ocultar   //(pend) probar que si filtra los inactivos
    docs = docs.sort(ordenarMultiple(['cl_ordenGrupo', 'cl_ordenFormulario']));
    docs = docs.map(x => {
        let y = {};
        if (elementosUnicos.length > 0) {
            y = elementosUnicos.find(element => element.idTablaTipoEvento == x._id) ?? {};
        }
        return {
            orden: x.cl_ordenFormulario,
            campo: x.nombre?.toLowerCase(),
            tipo: x.cl_tipo,
            label: x.cl_descripcion,
            grupo: y.grupoFormulario || x.cl_grupo,
            tooltip: x.cl_tooltip ?? '',
            mask: x.cl_mask ?? '',
            fillmask: x.cl_fillMask ?? -1,
            max: x.cl_maxlength ?? '',
            cl_lutValor: x.cl_lutValor,
            cl_lutDesc: x.cl_lutDesc,
            clase: x.cl_class ?? 'col-md-2',
            opciones: y.opciones || x.cl_opciones,
            tabla: x.cl_tabla,
            cl_fila: x.cl_fila,
            valoresAdmitidos: x.cl_valoresAdmitidos,
            descripcionLook: x.cl_descripcionComoCampo,
            deshabilitarProp: x.inactivo,
            labelImpresion: x.labelImpresion,
            ocultarCampo: camposAOcultar.includes(',' + x.nombre?.toUpperCase() + ',') ? true : false, // (pend) probar que si oculta campos
            Deshabilitar: 0
        }
    })
    return new Response(JSON.stringify(docs), dataHeaders);
}

async function retornarValidacionesAfectantes(peticion) {
    const requestClone = peticion.clone();
    const params = await requestClone.json().catch((err) => err);
    const cod_eve = params.cod_eve.split('|')[0];
    const cod_eveBasico = params.cod_eve.split('|')[1] ?? '';
    let te = await db.TipoEvento.where("cod_eve").equals(cod_eveBasico).first();
    let fecDet = (te != undefined) ? te.val_sem : '[FecDet]';
    fecDet = (cod_eve == 'Eventos') ? fecDet.charAt(0).toUpperCase() + fecDet.slice(1).toLowerCase() : fecDet.toLowerCase();
    let docs = await db.ValidacionesAfectantes.where("cod_eve").equals(cod_eve).toArray()
    docs = docs.map(r => {
        return {
            parametro: r.parametro == '[FecDet]' ? fecDet : r.parametro,
            clave: r.clave == '[FecDet]' ? fecDet : r.clave,
            funcion: r.funcion,
        }
    })
    return new Response(JSON.stringify(docs), dataHeaders);
}

async function retornarFuncionalidadesAfectantes(peticion) {
    const requestClone = peticion.clone();
    const params = await requestClone.json().catch((err) => err);
    const cod_eve = params.cod_eve.split('|')[0];
    const cod_eveBasico = params.cod_eve.split('|')[1] ?? '';
    let te = await db.TipoEvento.where("cod_eve").equals(cod_eveBasico).first();
    let fecDet = (te != undefined) ? te.val_sem : '[FecDet]';
    fecDet = (cod_eve == 'Eventos') ? fecDet.charAt(0).toUpperCase() + fecDet.slice(1).toLowerCase() : fecDet.toLowerCase();
    let docs = await db.FuncionalidadesAfectantes.where("cod_eve").equals(cod_eve).toArray()
    docs = docs.map(r => {
        return {
            parametro: r.parametro == '[FecDet]' ? fecDet : r.parametro,
            clave: r.clave == '[FecDet]' ? fecDet : r.clave,
            funcion: r.funcion,
            evento: r.evento
        }
    })
    return new Response(JSON.stringify(docs), dataHeaders);
}

async function retornarPaises() {
    let docs = await db.Paises.toArray();
    docs = docs.map(r => { return { Cod_pais: r._id, Nom_pais: r.Nom_Pais + ' (' + r.Cod_Pais_3 + ')' } })
    return new Response(JSON.stringify(docs), dataHeaders);
}

async function retornarDepartamentos(peticion) {
    const requestClone = peticion.clone();
    const params = await requestClone.json().catch((err) => err);
    const cond2 = (['170', '076', '218', '591', '604', '862'].includes(params.Param1) ? '-1' : '999');
    let docs;
    if (params.Param1 == '') docs = await db.Departamentos.toArray();
    else docs = await db.Departamentos.where("CodNumPais").equals(params.Param1).or("CodNumPais").equals(cond2).toArray();
    docs = docs.map(r => { return { Cod_dpto: r._id, Nom_dpto: r.Nom_dpto } })
    return new Response(JSON.stringify(docs), dataHeaders);
}

async function retornarMunicipios(peticion) {
    try {
        const requestClone = peticion.clone();
        const params = await requestClone.json().catch((err) => err);
        params.Param1 = (params.Param1 == '11001') ? '11' : params.Param1; //Si el codigo del departamento es 11001 (BOGOTA) lo deja como 11 para que traiga todas las localidades de bogota
        let docs;
        if (params.Param1 != undefined && params.Param2 != undefined) docs = await db.Municipios.where("[Cod_pais+Cod_Depto]").equals([params.Param2, params.Param1]).toArray(); //
        if (params.Param1 != undefined && params.Param2 == undefined) docs = await db.Municipios.where("Cod_Depto").equals(params.Param1).toArray(); //
        if (params.Param2 != undefined && params.Param1 == undefined) docs = await db.Municipios.where("Cod_pais").equals(params.Param2).toArray(); //
        if (params.Param2 == undefined && params.Param1 == undefined) docs = await db.Municipios.toArray(); //
        docs = docs.map(r => { return { Cod_mun: r.Cod_mun, Nom_mun: r.Nom_mun } });
        return new Response(JSON.stringify(docs), dataHeaders);
    } catch (err) {
        console.log(err);
    }
}

async function retornaSectores(peticion) {
    //(info) Param1 = departamento, Param2 = municipio, Param3 = Area
    const requestClone = peticion.clone();
    const params = await requestClone.json().catch((err) => err);
    params.Param1 = formatearDistritos(params.Param1);
    //Se setea en 01 y 000 para que muestre el registro 999 desconocido
    if ((params.Param1 == '11' && params.Param2 != '11001') || params.Param1 == '76' || params.Param1 == '01') {
        params.Param1 = '01'
        params.Param2 = '000'
    }
    let docs;
    if (params.Param3 == '1') //Si el area es igual a 1 (Cabecera municipal) se filtra con por los codigos de mun y dpto
    {
        const codDpto = (params.Param1 == '') ? null : params.Param1;
        const codMun = (params.Param2 == '') ? null : params.Param2.substr(params.Param2.length - 3);
        docs = await db.sectores.toArray();
        if (codDpto != null) docs = await db.sectores.where('codigoItem1').equals(codDpto).toArray();
        if (codDpto != null && codMun != null) docs = await db.sectores.where('codigoItem1').equals(codDpto).and(item => item.codigoItem2 == codMun).toArray();
    } else {
        docs = await db.sectores.toArray();
    }
    docs = docs.map(r => { return { codigoItem: r.codigoItem, descripcionLista: r.descripcionLista } })
    docs = [...new Map(docs.map(v => [JSON.stringify(v), v])).values()]
    return new Response(JSON.stringify(docs), dataHeaders);
}

async function retornaVeredas(peticion) {
    //(info) Param1 = departamento, Param2 = municipio, Param3 = Area
    const requestClone = peticion.clone();
    const params = await requestClone.json().catch((err) => err);
    params.Param1 = formatearDistritos(params.Param1);
    //Se setea en 01 y 000 para que muestre el registro 999 desconocido
    if (params.Param1 == '76109') {
        params.Param1 = '01';
        params.Param2 = '';
    } else if (params.Param1 == '11' && params.Param2 != '11001') {
        params.Param1 = '';
        params.Param2 = '';
    }
    let docs;
    if (params.Param3 == '3') //Si el area es igual a 3 (Rural disperso) se filtra con por los codigos de mun y dpto
    {
        const codDpto = (params.Param1 == '') ? null : params.Param1;
        const codMun = (params.Param2 == '') ? null : params.Param2.substr(params.Param2.length - 3);
        const tipoFiltro = (codDpto == '01') ? 1 : (codDpto != null && codMun != null) ? 2 : (codDpto != null) ? 3 : 4;
        switch (tipoFiltro) {
            case 1:  //Cuando el departamento es Bogota        
                docs = await db.veredas.where('codigoItem3').equals('VERDADERO').and(item => item.codigoItem1 == codDpto && item.codigoItem == codDpto + codMun + '999').toArray();
                break;
            case 2:  //Cuando codDpto y codMun son diferentes de null  
                docs = await db.veredas.where('codigoItem3').equals('VERDADERO').and(item => item.codigoItem1 == codDpto && item.codigoItem2 == codMun).toArray();
                break;
            case 3:  //Cuando solo codDpto es diferente de null       
                docs = await db.veredas.where('codigoItem3').equals('VERDADERO').and(item => item.codigoItem1 == codDpto).toArray();
                break;
            default: //Si no se cumple ningun caso
                docs = await db.veredas.where('codigoItem3').equals('VERDADERO').toArray();
                break;
        }
    } else {
        docs = await db.veredas.where('codigoItem3').equals('VERDADERO').toArray();
    }
    docs = docs.map(r => { return { codigoItem: r.codigoItem, descripcionLista: r.descripcionLista } })
    docs = [...new Map(docs.map(v => [JSON.stringify(v), v])).values()]
    return new Response(JSON.stringify(docs), dataHeaders);
}

async function retornarUpgds(peticion) { // version de dexie
    let docs = await db.upgds.toArray();
    docs = docs.filter(doc => doc.COD_PRE.length == 10).map(r => {
        return {
            Codigo: r.COD_PRE + r.COD_SUB,
            RAZ_SOC: r.RAZ_SOC,
        }
    })
    return new Response(JSON.stringify(docs), dataHeaders);
}


async function retornarAseguradoras(peticion) {
    const requestClone = peticion.clone();
    const params = await requestClone.json().catch((err) => err);
    let tipss = params.Param1
    let docs;
    if (tipss == 'E') {
        tipss = '';
    }
    if (tipss == 'N' || tipss == 'I') {
        docs = [{
            Cod_ase: '999999',
            Raz_soc: 'NO APLICA'
        }]
    } else {
        if (tipss === null || tipss == '' || tipss == undefined) docs = await db.Aseguradoras.toArray();
        else docs = await db.Aseguradoras.where('regimen').equals(tipss).toArray();
        docs = docs.map(a => {
            return {
                Cod_ase: a.Cod_ase,
                Raz_soc: a.Raz_soc
            }
        })
    }
    return new Response(JSON.stringify(docs), dataHeaders);
}

async function retornarOcupacionesPorEdad(peticion) {
    const requestClone = peticion.clone();
    const params = await requestClone.json().catch((err) => err);
    let edad = params.Param1;
    let uMedida = params.Param2;
    let docs;
    if ((edad > 17 && uMedida < 2) || (uMedida == 0 || uMedida === null)) {
        docs = await db.Ocupaciones.where('activo').equals(1).toArray();
    } else if (edad >= 4 && edad <= 17 && uMedida == 1) {
        docs = await db.Ocupaciones.where('activo').equals(1).and(item => item.Menores == true).toArray();
    } else if ((edad < 4 && uMedida < 2) || (uMedida >= 2)) {
        docs = await db.Ocupaciones.where('activo').equals(1).and(item => item.Cod_ocu == '99999.07').toArray();
    } else {
        docs = await db.Ocupaciones.where('activo').equals(1).toArray();
    }
    docs = docs.map(o => {
        return {
            Codigo: o.Cod_ocu.toString(),
            Ocupacion: o.nombre_vigente_ocupacion
        }
    })
    return new Response(JSON.stringify(docs), dataHeaders);
}

async function retornaClasificacionCaso(peticion) {
    const requestClone = peticion.clone();
    const params = await requestClone.json().catch((err) => err);
    let docs = [];
    if (params.Param1 != undefined) {
        const ev = await db.TipoEvento.where("cod_eve").equals(params.Param1).first();
        let cla_per = ev.cla_per.split('');
        docs = await db.clasifi_cas.where("codigoItem").anyOf(cla_per).toArray();
        docs = docs.map(o => {
            return {
                codigoItem: o.codigoItem,
                descripcionLista: o.descripcionLista
            }
        })
    }
    return new Response(JSON.stringify(docs), dataHeaders);
}

async function retornarAjustes(peticion) {
    const requestClone = peticion.clone();
    const params = await requestClone.json().catch((err) => err);
    let docs = [];
    if (params.Param1 != undefined) {
        const ev = await db.TipoEvento.where("cod_eve").equals(params.Param1).first();
        let cla_per = (ev.cla_per + '07D6').split('');
        docs = await db.ajustes.where("codigoItem").anyOf(cla_per).toArray();
        docs = docs.map(o => {
            return {
                codigoItem: o.codigoItem,
                descripcionLista: o.descripcionLista,
                disable: (o.codigoItem == '0')
            }
        })
    }
    return new Response(JSON.stringify(docs), dataHeaders);
}

async function retornarAjustesColectivos(peticion) {
    const requestClone = peticion.clone();
    const params = await requestClone.json().catch((err) => err);
    let docs = [];
    if (params.Param1 != undefined) {
        const ev = await db.TipoEvento.where("cod_eve").equals(params.Param1).first();
        let cla_per = (ev.cla_per + '07D6').split('');
        docs = await db.ajustesColectivos.where("codigoItem").anyOf(cla_per).toArray();
        docs = docs.map(o => {
            return {
                codigoItem: o.codigoItem,
                descripcionLista: o.descripcionLista,
                disable: (o.codigoItem == '0')
            }
        })
    }
    return new Response(JSON.stringify(docs), dataHeaders);
}

async function retornaListaMaestra(peticion) {
    const requestClone = peticion.clone();
    const params = await requestClone.json().catch((err) => console.log(err));
    let docs = await db[params.aliasLista].toArray();
    docs = docs.map(r => {
        return {
            codigoItem: r.codigoItem,
            descripcionLista: r.descripcionLista,
        }
    })
    return new Response(JSON.stringify(docs), dataHeaders);
}

async function consultarCodigoUpgds(peticion) {
    const requestClone = peticion.clone();
    const params = await requestClone.json().catch((err) => err);
    let docs = await db.upgds.where("[COD_PRE+COD_SUB]").equals([params.COD_PRE, params.COD_SUB]).first();
    return new Response(JSON.stringify([docs]), dataHeaders);
}

async function obtenerCamposComplementarios(peticion) {
    const requestClone = peticion.clone();
    const params = await requestClone.json().catch((err) => err);
    let docs = await db.TablaTipoEvento.where("cod_eve").equals(params.cod_eve).and(x => x.vigenciaDesde != null).toArray();
    docs.sort((a, b) => (parseInt(a.ordenjson) > parseInt(b.ordenjson)) ? 1 : ((parseInt(b.ordenjson) > parseInt(a.ordenjson)) ? -1 : 0));
    docs = docs.map(x => x.nombre);
    return new Response(JSON.stringify(docs), dataHeaders);
}

async function retornarGruposEtnicos(peticion) {
    let docs = await db.GruposEtnicos.toArray();
    docs = docs.map(r => {
        return {
            COD_GRUPO: r.COD_GRUPO,
            NOM_GRUPO: r.NOM_GRUPO,
        }
    })
    return new Response(JSON.stringify(docs), dataHeaders);
}

async function exceptuadoDeCierre(peticion) {
    const requestClone = peticion.clone();
    const params = await requestClone.json().catch((err) => err);
    console.log(params); //(pend) NO ME CUADRA PORQ LLEGA VACIO COD_EVE (NO SIRVIO BIEN, REVISAR. por ahora se deja siempre true)
    let te = await db.TipoEvento.where("cod_eve").equals(params.cod_eve).first();
    const exeptuadoDeCierre = (te != undefined) ? te.exeptuadoDeCierre : false
    return new Response(JSON.stringify(true), dataHeaders);
}

async function retornarUpgdsPorMunicipio(peticion) {
    const requestClone = peticion.clone();
    const params = await requestClone.json().catch((err) => err);
    let docs
    if (params.Param1 != null) {
        if (params.Param1.substr(0, 2) != '11') {
            docs = await db.upgds.where("COD_PRE").startsWith(params.Param1).toArray();
        } else {
            docs = await db.upgds.where("COD_PRE").startsWith(params.Param1.substr(0, 2)).toArray();
        }
    } else {
        docs = await db.upgds.toArray();
    }

    docs = docs.map(r => {
        return {
            Codigo: r.COD_PRE + r.COD_SUB,
            RAZ_SOC: r.RAZ_SOC,
        }
    }).sort((a, b) => (parseInt(a.COD_PRE) > parseInt(b.COD_PRE)) ? 1 : ((parseInt(b.COD_PREe) > parseInt(a.COD_PRE)) ? -1 : 0))
    return new Response(JSON.stringify(docs), dataHeaders);
}

async function verificarUnicidad(peticion) {
    const requestClone = peticion.clone();
    const params = await requestClone.json().catch((err) => err);
    const filtro = {
        Cod_eve: params.Cod_eve,
        Semana: params.Semana,
        Año: params.Año,
        Tip_ide: params.Tip_ide,
        Num_ide: params.Num_ide,
        Cod_pre: params.Cod_pre,
        Cod_sub: params.Cod_sub
    }
    //Si validacion2 es true busca sin tener en cuenta la upgd (caso de prueba donde lo unico que cambia es la upgd)
    if (params.validacion2) {
        delete filtro.Cod_pre;
        delete filtro.Cod_sub;
    }
    let doc = await db.Eventos.where(filtro).first();
    if (doc != undefined) {
        doc.id = 'OF' + doc._id; //Se el agrega el prefigo (OF) para que se sepa que el registro viene de la base local
        doc.Fec_aju = formatDate(doc.Fec_aju);
        doc.Fec_arc_pl = formatDate(doc.Fec_arc_pl);
        doc.Fec_con = formatDate(doc.Fec_con);
        doc.Fec_def = formatDate(doc.Fec_def);
        doc.Fec_hos = formatDate(doc.Fec_hos);
        doc.Fec_not = formatDate(doc.Fec_not);
        doc.Fec_reacti = formatDate(doc.Fec_reacti);
        doc.Fecha_nto = formatDate(doc.Fecha_nto);
        doc.Ini_sin = formatDate(doc.Ini_sin);
    }
    return new Response(JSON.stringify(doc == undefined ? [] : [doc]), dataHeaders);
}

async function retornarPaisesSigla(peticion) {
    let docs = await db.Paises.toArray();
    docs = docs.map(r => {
        return {
            Cod_Pais: r.Cod_Pais_3,
            Nom_Pais: r.Nom_Pais,
            Codigo: r._id,
        }
    })
    return new Response(JSON.stringify(docs), dataHeaders);
}

async function retornarCarceles(peticion) {
    let docs = await db.Carceles.toArray();
    docs = docs.map(r => {
        return {
            codigo_caracterizacion: r.codigo_caracterizacion,
            nombre: r.nombre,
        }
    })
    return new Response(JSON.stringify(docs), dataHeaders);
}
async function retornarCups(peticion) {
    const requestClone = peticion.clone();
    const params = await requestClone.json().catch((err) => err);
    procMedico = params.Param1
    let docs
    switch (procMedico) {
        case '1':
            docs = await db.tbCups.filter(function (tbcup) { return /CESÁREA /.test(tbcup.descripcionLista); }).toArray();
            break
        case '2':
            docs = await db.tbCups.filter(function (tbcup) { return /HERNIORRAFIA /.test(tbcup.descripcionLista); }).toArray();
            break
        case '3':
            docs = await db.tbCups.filter(function (tbcup) { return /PARTO /.test(tbcup.descripcionLista); }).toArray();
            break
        case '4':
            docs = await db.tbCups.filter(function (tbcup) { return /ANASTOMOSIS /.test(tbcup.descripcionLista); }).toArray();
            break
        case '5':
            docs = await db.tbCups.filter(function (tbcup) { return /COLECISTECTOMÍA /.test(tbcup.descripcionLista); }).toArray();
            break
        default:
            docs = [{
                codigoItem: '00000',
                descripcionLista: 'Seleccione un procedimiento'
            }]
            return new Response(JSON.stringify(docs), dataHeaders);
            break
    }
    docs = docs.map(r => {
        return {
            codigoItem: r.codigoItem,
            descripcionLista: r.descripcionLista,
        }
    }).sort((a, b) => (parseInt(a.codigoItem) > parseInt(b.codigoItem)) ? 1 : ((parseInt(b.codigoItem) > parseInt(a.codigoItem)) ? -1 : 0))
    return new Response(JSON.stringify(docs), dataHeaders);
}
async function retornarAntibioticos(peticion) {
    let docs = await db.Antibioticos.toArray();
    docs = docs.map(r => {
        return {
            codigoItem: r.codigoItem,
            descripcionLista: r.descripcionLista,
        }
    })
    return new Response(JSON.stringify(docs), dataHeaders);
}
async function retornaOrganos_espacio(peticion) {
    const requestClone = peticion.clone();
    const params = await requestClone.json().catch((err) => err);
    aliasLista = params.aliasLista;
    codigoItem = params.Param1;
    let docs;
    // La funcion se encuentra funcionando unicamente para aliasLista organos_espacio, pendiente revisar en que otros casos se
    // implementa y sincronizar listas en caso de ser necesario (pend)
    switch (aliasLista) {
        case 'organos_espacio':
            if (codigoItem == null || codigoItem == 'false') {
                docs = await db.organos_espacio.where("codigoItem").equals('99999').toArray()
            }
            switch (codigoItem) {
                case '1':
                    docs = await db.organos_espacio.where("codigoItem").anyOf(['00001', '00002', '00003', '00004', '00005']).toArray()
                    break
                case '2':
                    docs = await db.organos_espacio.where("codigoItem").equals('00003').toArray()
                    break
                case '3':
                    docs = await db.organos_espacio.where("codigoItem").equals('00001').toArray()
                    break
                case '4':
                    docs = await db.organos_espacio.where("codigoItem").anyOf(['00003', '00006', '00007', '00008', '00009', '00010', '00011']).toArray()
                    break
                case '5':
                    docs = await db.organos_espacio.where("codigoItem").anyOf(['00002', '00003']).toArray()
                    break
                default:
                    docs = await db.organos_espacio.toArray()
                    break
            }
            docs = docs.map(r => {
                return {
                    codigoItem: r.codigoItem,
                    descripcionLista: r.descripcionLista,
                }
            })
            return new Response(JSON.stringify(docs), dataHeaders);
            break
        default:
            return
            break

    }
}
async function retornarSustanciasIntoxicantes(peticion) {
    const requestClone = peticion.clone();
    const params = await requestClone.json().catch((err) => err);
    let docs;
    if (params.Param1 != null) {
        docs = await db.SustanciasIntoxicantes.where("VALOR_ASOC").anyOf(params.Param1).or("COD_EVE").equals('NA').toArray()
    } else {
        docs = await db.SustanciasIntoxicantes.where("VALOR_ASOC").anyOf(['1', '2', '3', '4', '5', '6', '7', '8']).or("COD_EVE").equals('NA').toArray()
    }
    docs = docs.map(r => {
        return {
            ID: r.ID,
            NOMBRE: r.NOMBRE,
        }
    })
    return new Response(JSON.stringify(docs), dataHeaders);
}

async function obtenerBasico(peticion) {
    const requestClone = peticion.clone();
    const params = await requestClone.json().catch((err) => err);
    if (params.idEvento.startsWith("OF")) {
        const idEvento = parseInt(params.idEvento.replace('OF', ''));
        let doc = await db.Eventos.get(idEvento);
        doc.id = doc._id
        doc.Fec_aju = formatDate(doc.Fec_aju);
        doc.Fec_arc_pl = formatDate(doc.Fec_arc_pl);
        doc.Fec_con = formatDate(doc.Fec_con);
        doc.Fec_def = formatDate(doc.Fec_def);
        doc.Fec_hos = formatDate(doc.Fec_hos);
        doc.Fec_not = formatDate(doc.Fec_not);
        doc.Fec_reacti = formatDate(doc.Fec_reacti);
        doc.Fecha_nto = formatDate(doc.Fecha_nto);
        doc.Ini_sin = formatDate(doc.Ini_sin);
        return new Response(JSON.stringify([doc]), dataHeaders);
    } else return fetch(peticion)
}

async function obtenerComplementario(peticion) {
    const requestClone = peticion.clone();
    const params = await requestClone.json().catch((err) => err);
    if (params.idEvento.startsWith("OF")) {
        const idEvento = parseInt(params.idEvento.replace('OF', ''));
        let doc = await db.Eventos.get(idEvento);
        if ('complementario' in doc) {
            doc.complementario.Fechahora = formatDate(doc.complementario.Fechahora); //(Pend) agregar fecha hora
        } else {
            doc.complementario = {};
        }

        return new Response(JSON.stringify([doc.complementario]), dataHeaders);
    } else if (params.idEvento == 0) return new Response(JSON.stringify([]), dataHeaders);
    else return fetch(peticion)
}

async function retornarEnfermedadesHuerfanas(peticion) {
    const requestClone = peticion.clone();
    const params = await requestClone.json().catch((err) => err);
    let confirmado = params.Param1 //confirmar como llega el parametro
    let docs;
    if (confirmado == 3) {
        docs = await db.EnfermedadesHuerfanas.where("CONFIRMADO").anyOf(['L', 'A']).toArray()
    } else if (confirmado == 4) {
        docs = await db.EnfermedadesHuerfanas.where("CONFIRMADO").anyOf(['C', 'A']).toArray()
    } else {
        docs = await db.EnfermedadesHuerfanas.where("CONFIRMADO").anyOf(['A']).toArray()
    }
    docs = docs.map(r => {
        return {
            COD_ENFERM: r.COD_ENFERM,
            NOM_ENFERM: r.NOM_ENFERM,
            NUEVO_ID_R: r.NUEVO_ID_R
        }
    }).sort((a, b) => (parseInt(a.NUEVO_ID_R) > parseInt(b.NUEVO_ID_R)) ? 1 : ((parseInt(b.NUEVO_ID_R) > parseInt(a.NUEVO_ID_R)) ? -1 : 0))
    return new Response(JSON.stringify(docs), dataHeaders);
}

async function retornarPruebaConfirmatoria(peticion) {
    let docs = await db.pruebasenfermedadeshuerfanas.toArray();
    docs = docs.map(r => {
        return {
            IDPRUEBA: r.IDPRUEBA,
            NOMBRE_PRU: r.NOMBRE_PRU,
        }
    })
    return new Response(JSON.stringify(docs), dataHeaders);
}

async function retornarEnfermedadesHuerfanasPorCodigo(peticion) {
    const requestClone = peticion.clone();
    const params = await requestClone.json().catch((err) => err);
    let docs = await db.EnfermedadesHuerfanas.where("COD_ENFERM").equals(params.COD_ENFERM).toArray();
    docs = docs.map(r => {
        return {
            COD_ENFERM: r.COD_ENFERM,
            NOM_ENFERM: r.NOM_ENFERM,
            NUEVO_ID_R: r.NUEVO_ID_R
        }
    });
    return new Response(JSON.stringify(docs), dataHeaders);
}
async function retornaListaMaestraWhereIn(peticion) {
    const requestClone = peticion.clone();
    const params = await requestClone.json().catch((err) => err);
    let aliasLista = params.aliasLista;
    let whereIn
    let docs;
    if (params.whereIn != null) {
        whereIn = params.whereIn.split(',');
    }

    // La funcion se encuentra funcionando unicamente para aliasLista Pruebas, Muestras. pendiente revisar en que otros casos se
    // implementa y sincronizar listas en caso de ser necesario (pend)
    if (whereIn != null && aliasLista != null) {
        docs = await db[aliasLista].where("codigoItem").anyOf(whereIn).toArray()
        docs = docs.map(r => {
            return {
                codigoItem: r.codigoItem,
                descripcionLista: r.descripcionLista,
            }
        })
    } else {
        docs = [{
        }]
    }
    return new Response(JSON.stringify(docs), dataHeaders);

}

async function retornarOcupaciones() {
    let docs = await db.Ocupaciones.where('activo').equals(1).toArray();
    docs = docs.map(o => {
        return {
            Codigo: o.Cod_ocu.toString().padStart(4, '0'),
            Ocupacion: o.Nom_ocu
        }
    })
    return new Response(JSON.stringify(docs), dataHeaders);
}
async function retornarAgentes(peticion) {
    const requestClone = peticion.clone();
    const params = await requestClone.json().catch((err) => err);
    let docs = await db.agentes_etas.where("codigoItem").anyOf('10', '17', '77', '78', '79', '80', '81', '82', '83', '84').toArray();
    docs = docs.map(r => {
        return {
            codigoItem: r.codigoItem,
            descripcionLista: r.descripcionLista,
        }
    });
    return new Response(JSON.stringify(docs), dataHeaders);
}

async function retornaListaMaestraMultiplesParametros(peticion) {
    //Se sincroniza aliasLista LookupTable, verificar mas tablas que hagan uso de la peticion (pend)
    const requestClone = peticion.clone();
    const params = await requestClone.json().catch((err) => err);
    let aliasLista = params.aliasLista;
    let codigoItem = params.codigoItem ?? 0;
    let codigoItem1 = params.codigoItem1 ?? 0;
    let codigoItem2 = params.codigoItem2 ?? 0;
    let codigoItem3 = params.codigoItem3 ?? 0;
    let codigoItem4 = params.codigoItem4 ?? 0;
    let codigoItem5 = params.codigoItem5 ?? 0;

    let docs = await db[aliasLista].toCollection().filter(function (item) {
        return (
            //Primero el filtro elimina todos nulos de las columnas que están involucradas en el filtro
            codigoItem != 0 ? item.codigoItem != null : true &&
                codigoItem1 != 0 ? item.codigoItem1 != null : true &&
                    codigoItem2 != 0 ? item.codigoItem2 != null : true &&
                        codigoItem3 != 0 ? item.codigoItem3 != null : true &&

                        //Luego se filtran coincidencias solo de los filtros activos usando un "indexOf" como si fuera un like de SQL
                        item.codigoItem?.indexOf(codigoItem) != -1 &&
                        item.codigoItem1?.indexOf(codigoItem1) != -1 &&
                        item.codigoItem2?.indexOf(codigoItem2) != -1 &&
            item.codigoItem3?.indexOf(codigoItem3) != -1
        )
    }).toArray();

    docs = docs.map(r => {
        return {
            codigoItem: r.codigoItem,
            descripcionLista: r.descripcionLista,
        }
    });
    return new Response(JSON.stringify(docs), dataHeaders);
}

async function retornaListaMaestraParametros(peticion) {
    const requestClone = peticion.clone();
    const params = await requestClone.json().catch((err) => err);
    let aliasLista = params.aliasLista;
    let codigoItem = params.codigoItem ?? '';
    let docs;
    if (aliasLista == 'cie10' && codigoItem == 'H') {
        docs = await db[aliasLista].where('codigoItem').startsWith(codigoItem).or('codigoItem').equals('E7031').toArray();
    } else {
        docs = await db[aliasLista].where('codigoItem').startsWith(codigoItem).toArray();
    }
    docs = docs.map(r => {
        return {
            codigoItem: r.codigoItem,
            descripcionLista: r.descripcionLista,
        }
    });
    return new Response(JSON.stringify(docs), dataHeaders);
}

async function retornaZscorePesoTalla(peticion) {
    const requestClone = peticion.clone();
    const params = await requestClone.json().catch((err) => err);
    if (params.height > 120) params.height = 120;
    let docs = await db.OMS_Zscore_Peso_talla.where("[height+sexo]").equals([parseFloat(params.height), params.sexo])
        .and(x => x.edad_inicial <= params.edad_inicial && x.edad_final >= params.edad_inicial).toArray();
    if (docs.length == 0) {
        docs = await db.OMS_Zscore_Peso_talla.where("[height+sexo]").equals([parseFloat(params.height), params.sexo]).toArray();
    }
    return new Response(JSON.stringify(docs), dataHeaders);
}

async function retornaZscoreTallaEdad(peticion) {
    const requestClone = peticion.clone();
    const params = await requestClone.json().catch((err) => err);
    let docs = await db.OMS_Zscore_Talla_Edad.where("[month+sexo]").equals([params.month, params.sexo]).toArray();
    return new Response(JSON.stringify(docs), dataHeaders);
}

async function retornaListaMaestraParametrosLike(peticion) {
    const requestClone = peticion.clone();
    const params = await requestClone.json().catch((err) => err);
    let aliasLista = params.aliasLista;
    let codigoItem = params.codigoItem ?? -1;
    let codigoItem1 = params.codigoItem1 ?? -1;
    let codigoItem2 = params.codigoItem2 ?? -1;
    let codigoItem3 = params.codigoItem3 ?? -1;
    let codigoItem4 = params.codigoItem4 ?? -1;
    let codigoItem5 = params.codigoItem5 ?? -1;
    let lista = params.lista?.replaceAll("'", '').split(',') ?? [];
    let docs = await db[aliasLista].toCollection().filter(function (item) {
        return (
            item.codigoItem.indexOf(codigoItem) != -1 ||
            item.codigoItem.indexOf(codigoItem1) != -1 ||
            item.codigoItem.indexOf(codigoItem2) != -1 ||
            item.codigoItem.indexOf(codigoItem3) != -1 ||
            item.codigoItem.indexOf(codigoItem4) != -1 ||
            item.codigoItem.indexOf(codigoItem5) != -1 ||
            lista.includes(item.codigoItem)
        )
    }).toArray()
    docs = docs.map(r => {
        return {
            codigoItem: r.codigoItem,
            descripcionLista: r.descripcionLista,
        }
    });
    return new Response(JSON.stringify(docs), dataHeaders);
}



async function retornarDetalleEventoEspecifico(peticion) {
    const requestClone = peticion.clone();
    const params = await requestClone.json().catch((err) => err);
    idOffline = parseInt(params.idEvento.replace('OF', ''));
    var registro = await db.Eventos.get(idOffline);
    return new Response(JSON.stringify(registro.complementario), dataHeaders);
}

async function obtenerTipoEventoPorCodigo(peticion) {
    const requestClone = peticion.clone();
    const params = await requestClone.json().catch((err) => err);
    let cod_eve = params.codigoEvento;
    const tipoEvento = !isNaN(cod_eve) ? await db.TipoEvento.where("cod_eve").equals(cod_eve).first() : {};
    return new Response(JSON.stringify(tipoEvento), dataHeaders);
}

async function retornarLabelsImpresion(peticion) {
    const requestClone = peticion.clone();
    const params = await requestClone.json().catch((err) => err);
    let { cod_eve, campos } = params;
    campos = campos.split(',');
    const tipoEvento = !isNaN(cod_eve) ? await db.TipoEvento.where("cod_eve").equals(cod_eve).first() : {};
    const camposAOcultar = tipoEvento.camposOcultos ? tipoEvento.camposOcultos.toUpperCase() : '';

    let labels = !isNaN(cod_eve) ? await db.TablaTipoEvento.where("cod_eve").equals(cod_eve).toArray() : [];

    labels = labels.map(x => {
        return {
            campo: x.nombre?.toLowerCase(),
            labelImpresion: x.labelImpresion,
            cl_inactivo: x.cl_inactivo,
            ocultarCampo: camposAOcultar.includes(',' + x.nombre?.toUpperCase() + ',') ? true : false, // (pend) probar que si oculta campos
            omite: !campos.includes(x.nombre)
        }
    })

    labels = labels.filter(x => !x.omite);
    return new Response(JSON.stringify(labels), dataHeaders);

}