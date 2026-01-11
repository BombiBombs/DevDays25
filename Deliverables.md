# Entregables del Proyecto - DevDays 2025

Este documento contiene la lista completa de los entregables resueltos y cómo se han resuelto.

## Entregable Nivel 0

### N0-1: Proyecto base realizado en clase (con modificaciones propuestas terminadas).
**Descripción:**
* **Capa de Servicio (`user.service.js`):**  Desarrollo del método `updateUser`: Implementación de la lógica de negocio para localizar un usuario por su `ID` dentro de la lista almacenada en memoria y actualizar sus campos con la nueva información recibida.
* **Capa de Controlador (`user.controller.js`):**  Añadido el await new Promise(resolve => setTimeout(resolve, 100)); en getUsers. Implementación de la función `modifyUser`:
         Extracción del `id` desde los parámetros de la petición (`req.params`).
         Sincronización con el servicio enviando el `id` y los datos del cuerpo de la petición (`req.body`).
         **Gestión de Respuestas HTTP:**
             `200 OK`: Actualización exitosa.
             `400 Bad Request`: Control de errores cuando el `ID` proporcionado no existe en el sistema.
             `500 Internal Server Error`: Manejo de excepciones internas del servidor.
* **Validación de datos (`user.middleware.js`):** Añadido el máximo de caracteres `.isLength({ min: 3, max: 50 })`.
* **Capa de Rutas (`user.router.js`):**
    * Definición del endpoint mediante el método **PUT**: `userRouter.put('/users/:id',validateCreateUser, modifyUser);`, habilitando la actualización semántica de recursos, añadiendo tambien el middleware `validateCreateUser` proporcionado por el proyecto base.
## Entregables Nivel 1

### N1-1 Función recursiva: Paginación de datos de la API de GitHub.
**Descripción:**
* **Lógica de Extracción Masiva (`fetchAllGitHubData`):**
    * Función que gestiona peticiones asíncronas de forma iterativa, consolidando todas las issues en un único dataset global.
    * Soporte para tokens de autenticación para mitigar los límites de tasa (*rate limiting*).
* **Análisis de Cabeceras (`getNextPageUrl`):**
    * Función auxiliar especializada en el parseo del encabezado `Link` de la respuesta de GitHub.
    * Identificación del patrón `rel="next"` para automatizar la navegación entre las páginas de la API.
* **Refactorización de (`fetchGithubIssues`):**
    * Sustitución del método de carga simple por el sistema de paginación completa, garantizando que el dashboard trabaje con el 100% de la información del repositorio.

### N1-2 Creación de métricas personalizadas
**Descripción:**
#### 1. Definición de la Métrica
* **Nombre de la métrica:** `audit_issues_open_count`
* **Tipo:** **Gauge** (Instrumento de medida de estado).
* **Unidad:** Unidades enteras (issues).
* **Descripción:** Representa el número total de incidencias abiertas en un repositorio en el momento exacto de la auditoría.

#### 2. Uso del Gauge
A diferencia de un **Counter** , que es monótonamente creciente y solo sirve para acumular eventos, se ha seleccionado un **Gauge**. 
* **Comportamiento:** El Gauge permite medir un valor que puede aumentar o disminuir. En el contexto de GitHub, las issues se abren y se cierran; por tanto, un contador no reflejaría la realidad del "backlog" actual, mientras que el Gauge captura una **fotografía (snapshot)** del estado neto del sistema.
* **Instrumentación:** Se utiliza el método `.record()` lo que garantiza que cada nueva auditoría sobrescriba el valor anterior en Prometheus, reflejando fielmente si el equipo está resolviendo trabajo o acumulándolo.

#### 3. Identificación de Información Útil (Labels Dinámicos)
Para transformar un dato bruto en información accionable, se han instrumentado etiquetas (labels) que aportan contexto de negocio:

* **`repositorio`:** Identifica dinámicamente el proyecto auditado. El valor se extrae automáticamente procesando la URL de la issue (`issues[0].url.split('/')[3]`), permitiendo que la métrica sea agnóstica al proyecto.
* **`estadoSevero` (Umbral de Alerta):** Se ha definido un **Threshold (Umbral) de 20 bugs**. 
    * Si `issuesOpened > 20`, la métrica se etiqueta como `severo`.
    * En caso contrario, se etiqueta como `normal`.
