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
