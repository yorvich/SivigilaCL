importScripts("/precache-manifest.513ba50db9f5eea9a889d307d8911041.js", "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

/* eslint-disable */

const dataHeaders = {
    'status': 200,
    'Content-Type': 'application/json'
};
let userData = {};
importScripts('./providersOffline/pouchdb-7.2.1.min.js');
importScripts('./providersOffline/pouchdb.find.min.js');
importScripts('./providersOffline/dexie.min.js');
importScripts('./providersOffline/modelDB.js');
const db = new Dexie('myDatabase');
versionamientoBD(db);
importScripts('./providersOffline/generales.js');
importScripts('./providersOffline/IndividualesOfflineProvider.js');
importScripts('./providersOffline/ListaMaestraOfflineProvider.js');
importScripts('./providersOffline/ComunOfflineProvider.js');
importScripts('./providersOffline/ColectivosOfflineProvider.js');
importScripts('./providersOffline/LaboratoriosOfflineProvider.js');

// This is the code piece that GenerateSW mode can't provide for us.
// This code listens for the user's confirmation to update the app.

self.addEventListener('message', event => {
    const data = event.data;
    if (data.userid) { userData = data }
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

self.addEventListener('fetch', async event => {
    let url = new URL(event.request.url).pathname.split('/api/')[1];
    if (url == undefined || navigator.onLine) return;
    url = url.charAt(0).toUpperCase() + url.slice(1);
    switch (url) {
        case 'Offline/sincronizarTablas':
            return;
            break
        case 'ComunCaptura/retornarOrdenCamposBDUA':
            event.respondWith(retornarOrdenCamposBDUA());
            break
        case 'Individuales/retornarListaEventos':
            event.respondWith(retornarListaEventos());
            break
        case 'ComunCaptura/retornarTipoEvento':
            event.respondWith(retornarTipoEvento(event.request));
            break
        case 'Individuales/retornarEstructuraGuardadoBasicos':
            event.respondWith(retornarEstructuraGuardadoBasicos(event.request));
            break
        case 'Individuales/retornarDatosBasicos':
            event.respondWith(retornarDatosBasicos(event.request));
            break
        case 'Individuales/retornarValidaciones':
            event.respondWith(retornarValidaciones(event.request));
            break
        case 'Individuales/retornarFuncionalidades':
            event.respondWith(retornarFuncionalidades(event.request));
            break
        case 'Individuales/retornarDatosComplementarios':
            event.respondWith(retornarDatosComplementarios(event.request));
            break
        case 'Individuales/retornarValidacionesAfectantes':
            event.respondWith(retornarValidacionesAfectantes(event.request));
            break
        case 'Individuales/retornarFuncionalidadesAfectantes':
            event.respondWith(retornarFuncionalidadesAfectantes(event.request));
            break
        case 'ComunCaptura/retornarcie345':
            event.respondWith(retornarcie345());
            break
        case 'ComunCaptura/retornarEsDistrito':
            event.respondWith(retornarEsDistrito(event.request));
            break
        case 'Individuales/retornarPaises':
            event.respondWith(retornarPaises());
            break
        case 'Individuales/retornarDepartamentos':
            event.respondWith(retornarDepartamentos(event.request));
            break
        case 'Individuales/retornarMunicipios':
            event.respondWith(retornarMunicipios(event.request));
            break
        case 'Individuales/retornaSectores':
            event.respondWith(retornaSectores(event.request)); // <---- The function you're measuring time for
            break
        case 'ComunCaptura/retornarcie345':
            event.respondWith(retornarcie345());
            break
        case 'Individuales/retornarUpgds':
            event.respondWith(retornarUpgds(event.request));
            break
        case 'Individuales/retornarUpgdsActivas':
            event.respondWith(retornarUpgdsActivas(event.request));
            break
        case 'Individuales/retornarAseguradoras':
            event.respondWith(retornarAseguradoras(event.request));
            break
        case 'Individuales/retornarOcupacionesPorEdad':
            event.respondWith(retornarOcupacionesPorEdad(event.request));
            break
        case 'ComunCaptura/retornarFechaServidor':
            event.respondWith(retornarFechaServidor());
            break
        case 'Individuales/retornaClasificacionCaso':
            event.respondWith(retornaClasificacionCaso(event.request));
            break
        case 'Individuales/retornarAjustes':
            event.respondWith(retornarAjustes(event.request));
            break
        case 'Individuales/retornaListaMaestra':
            event.respondWith(retornaListaMaestra(event.request));
            break
        case 'Individuales/retornaListaMaestraParametros':
            event.respondWith(retornaListaMaestraParametros(event.request));
            break
        case 'Individuales/consultarCodigoUpgds':
            event.respondWith(consultarCodigoUpgds(event.request));
            break
        case 'ComunCaptura/retornarEpidemiologica':
            event.respondWith(retornarEpidemiologica(event.request));
            break
        case 'Individuales/obtenerComplementario':
            event.respondWith(obtenerComplementario(event.request));
            break
        case 'ComunCaptura/retornarPrimeraEpidemiologica':
            event.respondWith(retornarPrimeraEpidemiologica(event.request));
            break
        case 'Individuales/exceptuadoDeCierre':
            event.respondWith(exceptuadoDeCierre(event.request));
            break
        case 'Individuales/retornaVeredas':
            event.respondWith(retornaVeredas(event.request));
            break
        case 'Individuales/obtenerCamposComplementarios':
            event.respondWith(obtenerCamposComplementarios(event.request));
            break
        case 'Individuales/retornarGruposEtnicos':
            event.respondWith(retornarGruposEtnicos(event.request));
            break
        case 'Colectivos/retornarListaEventosColectivos':
            event.respondWith(retornarListaEventosColectivos(event.request));
            break
        case 'Individuales/retornarAjustesColectivos':
            event.respondWith(retornarAjustesColectivos(event.request));
            break
        case 'Colectivos/obtenerColectivo':
            event.respondWith(obtenerColectivo(event.request));
            break
        case 'Laboratorios/consultarEventosConLaboratorios':
            event.respondWith(EventosConLaboratorios(event.request));
            break
        case 'Individuales/retornarAjustesLaboratorios':
            event.respondWith(EventosConLaboratorios(event.request));
            break
        case 'ComunCaptura/retornarElementosLaboratorio':
            event.respondWith(ElementosLaboratorio(event.request));
            break
        case 'Individuales/retornarUpgdsPorMunicipio':
            event.respondWith(retornarUpgdsPorMunicipio(event.request));
            break
        case 'Upgds/retornaUpgdsCaracterizadasUci':
            event.respondWith(retornarCaracterizacionUpgdsUci(event.request));
            break
        case 'Upgds/RetornarDenominador':
            event.respondWith(retornarDenominador(event.request));
            break
        case 'ComunCaptura/obtenerPaisPorDepartamento':
            event.respondWith(obtenerPaisPorDepartamento(event.request));
            break
        case 'Laboratorios/consultarUltimosLaboratoriosOFFLINE':
            event.respondWith(UltimosLaboratorios(event.request));
            break
        case 'ComunCaptura/validarSemanaCalendarioEpidemiologico':
            event.respondWith(validarSemanaCalendarioEpidemiologico(event.request));
            break
        case 'Individuales/verificarUnicidad':
            if (!navigator.onLine) {
                event.respondWith(verificarUnicidad(event.request)); //(pend) descomentar cuando se tenga lista la actualizacion
            } else return;
            break
        case 'Individuales/retornarPaisesSigla':
            event.respondWith(retornarPaisesSigla(event.request));
            break
        case 'Individuales/retornarCarceles':
            event.respondWith(retornarCarceles(event.request));
            break
        case 'Individuales/retornarCups':
            event.respondWith(retornarCups(event.request));
            break
        case 'Individuales/retornarAntibioticos':
            event.respondWith(retornarAntibioticos(event.request));
            break
        case 'Individuales/retornaOrganos_espacio':
            event.respondWith(retornaOrganos_espacio(event.request));
            break
        case 'ComunCaptura/retornarSustanciasIntoxicantes':
            event.respondWith(retornarSustanciasIntoxicantes(event.request));
            break
        case 'Individuales/obtenerBasico':
            event.respondWith(obtenerBasico(event.request));
        case 'Individuales/retornarEnfermedadesHuerfanas':
            event.respondWith(retornarEnfermedadesHuerfanas(event.request));
            break
        case 'Individuales/retornarPruebaConfirmatoria':
            event.respondWith(retornarPruebaConfirmatoria(event.request));
            break
        case 'Individuales/retornarEnfermedadesHuerfanasPorCodigo':
            event.respondWith(retornarEnfermedadesHuerfanasPorCodigo(event.request));
            break
        case 'ComunCaptura/retornaListaMaestraWhereIn':
            event.respondWith(retornaListaMaestraWhereIn(event.request));
            break
        //*Por defecto de las peticiones que retornan objetos y que no aplican en offline
        case 'ComunCaptura/retornarXroad':
        case 'ComunCaptura/retornarDatosDelPaciente':
        case 'ComunCaptura/geocode':
            event.respondWith(fetch(event.request).catch(() => { return (new Response(JSON.stringify({}), dataHeaders)) }));
            break
        //*Por defecto de las peticiones que retornan arreglos y que no aplican en offline
        case 'ComunCaptura/geoautocomplete':
            event.respondWith(fetch(event.request).catch(() => { return (new Response(JSON.stringify([]), dataHeaders)) }));
            break
        case 'Individuales/retornarOcupaciones':
            event.respondWith(retornarOcupaciones());
            break
        case 'Individuales/retornarAgentes':
            event.respondWith(retornarAgentes(event.request));
            break
        case 'Individuales/retornaListaMaestraMultiplesParametros':
            event.respondWith(retornaListaMaestraMultiplesParametros(event.request));
            break
        case 'Individuales/retornaZscoreTallaEdad':
            event.respondWith(retornaZscoreTallaEdad(event.request));
            break
        case 'Individuales/retornaZscorePesoTalla':
            event.respondWith(retornaZscorePesoTalla(event.request));
            break
        case 'ComunCaptura/retornarEventosNetagivas':
            if (!navigator.onLine) {
                event.respondWith(retornarEventosNetagivas(event.request));
            } else return;
            break
        case 'Individuales/retornaListaMaestraParametrosLike':
            event.respondWith(retornaListaMaestraParametrosLike(event.request));
            break
        case 'Individuales/retornarDetalleEventoEspecifico':
            event.respondWith(retornarDetalleEventoEspecifico(event.request));
            break
        case 'Individuales/retornarLabelsImpresion':
            event.respondWith(retornarLabelsImpresion(event.request));
            break
        case 'Individuales/obtenerTipoEventoPorCodigo':
            event.respondWith(obtenerTipoEventoPorCodigo(event.request));
            break

        default:
            console.log("Peticion sin controlar: ", url);
            return;
    }
})

// The precaching code provided by Workbox.
self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
workbox.routing.registerNavigationRoute(workbox.precaching.getCacheKeyForURL("index.html"))
