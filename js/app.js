const API = "https://pokeapi.co/api/v2/pokemon/";

const formulario = document.querySelector("#formulario");
const entradaPokemon = document.querySelector("#pokemon");
const selectorMetodo = document.querySelector("#metodo");
const mensaje = document.querySelector("#mensaje");
const resultado = document.querySelector("#resultado");
const estado = document.querySelector("#estado");
const tiempo = document.querySelector("#tiempo");
const tipoContenido = document.querySelector("#tipo-contenido");
const salidaJson = document.querySelector("#json");
const visorCodigo = document.querySelector("#visor-codigo");
const panelJson = document.querySelector("#panel-json");
const panelCodigo = document.querySelector("#panel-codigo");
const tabJson = document.querySelector("#tab-json");
const tabCodigo = document.querySelector("#tab-codigo");
const nombresAlternativos = { mimikyu: "778" };

function actualizarVisorCodigo() {
    visorCodigo.textContent = selectorMetodo.value === "async"
        ? buscarConAsyncAwait.toString()
        : buscarConPromesas.toString();
}

function seleccionarPestana(nombre) {
    const mostrarJson = nombre === "json";
    panelJson.hidden = !mostrarJson;
    panelCodigo.hidden = mostrarJson;
    tabJson.classList.toggle("activa", mostrarJson);
    tabCodigo.classList.toggle("activa", !mostrarJson);
    tabJson.setAttribute("aria-selected", String(mostrarJson));
    tabCodigo.setAttribute("aria-selected", String(!mostrarJson));
}

tabJson.addEventListener("click", function () { seleccionarPestana("json"); });
tabCodigo.addEventListener("click", function () { seleccionarPestana("codigo"); });
selectorMetodo.addEventListener("change", actualizarVisorCodigo);
actualizarVisorCodigo();

document.querySelectorAll(".chip-busqueda").forEach(function (boton) {
    boton.addEventListener("click", function () {
        entradaPokemon.value = boton.dataset.query;
        formulario.requestSubmit();
    });
});

formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const nombre = entradaPokemon.value.trim().toLowerCase();

    if (!nombre) {
        mensaje.textContent = "Escribe el nombre o número de un Pokémon.";
        return;
    }

    // PokéAPI registra la forma base de Mimikyu con el identificador 778.
    const consulta = nombresAlternativos[nombre] || nombre;
    const url = API + encodeURIComponent(consulta);

    resultado.replaceChildren();
    mensaje.textContent = "Consultando PokéAPI...";
    estado.textContent = "Consultando";
    tiempo.textContent = "—";
    tipoContenido.textContent = "—";
    salidaJson.textContent = "// Esperando respuesta...";

    if (selectorMetodo.value === "async") {
        buscarConAsyncAwait(url);
    } else {
        buscarConPromesas(url);
    }
});

async function buscarConAsyncAwait(url) {
    const inicio = performance.now();

    try {
        const respuesta = await fetch(url, { method: "GET" });
        if (!respuesta.ok) {
            const datosError = await respuesta.json();
            const duracion = Math.round(performance.now() - inicio);
            mostrarDatosPeticion(respuesta, datosError, duracion);
            throw new Error("No se encontró ese Pokémon. Revisa el nombre o número.");
        }

        const datos = await respuesta.json();
        const duracion = Math.round(performance.now() - inicio);
        mostrarDatosPeticion(respuesta, datos, duracion);
        console.log("Nombre:", datos.name);
        console.log("Habilidades:", datos.abilities);
        mostrarPokemon(datos);
        mensaje.textContent = "Consulta completada con async/await.";
    } catch (error) {
        console.error("Error al realizar fetch:", error.message);
        mostrarError(error);
    }
}

function buscarConPromesas(url) {
    const inicio = performance.now();

    fetch(url, { method: "GET" })
        .then(function (respuesta) {
            if (!respuesta.ok) {
                return respuesta.json().then(function (datosError) {
                    const duracion = Math.round(performance.now() - inicio);
                    mostrarDatosPeticion(respuesta, datosError, duracion);
                    throw new Error("No se encontró ese Pokémon. Revisa el nombre o número.");
                });
            }

            return respuesta.json().then(function (datos) {
                const duracion = Math.round(performance.now() - inicio);
                mostrarDatosPeticion(respuesta, datos, duracion);
                return datos;
            });
        })
        .then(function (datos) {
            console.log("Nombre:", datos.name);
            console.log("Habilidades:", datos.abilities);
            mostrarPokemon(datos);
            mensaje.textContent = "Consulta completada con promesas.";
        })
        .catch(function (error) {
            console.error("Error:", error.message);
            mostrarError(error);
        });
}

