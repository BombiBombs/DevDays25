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
## Entregables Nivel 2