### N1-3 Integración de proveedores IA.
**Descripción:**
Para llevar a cabo esto, se ha integrado **Ollama** como motor de inferencia local. Tras la instalación del software y el despliegue del modelo **Llama 3.2:1b** mediante consola, el sistema se comunica con el servicio `ollama.service.js`.
Esto permite usando la interfaz de la OpenAI que el chat sea con el modelo propuesto.
### N1-4 Bluejay frontend.
**Descripción:**
Para la capa de presentación, se ha integrado la librería **Recharts**, permitiendo transformar los datos brutos de la auditoría en gráficas de barras y métricas visuales intuitivas. Para habilitar la comunicación frontend-backend, se ha configurado el middleware **CORS** en el archivo `app.js` del backend, resolviendo los bloqueos de seguridad por origen cruzado entre el servidor y el cliente.

En el frontend, se ha desarrollado una arquitectura de visualización mediante la creación del componente `AuditDashboard.tsx` y el servicio `auditService`, que realiza un fetch de las auditorias de las issues. El directorio `/audit` implementa una gestión de estados de visualización en su archivo `page.tsx`, se renderiza la última auditoria realizada:
1. **Estado de Carga:** Una interfaz de espera optimizada para la experiencia de usuario.
2. **Estado de Error:** Un sistema de control que detecta fallos de conexión con el backend y ofrece la opción de reintentar la carga.
3. **Estado de Éxito:** El panel principal que renderiza el dashboard profesional, el cual incluye un **Gauge circular dinámico** para el ratio de cumplimiento, indicadores de métricas críticas (total de issues vs bugs detectados) y un listado detallado de evidencias con enlaces directos a GitHub.
## Entregables Nivel 2- Propuesta 2
### N2-P2-A Auditoría sobre datos meteorológicos.
### 1. Arquitectura de Datos (Mantenimiento de Weathers)

### Modelo: `weather.model.js`
Utiliza **Mongoose** para definir la estructura de los registros diarios:
* **city**: Nombre de la ubicación.
* **date**: Día del registro.
* **temperature**: Temperatura promedio del día en °C.
* **weatherStatus**: `String` (Estado del cielo parseado, ej: "Despejado", "Tormenta").
* **precipitationSum**: `Number` (Suma total de lluvia caida).
* **windSpeed**: `Number` (Velocidad máxima del viento en km/h).
* **cloudCoverage**: `Number` (Cobertura media de nubes en %).
### Repositorio: `weather.repository.js`
Gestiona el acceso a la base de datos con las siguientes funciones:
* `findAll`: Recupera todos los registros.
* `findByCityAndDate`: Busca un día específico.
* `findByCityAndInterval`: Filtra por rango de fechas.
* `findByCity`: Devuelve todo el histórico de una ciudad, ordenado cronológicamente (del más antiguo al más reciente).
* `create`: Para insertar nuevos registros.

---

## 2. Servicio de Weather (`weather.service.js`)

El proceso de recolección de datos se divide en tres fases:

### A. Geocodificación (`getCoordinates`)
Debido a que OpenMeteo requiere coordenadas, esta función auxiliar consulta:
`https://geocoding-api.open-meteo.com/v1/search`
* **Parámetros**: `name=ciudad`, `count=1`, `language=es`, `format=json`.
* **Retorno**: Latitud y Longitud.

### B. Captura de Datos (`fetchWeatherData`)
Llama a la API de histórico/previsión:
`https://api.open-meteo.com/v1/forecast`
* **Parámetros**: `latitude=latitud geógráfica`, `longitude=longitud geógráfica`, `start_date=fecha inicio`, `end_date= fecha fin`, `daily= dato solicitado diario: temperature_2m_mean,weather_code,precipitation_sum,wind_speed_10m_max,cloud_cover_mean`
* **Retorno**: Respuesta de la API en formato JSON.

### C. Persistencia (`saveWeathers`)
Como la API devuelve dos arrays paralelos (fechas y temperaturas). El servicio:
1.  Recorre ambos arrays mediante **bucles for**.
2.  Mapea los datos a objetos del modelo `Weather`.
3.  Los guarda en la base de datos a través del repositorio.

---

## 3. Sistema de Auditoría (`audit.service.js`)

La lógica de auditoría garantiza que solo se procesen **semanas completas (Lunes a Domingo)**.

### Lógica de Selección y Descarte: `auditWeathers`
1.  Se obtienen todos los registros de una ciudad mediante `findByCity`.
2.  **Sincronización**: Se utiliza un índice para verificar si el registro más antiguo es **Lunes**.
3.  Si no es lunes, el sistema **descarta** los días necesarios hasta encontrar el primer lunes.
4.  Solo si hay datos suficientes para completar bloques de los 7 días completos, se procede a la auditoría llamando a `performAudit` para cada semana.