function mostrarDatosPeticion(respuesta, datos, duracion) {
    estado.textContent = respuesta.status + " " + respuesta.statusText;
    tiempo.textContent = duracion;
    tipoContenido.textContent =
        respuesta.headers.get("content-type") || "No especificado";
    salidaJson.textContent = JSON.stringify(datos, null, 2);
}

function mostrarPokemon(pokemon) {
    resultado.replaceChildren();

    const tarjeta = document.createElement("article");
    tarjeta.className = "tarjeta-pokemon";

    const arte = document.createElement("div");
    arte.className = "pokemon-arte";

    const imagen = document.createElement("img");
    imagen.src = pokemon.sprites.other?.["official-artwork"]?.front_default ||
        pokemon.sprites.front_default || "";
    imagen.alt = "Imagen de " + pokemon.name;

    arte.append(imagen);

    const informacion = document.createElement("div");
    informacion.className = "pokemon-info";

    const numero = document.createElement("span");
    numero.className = "pokemon-numero";
    numero.textContent = "N.º " + String(pokemon.id).padStart(3, "0");

    const nombre = document.createElement("h2");
    nombre.textContent = pokemon.name.replace(/-disguised$/, "");

    const listaTipos = document.createElement("div");
    listaTipos.className = "tipos";
    pokemon.types.forEach(function (elemento) {
        const tipo = document.createElement("span");
        tipo.className = "tipo tipo-" + elemento.type.name;
        tipo.textContent = elemento.type.name;
        listaTipos.append(tipo);
    });

    const datos = document.createElement("div");
    datos.className = "pokemon-datos";

    [
        ["ALTURA", (pokemon.height / 10).toFixed(1) + " m"],
        ["PESO", (pokemon.weight / 10).toFixed(1) + " kg"],
        ["HABILIDADES", pokemon.abilities.map(function (item) { return item.ability.name; }).join(", ")]
    ].forEach(function (dato) {
        const bloque = document.createElement("div");
        bloque.className = "dato-pokemon";
        const etiqueta = document.createElement("span");
        etiqueta.textContent = dato[0];
        const valor = document.createElement("strong");
        valor.textContent = dato[1];
        bloque.append(etiqueta, valor);
        datos.append(bloque);
    });

    const estadisticas = document.createElement("section");
    estadisticas.className = "estadisticas-pokemon";
    const tituloEstadisticas = document.createElement("h3");
    tituloEstadisticas.textContent = "Estadísticas de combate";
    estadisticas.append(tituloEstadisticas);

    const nombresEstadisticas = [
        ["hp", "HP"],
        ["attack", "Ataque"],
        ["defense", "Defensa"],
        ["speed", "Velocidad"]
    ];

    nombresEstadisticas.forEach(function (configuracion) {
        const estadistica = pokemon.stats.find(function (item) {
            return item.stat.name === configuracion[0];
        });
        if (!estadistica) return;

        const fila = document.createElement("div");
        fila.className = "fila-estadistica";
        const etiqueta = document.createElement("span");
        etiqueta.className = "nombre-estadistica";
        etiqueta.textContent = configuracion[1];
        const valor = document.createElement("strong");
        valor.textContent = estadistica.base_stat;
        const barra = document.createElement("div");
        barra.className = "barra-estadistica";
        const progreso = document.createElement("span");
        progreso.style.width = Math.min(estadistica.base_stat / 2, 100) + "%";
        barra.append(progreso);
        fila.append(etiqueta, valor, barra);
        estadisticas.append(fila);
    });

    informacion.append(numero, nombre, listaTipos, datos, estadisticas);
    tarjeta.append(arte, informacion);
    resultado.append(tarjeta);
}

function mostrarError(error) {
    mensaje.textContent = error.message;
    resultado.replaceChildren();
    const estadoError = document.createElement("div");
    estadoError.className = "estado-vacio";
    const titulo = document.createElement("p");
    titulo.textContent = "¡No encontramos ese Pokémon!";
    const ayuda = document.createElement("span");
    ayuda.textContent = "Revisa el nombre o intenta con su número en la Pokédex.";
    estadoError.append(titulo, ayuda);
    resultado.append(estadoError);
}
