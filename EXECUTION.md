Para lanzar cada contenedor hay que hacer el build del contenedor del backend con `devdays-app con docker build -t devdays-app:latest .` en la terminal de \2025_WORKSHOP y luego hacer el build de la infraestructura entera con `docker compose -f docker-compose-local.yml up --build` en la ruta de \infraestructure.
* El backend se aloja en `http://localhost:3000`
* El frontend en `http://localhost:8080`
* La base de datos en `http://localhost:27017/isadevdays2025`
* Prometheus se exponen sus metricas en `http://localhost:9464/metrics` y la base de datos suya en `http://localhost:9090/query`
* Grafana se encuentra en `http://localhost:3003`
##  Nivel 0 y Nivel 1 (Base y Extensiones)
## N0
Para probar endpoint hacer llamada POST `http://localhost:3000/api/v1/users/:userId` en el cuerpo en formato JSON marcar el campo que se quiere modificar del user
## N1-1
Se prueba el endpoint usando un POST a `http://localhost:3000/api/v1/issues/fetch` poniendo de cuerpo:``` {
    "repository": {
        "owner": "glzr-io",
        "name": "glazewm"
    }
}``` Y se comprueba la inmensa cantidad de issues recopiladas
## N1-2
Al hacer el audit de las issues con POST `http://localhost:3000/api/v1/audits/issues` se vera en los logs del backend esta nueva metrica(gauge)
## N1-3
Tener instalado [Ollama](https://ollama.com/), ejecutar en la terminal: `ollama pull llama3.2:1b`. probar el endpoint POST `http://localhost:3000/api/v1/ai/chat` con cuerpo: ```json {"prompt": "Hola, que modelo eres?"}
## N1-4
Acceder desde el navegador a `http://localhost:8080/audit` 
## N2-P2-A
* endpoint GET `http://localhost:3000/api/v1/weathers`para obtener todos los weathers,
* endpoint POST `http://localhost:3000/api/v1/weathers`  Body: `city`, `start_date`, `end_date` y se obtienen los datos del weather concretos,
* endpoint POST  `http://localhost:3000/api/v1/audits` ejecuta la auditoría semanal de los weathers existentes Body: `city` 
* endpoint GET `http://localhost:3000/api/v1/audits/city/:ciudad` encuentra las auditorias de dicha ciudad segun el parametro de la peticion.
## N2-P2-B
POST	`http://localhost:3000/api/v1/ai/weather`	genera y sirve un archivo de audio .mp3 con el resumen climático Body:
```json
{
  "prompt": "Dime que tiempo ha hecho esta última semana en Sevilla"
}
```
## N2-P2-C
En Grafana, se ha configurado la fuente de datos (DataSource) apuntando a http://prometheus:9090. Utilizando un script de dashboard personalizado, que se importa dicho JSON que se encuentra en el proyecto.
## N2-Ex-1
endpoint POST	`http://localhost:3000/api/v1/ai/uml-to-json`	Transforma un diagrama UML en texto plano a una estructura JSON organizada y validada.
Body:
```json
{
  "prompt": "class Persona { +String nombre \n +hablar() } class Estudiante extends Persona"
}
```
## N2-Ex-3
Entrar desde un navegador a `http://localhost:8080/weatherAudit` introduces la ciudad de la que quieres la informacion de las ultimas 4 semanas y se hace automaticamente la auditoria y se muestra en pantalla