### Ejecución: `performAudit`
Por cada semana completa, se crea un registro de auditoría con:
* **ID y Fecha de creación**: Generados automáticamente.
* **Cálculo de Media**: Promedio de las temperaturas de los 7 días.
* **Compliant**: `true` si la media es **> 18 °C**.
* **Metadata**: 
    * Ciudad
    * Rango de la semana (`weekRange`).
    * Temperatura media calculada.
    * Operación realizada: `"average temperature >18"`.
* **Evidencias**: Los 7 objetos completos de `weather` de esa semana.

---

## 4. Endpoints de la API

### Módulo Weather
| Método | Ruta | Función Controller | Descripción |
| :--- | :--- | :--- | :--- |
| **GET** | `/weather` | `getAllWeathers` | Lista todos los datos climáticos. |
| **POST** | `/weathers` | `fetchAndSaveWeathers` | Recoge datos de la API externa (Body: `city`, `start_date`, `end_date`). |

### Módulo Audit
| Método | Ruta | Función Controller | Descripción |
| :--- | :--- | :--- | :--- |
| **POST** | `/audits` | `auditWeathers` | Ejecuta la auditoría semanal de los weathers existentes (Body: `city`). |

---
### N2-P2-B Audio resumen del tiempo pasado con IA.

### 1. Arquitectura de Inteligencia Artificial
El sistema implementa un flujo de **Function Calling** diseñado para maximizar la precisión de los datos meteorológicos antes de su conversión a audio.



#### Selección de Modelos
* **Modelo de Lenguaje: `gpt-5-mini`**: Elegido por ser una versión más rápida y económica de GPT-5. Es ideal para tareas bien definidas e indicaciones precisas, como el procesamiento de herramientas (tools) y la generación de guiones estructurados.
* **Modelo de Voz: `gpt-4o-mini-tts`**: Para aplicaciones inteligentes en tiempo real, utilizamos este modelo por ser el más reciente y fiable en la conversión de texto a voz, garantizando una respuesta fluida y natural.

---

### 2. Definición de la Herramienta Maestro (Tools)
Para evitar "alucinaciones" de la IA en los cálculos estadísticos, se proporciona la herramienta `getWeatherAnalysis`.

* **Función**: Centraliza la recuperación de datos históricos en un solo mensaje para el modelo.
* **Parámetros**: `city`, `startDate`, `endDate`.
* **Respuesta Agregada**: La IA recibe un resumen que incluye temperatura media, lluvia total, ráfaga máxima de viento y cobertura nubosa media.

---

### 3. Lógica de Servicio y Procesamiento de Datos
El servicio `weather.service.js` proporciona los datos reales para la IA, garantizando la integridad de la información mediante:
* **Agregación Estadística**: Cálculo de promedios para nubosidad y temperatura, y selección de máximos para el viento y sumas para la lluvia.

---

### 4. Flujo de Generación y Almacenamiento de Audio

### Persona y Estilo
Se inyectan instrucciones de sistema para que la IA actúe como un **presentador de noticias del clima**. El modelo procesa los datos y genera un guion natural en español, evitando anglicismos.

### Persistencia de Archivos
* **Generación**: El modelo `gpt-4o-mini-tts` procesa el guion y devuelve un buffer binario.
* **Almacenamiento**: El archivo se guarda en la ruta `./uploads/audios/` con un nombre dinámico: `${ciudad.toLowerCase()}-${Date.now()}.mp3`.
* **Respuesta**: El endpoint sirve el buffer directamente al cliente con el `Content-Type: audio/mpeg`.

---

### 5. Endpoints de la API

| Método | Ruta | Función Controller | Descripción |
| :--- | :--- | :--- | :--- |
| **POST** | `/ai/weather` | `generateAIResponseWeather` | Genera y sirve un archivo de audio .mp3 con el resumen climático de los últimos 7 días. |

**Ejemplo de Prompt en el Body:**
```json
{
  "prompt": "Dime que tiempo ha hecho esta última semana en Sevilla"
}
```
### N2-P2-C Instrumentación y Medición de Tiempos de Respuesta de la API Weather

#### 1. Instrumentación Granular (Capa de Servicio y DB)
A diferencia de una medición superficial, se ha instrumentado la aplicación para obtener visibilidad interna de los posibles cuellos de botella. La métrica `endpointDuration` captura latencias en tres niveles de profundidad:

