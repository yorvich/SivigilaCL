/* eslint-disable */

async function retornarFechaServidor() {
   const fechaActual = new Date()
   return new Response(fechaActual, dataHeaders);
}

async function retornarEpidemiologica(peticion) {
   const requestClone = peticion.clone();
   const params = await requestClone.json().catch((err) => err);
   let docs = await db.Calendario.toArray();
   let parts = params.fecha.split("/");
   let fecha = Date.parse(new Date(parseInt(parts[2], 10),parseInt(parts[1], 10) - 1,parseInt(parts[0], 10)));
   docs = docs.find(f => Date.parse(f.desde) <= fecha && Date.parse(f.hasta) >= fecha);
   return new Response(JSON.stringify(docs), dataHeaders);
}

async function retornarPrimeraEpidemiologica(peticion) {
   const requestClone = peticion.clone();
   const params = await requestClone.json().catch((err) => err);
   let docs = await db.Calendario.toArray();
   let fecha = params.anio
   docs = docs.find(f => f.vigencia == fecha && f.semana == 1)
   return new Response(JSON.stringify(docs), dataHeaders);
}


async function retornarCaracterizacionUpgdsUci(peticion) {
   const requestClone = peticion.clone();
   const params = await requestClone.json().catch((err) => err);
   let Cod_pre = params.Cod_pre;
   let Tipo_uci;
   let Cod_sub;
   switch (params.Tipo_uci) {
      case '1':
         Tipo_uci="A"
         break
      case '2':
         Tipo_uci="P"
         break
      case '3':
         Tipo_uci="N"
         break
   }
   Cod_sub= Cod_pre.substr(10,Cod_pre.length)
   Cod_pre = Cod_pre.substr(0,10)
   let docs = await db.Uci.where("Cod_pre").equals(Cod_pre).and(x => x.Cod_sub == Cod_sub && x.Tipo_uci == Tipo_uci && x.Activa == "1" && x.Ajuste != "6").toArray();
   console.log(docs)
   return new Response(JSON.stringify(docs), dataHeaders);
}

async function retornarDenominador(peticion) {
   const requestClone = peticion.clone();
   const params = await requestClone.json().catch((err) => err);
   let Cod_pre = params.Cod_pre;
   let Cod_sub;
   Cod_sub= Cod_pre.substr(10,Cod_pre.length)
   Cod_pre = Cod_pre.substr(0,10)
   let docs = await db.upgds.where("COD_PRE").equals(Cod_pre).and(x => x.COD_SUB == Cod_sub).toArray();
   switch (params.procedimiento) {
      case '1':
         docs = docs.map(r => {
            return {
               Abierta: r.ser_cesare,
            }
         })
         break
      case '2':
         docs = docs.map(r => {
            return {
               Abierta: r.ser_hernio,
            }
         })
         break
      case '3':
         docs = docs.map(r => {
            return {
               Abierta: r.ser_par_va,
            }
         })
         break
      case '4':
         docs = docs.map(r => {
            return {
               Abierta: r.ser_revasc,
            }
         })
         break
      case '5':
         docs = docs.map(r => {
            return {
               Abierta: r.ser_coleci,
            }
         })
         break
   }
   return new Response(JSON.stringify(docs), dataHeaders);
}

async function obtenerPaisPorDepartamento(peticion) {
   const requestClone = peticion.clone();
   const params = await requestClone.json().catch((err) => err);
   let docs = await db.Municipios.where("Cod_mun").equals(params.cod_mun).toArray();
   docs = docs.map(r => {
      return r.Cod_pais
   })
   return new Response(JSON.stringify(docs), dataHeaders);
}

async function validarSemanaCalendarioEpidemiologico(peticion) {
   const requestClone = peticion.clone();
   const params = await requestClone.json().catch((err) => err);
   let docs = await db.Calendario.where("vigencia").equals(params.vigencia).and(x => x.semana == params.semana).toArray();
   let val;
   if (docs.length > 0) {
      val=true;
   }else{
      val=false;
   }
   return new Response(JSON.stringify(val), dataHeaders);
}

async function retornarEsDistrito(peticion) {
   const requestClone = peticion.clone();
   const params = await requestClone.json().catch((err) => err);
   const municipio = await db.Municipios.where("Cod_mun").equals(params.cod_mun).first();
   const esDist = municipio.esDistrito ? 1 : 0;
   return new Response(JSON.stringify(esDist), dataHeaders);
}

async function retornarUpgdsActivas() {
   // const requestClone = peticion.clone();
   // const params = await requestClone.json().catch((err) => err);
   let upgds = await db.upgds.where("ACT_SIV").equals(1).sortBy('COD_PRE');
   upgds = upgds.filter(function (up) { return up.COD_PRE.length == 10; });
   upgds = upgds.map(r => {
      return { Codigo: r.COD_PRE + r.COD_SUB, RAZ_SOC: r.RAZ_SOC }
   })

   return new Response(JSON.stringify(upgds), dataHeaders);
}

async function retornarEventosNetagivas(peticion) {
   const requestClone = peticion.clone();
   const params = await requestClone.json().catch((err) => err);
   let año = params.año;
   let cod_eve = params.cod_eve
   let cod_pre = params.cod_pre
   let semana = params.semana
   let cod_sub;
   cod_sub= cod_pre.substr(10,cod_pre.length)
   cod_pre = cod_pre.substr(0,10)
   let docs = await db.Eventos.where("Cod_eve").equals(cod_eve).and(x => x.Cod_pre == cod_pre && x.Cod_sub == cod_sub && x.Semana == semana && x.año == año).toArray();
   return new Response(JSON.stringify(docs), dataHeaders);
}





