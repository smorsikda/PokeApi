# Pokédex API

Portal web educativo que consulta la API pública PokéAPI y presenta información de Pokémon en una interfaz interactiva.

## Objetivo

Practicar el consumo de servicios web desde JavaScript mediante peticiones HTTP `GET`, `fetch()`, respuestas JSON y manejo de errores.

## Tecnologías

- HTML5
- CSS3
- JavaScript
- [PokéAPI v2](https://pokeapi.co/docs/v2)

No se requiere una clave de API ni instalar dependencias.

## Estructura del proyecto

```text
PokeApi/
├── index.html       # Estructura de la página
├── css/
│   └── style.css    # Diseño y estilos adaptables
├── js/
│   └── app.js       # Peticiones, renderizado y manejo de errores
└── README.md        # Documentación del proyecto
```

## Funcionalidades

1. **Laboratorio de peticiones:** búsqueda de Pokémon por nombre o número, por ejemplo `ditto`, `pikachu` o `25`.
2. **Métricas HTTP:** muestra el estado de la respuesta, la latencia en milisegundos y el tipo de contenido.
3. **Dos implementaciones:** permite elegir entre `async/await` y Promesas con `.then()` / `.catch()`.
4. **Ficha dinámica:** muestra la ilustración, el número, los tipos, la altura, el peso, las habilidades y las estadísticas base de HP, Ataque, Defensa y Velocidad.
5. **Visor de respuesta:** pestañas para inspeccionar el JSON recibido y el código JavaScript del método seleccionado.

También presenta mensajes de carga y error. Al buscar un Pokémon inexistente, la API responde con un estado HTTP `404`, que se muestra en la página.

## API utilizada

El portal consulta el recurso de Pokémon de PokéAPI v2:

```text
https://pokeapi.co/api/v2/pokemon/{nombre-o-id}/
```

Ejemplo:

```text
https://pokeapi.co/api/v2/pokemon/ditto/
```

La aplicación envía una petición `GET`, verifica `response.ok`, convierte la respuesta a JSON y representa los datos en la interfaz. Mimikyu también se puede consultar por nombre; internamente se resuelve usando su identificador `778`.

## Cómo ejecutar el proyecto

1. Abre la carpeta del proyecto en Antigravity.
2. Abre una terminal en esa carpeta.
3. Inicia un servidor local:

   ```powershell
   py -m http.server 5500
   ```

   Si el comando `py` no está disponible, prueba:

   ```powershell
   python -m http.server 5500
   ```

4. Abre [http://localhost:5500](http://localhost:5500) en el navegador.
5. Para detener el servidor, regresa a la terminal y presiona `Ctrl+C`.

Se necesita conexión a internet para consultar PokéAPI, cargar las ilustraciones de Pokémon y mostrar el logo.

## Pruebas manuales recomendadas

- Buscar `ditto` con `async/await` y revisar la ficha y las métricas.
- Buscar `pikachu` con `.then()` / `.catch()` y revisar la pestaña de código.
- Abrir la pestaña **Respuesta JSON** y observar los datos originales recibidos.
- Buscar un nombre inexistente y comprobar el estado HTTP `404` y el mensaje de error.

## Evidencias para la entrega

Se recomienda incluir capturas de:

- La estructura de archivos en Antigravity.
- Una búsqueda exitosa con la ficha y el estado HTTP `200`.
- El código `async/await` y el código con `.then()` / `.catch()`.
- La pestaña de respuesta JSON.
- Una búsqueda fallida que muestre el estado HTTP `404`.

## Créditos

- Datos e ilustraciones: [PokéAPI](https://pokeapi.co/).
- Logo: [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:English_Pok%C3%A9mon_logo.svg).

Proyecto educativo sin fines comerciales.