* **Nivel de Controlador:** Mide el tiempo total de ciclo de vida de la petición en el endpoint `fetchAndSaveWeathers`.
* **Nivel de Servicio (APIs Externas):** Se han integrado medidores dentro de la lógica de negocio para supervisar cuánto tarda exactamente la API de Open-Meteo (`fetchWeatherAPI`) y el servicio de geocodificación (`api_geocoding`) para cada petición individual.
* **Nivel de Persistencia (Base de Datos):** Se mide el tiempo de ejecución del proceso `database_save` al verificar y persistir los registros en MongoDB.

#### 2. Exposición y Naturaleza de las Métricas
* **Endpoint de Métricas:** Los datos recolectados por OpenTelemetry son expuestos en tiempo real en `http://localhost:9464/metrics` .
* **Uso de Histogramas:** Se han implementado **Histogramas** para las métricas de duración. A diferencia de un contador, el histograma permite agregar múltiples peticiones y realizar cálculos estadísticos (como la suma de tiempos frente al conteo total), lo cual es fundamental para calcular medias de latencia precisas.

#### 3. Configuración de Infraestructura y Contenedores
Para habilitar el ecosistema de monitorización, se han realizado las siguientes acciones en la infraestructura:

* **Archivo `prometheus.yml`:** Se ha creado este archivo con el fin de definir los "scrape targets". Es el componente que le indica a Prometheus de qué dirección y puerto (en este caso, el exportador de nuestra app en el 9464) debe extraer las métricas periódicamente.
* **Actualización de `docker-compose-local.yml`:** Se ha modificado el manifiesto de infraestructura para desplegar automáticamente las imágenes de **Prometheus** y **Grafana**. Esto permite que el stack de observabilidad corra de forma nativa junto a la aplicación.

#### 4. Visualización Avanzada en Grafana
En Grafana, se ha configurado la fuente de datos (DataSource) apuntando a `http://prometheus:9090`. Utilizando un script de dashboard personalizado, se han habilitado las siguientes herramientas de análisis:

* **Búsqueda Dinámica por Ciudad:** El auditor puede escribir o seleccionar cualquier ciudad para filtrar los datos. El dashboard se actualiza automáticamente gracias al uso de variables dinámicas basadas en las etiquetas de las métricas.
* **Desglose de Tiempo por Paso:** Un gráfico de series temporales que permite visualizar por separado cuánto tiempo consume la API, la base de datos o el controlador, facilitando la identificación de la causa raíz de una lentitud.
* **Estado de Alerta (Umbrales):** Un panel de tipo **Gauge** que monitoriza el tiempo medio. Se han definido umbrales visuales: verde para rendimiento óptimo, naranja para degradación y rojo si se supera el umbral crítico de 1 segundo (1000ms).
* **Métricas de Volumen:** Un panel estadístico que contabiliza el total de peticiones procesadas por ciudad, permitiendo correlacionar el aumento de latencia con picos de tráfico.
---

## Retos extra
### N2-Ex-1 Hacer que la IA devuelva una respuesta estructurada en formato JSON.
### 1. Definición del Esquema de Salida (Zod)
Para garantizar que la IA devuelva siempre un JSON con una estructura predecible y válida, se ha implementado un esquema de validación utilizando la librería **Zod**.
Creamos un objeto de tipo z.object llamado `umlZodSchema` con el siguiente esquema.
* **Clases**: Un array de objetos que contienen el nombre de la clase, una lista de atributos y una lista de métodos.
* **Relaciones**: Un array de objetos que definen el origen (`from`), el destino (`to`) y el tipo de relación.
* **Tipos de Relación**: Restringidos mediante un **Enum** de Zod a los valores: `inheritance`, `composition`, `aggregation` y `association`.

---

### 2. Servicio de Procesamiento (`openai.service.js`)
La función `generateJsonFromUML` utiliza la capacidad de **Structured Outputs** de OpenAI mediante el método `responses.parse`. A diferencia de una respuesta de texto común, este método fuerza a la IA a seguir el esquema definido.

* **Modelo**: `gpt-5-mini` (Seleccionado por su alta eficiencia en tareas de lógica estructurada y bajo coste).
* **Instrucciones**: Se le pide a la IA que procese el texto (PlantUML o Mermaid) y que limpie los datos eliminando los símbolos de visibilidad (como el `+` o el `-`) de los atributos y métodos para obtener un JSON más limpio.

