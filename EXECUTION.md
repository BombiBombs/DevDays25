##  Nivel 0 y Nivel 1 (Base y Extensiones)

### N0 / N1-1 / N1-2: Lógica de Backend y Persistencia
Para estos entregables, el foco es exclusivamente la API y la base de datos.
* **Backend:** Ejecutar `npm run dev` en la terminal.
* **Base de Datos:** Tener activo el contenedor de **MongoDB** en Docker Desktop.
* **Acceso:** Las peticiones se realizan a los endpoints definidos en `http://localhost:3000/api/v1`.

### N1-3: Integración de Inteligencia Artificial (IA)
Requiere el motor de inferencia local configurado.
1. **Instalación:** Tener instalado [Ollama](https://ollama.com/).
2. **Modelo:** Ejecutar en la terminal: `ollama pull llama3.2:1b`.
3. **Ejecución:** Con el backend y el contenedor de Mongo encendidos, el endpoint de chat estará disponible en:
   `http://localhost:3000/api/v1/ai/chat`

### N1-4: Interfaz de Usuario (Frontend)
Sincronización completa entre capas.
* **Frontend:** Ejecutar `npm run dev` (Puerto 3001 por defecto).
* **Backend:** Ejecutar `npm run dev` (Puerto 3000).
* **Base de Datos:** Contenedor de MongoDB activo.

---

##  Nivel 2: Infraestructura y Métricas

### N2-P2-A / N2-P2-B: Gestión de Datos
* **Backend:** Ejecutar `npm run dev` en la terminal.
* **Base de Datos:** Tener activo el contenedor de **MongoDB** en Docker Desktop.
* **Acceso:** Las peticiones se realizan a los endpoints definidos en `http://localhost:3000/api/v1`.

### N2-P2-C: Monitorización con Prometheus y Grafana
Uso del stack de observabilidad para análisis de métricas.
1. **Infraestructura:** Encender el contenedor/stack de **Infrastructure** desde Docker.
2. **Generación de datos:** Realizar peticiones al backend (`http://localhost:3000/api/v1`) para generar tráfico.
3. **Métricas (Prometheus):** El recolector de datos está disponible en `http://localhost:9090`.
4. **Visualización (Grafana):** Acceder al panel de control en `http://localhost:3003`. Grafana está configurado para consumir y visualizar los datos recolectados por Prometheus..

---

##  Entregables Extras
### N2-Ex-1: Gestión de Datos
* **Backend:** Ejecutar `npm run dev` en la terminal.
* **Base de Datos:** Tener activo el contenedor de **MongoDB** en Docker Desktop.
* **Acceso:** Las peticiones se realizan a los endpoints definidos en `http://localhost:3000/api/v1`.

### N2-Ex-3: Full Stack Dashboard
* **Frontend:** Ejecutar `npm run dev`.
* **Backend:** Ejecutar `npm run dev`.
* **Base de Datos:** Contenedor de MongoDB activo.