---

### 3. Lógica del Controlador y Validación
El controlador `generateAIJsonFromUMLResponse` es el encargado de recibir el prompt con el código UML y devolver la respuesta parseada al cliente.

* **Entrada**: Código en texto plano (ej: `class Car { +String brand }`).
* **Transformación**: La IA identifica semánticamente qué es una clase y qué es una relación, mapeándolo al esquema de Zod.
* **Salida**: Un objeto JSON estructurado que puede ser consumido por otras herramientas o frontends de modelado.

---

### 4. Especificación del Endpoint

| Método | Ruta | Función Controller | Descripción |
| :--- | :--- | :--- | :--- |
| **POST** | `/ai/uml-to-json` | `generateAIJsonFromUMLResponse` | Transforma un diagrama UML en texto plano a una estructura JSON organizada y validada. |

**Ejemplo de entrada (Body):**
```json
{
  "prompt": "class Persona { +String nombre \n +hablar() } class Estudiante extends Persona"
}
```
### N2-Ex-1 Visualización y frontend sobre datos de auditoría.

#### 1. Librerías Especializadas para la Auditoría
Para cumplir con los estándares de visualización técnica, se han integrado librerías líderes en el ecosistema React:

* **Recharts (Visualización de Datos):** Es el núcleo analítico del frontend. Permite transformar los JSON de la auditoría en gráficas interactivas.
* **Lucide React (Iconografía Semántica):** Aporta la capa de coherencia visual mediante iconos vectoriales (viento, humedad, nubes, alertas). Ayuda a que el auditor identifique rápidamente el tipo de evidencia meteorológica sin necesidad de leer etiquetas de texto extensas.
* **Dayjs (Gestión Temporal):** Utilizada para el tratamiento de fechas del histórico de 4 semanas. Permite la localización al español de los días de la semana y asegura que el rango de auditoría (Lunes a Domingo) se muestre correctamente al usuario.

#### 2. Arquitectura de Componentes
Se ha diseñado el frontend siguiendo principios de responsabilidad única para garantizar un código mantenible y escalable:

* **Componentización:** La interfaz se fragmenta en componentes especializados (`CitySearch`, `WeatherAuditDashboard`, `AuditDropdown`) que se comunican de forma asíncrona mediante callbacks.
* **Separación de Lógica:** Las llamadas a la API y el procesamiento de fechas (Lunes a Domingo) se gestionan a través de un servicio independiente (`lib/weatherService.ts`).

#### 2. Búsqueda Dinámica y Flexibilidad de Localización
El sistema ha sido diseñado para ser totalmente dinámico y no estar limitado a una ubicación predefinida:

* **Auditoría Bajo Demanda:** A través del componente de búsqueda, el usuario puede introducir el nombre de **cualquier ciudad**. 
* **Flujo en Tiempo Real:** Al introducir una ciudad, el sistema dispara un flujo completo que incluye la captura de datos históricos desde Open-Meteo, el almacenamiento en la base de datos y la ejecución de la lógica de auditoría para las últimas 4 semanas completas de dicha localización.

#### 3. Visualización y Exposición de Datos
La interfaz utiliza herramientas visuales de **Recharts** para exponer los resultados de la auditoría de forma técnica:

* **Radial Gauge (Promedio Semanal):** * Representa la media térmica de la semana seleccionada con precisión de un decimal.
    * El anillo del gauge cambia dinámicamente de color (**Verde** para sistemas conformes, **Rojo** para críticos) basándose en el booleano `compliant` de la base de datos.
* **Bar Chart (Evolución Diaria):** * Muestra las temperaturas de los 7 días de la semana.
    * **Umbral Crítico:** Se ha integrado una `ReferenceLine` fija en los **18°C**, lo que permite identificar visualmente de forma instantánea qué días fallaron la auditoría técnica.
    * **Eje Y de Referencia:** Se ha habilitado un eje vertical con unidades de medida y etiquetas de datos sobre cada barra para una lectura exacta de los grados.

#### 4. Coherencia Visual y Estilo
* **Estética de Auditoría:** El diseño utiliza una paleta de colores técnica (Zinc/Dark) con un encabezado fijo y efectos de desenfoque (*backdrop-blur*) que emulan un dashboard de monitorización profesional.
* **Diseño Responsive:** Uso de una rejilla adaptativa (`grid-cols-1 md:grid-cols-3`) que asegura la correcta visualización de las gráficas tanto en monitores de escritorio como en dispositivos móviles.
