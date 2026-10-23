# PulsoVisual — MVP académico

PulsoVisual analiza un video pregrabado para obtener IDs únicos detectados, flujo direccional y permanencia en una zona. El objetivo del MVP es demostrar la integración de visión por computador, una API y un panel web. Las métricas describen el seguimiento del video; no identifican personas reales.

Documentación basada en los archivos del proyecto revisados el 13 de octubre de 2026. No se modificó código funcional. Las instrucciones de ejecución se derivan del código y no constituyen una ejecución validada del sistema en este equipo.

## Arquitectura y flujo de datos

```text
cv/input/sample.mp4 + cv/yolo11n.pt
              ↓
Python: OpenCV → YOLO11n + BoT-SORT
              ↓
IDs únicos + cruces de línea + permanencia en zona
              ↓
cv/output/metrics.json
              ↓ lectura local por petición
NestJS: GET http://localhost:3000/analysis
              ↓ HTTP/JSON
Angular: http://localhost:4200
              ↓
Tarjetas de métricas y tabla de permanencia por ID
```

Python se ejecuta manualmente, en un proceso independiente. NestJS no lanza Python ni recibe videos: lee el archivo generado. Angular realiza una petición al inicializarse; para consultar un análisis nuevo se recarga la página. No existe transmisión de video a la interfaz.

## Estructura y tecnologías

| Carpeta | Responsabilidad | Documentación |
| --- | --- | --- |
| `cv/` | Procesamiento del video, seguimiento, métricas y JSON | [README de CV](cv/README.md) |
| `pulsovisual-backend/` | Lectura del JSON y exposición HTTP | [README del backend](pulsovisual-backend/README.md) |
| `pulsovisual-frontend/` | Consulta y presentación de métricas | [README del frontend](pulsovisual-frontend/README.md) |

CV utiliza Python, OpenCV y Ultralytics con pesos `yolo11n.pt` y configuración `botsort.yaml` de Ultralytics. No existe un archivo de dependencias Python ni versiones fijadas. El backend declara NestJS 11, TypeScript y RxJS; el frontend Angular 21.2, TypeScript y RxJS. Los archivos `package-lock.json` fijan las dependencias JavaScript: en la revisión, NestJS core 11.2.7, Angular core 21.2.25 y Angular CLI 21.2.26. Jest/Supertest y Vitest son las herramientas de pruebas declaradas en las capas respectivas.

## Requisitos e instalación

Se requiere una sesión de escritorio para la ventana de OpenCV, Python con `pip` y `venv`, Node.js y npm. El repositorio no declara una versión mínima de Python. El requisito de Node de Angular en el lockfile es `^20.19.0 || ^22.12.0 || >=24.0.0`; NestJS requiere `>=20`. El frontend declara `npm@11.18.0` como gestor. Utilizar una combinación compatible con esos requisitos.

Mantener las tres carpetas como hermanas: el backend depende de esa ubicación. Ejemplo de instalación desde PowerShell, situado inicialmente en la raíz del repositorio:

```powershell
cd cv
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install ultralytics opencv-python
cd ..\pulsovisual-backend
npm ci
cd ..\pulsovisual-frontend
npm ci
```

La instalación Python anterior se deduce de los imports; no reproduce versiones históricas del desarrollo. No se incluye un `requirements.txt`. Las dependencias adicionales del seguimiento dependen de la versión de Ultralytics instalada. No usar una distribución de OpenCV exclusivamente headless porque el programa utiliza `imshow`.

## Ejecución completa

1. En una terminal situada en la raíz, ejecutar el análisis:

   ```powershell
   cd cv
   New-Item -ItemType Directory -Path output -Force
   .\.venv\Scripts\python.exe main.py
   ```

   Deben existir `input/sample.mp4` y `yolo11n.pt`. La ventana muestra cajas, IDs, confianza, línea de flujo, zona y contadores. Esperar al final del video para obtener el análisis completo; `q` interrumpe el procesamiento.

2. En otra terminal situada en la raíz, iniciar la API:

   ```powershell
   cd pulsovisual-backend
   npm run start:dev
   ```

3. En otra terminal situada en la raíz, iniciar el panel:

   ```powershell
   cd pulsovisual-frontend
   npm start
   ```

4. Abrir `http://localhost:4200`. Para comprobar el JSON directamente:

   ```powershell
   Invoke-RestMethod http://localhost:3000/analysis | ConvertTo-Json -Depth 5
   ```

El backend usa `PORT` o 3000. Su CORS admite `http://localhost:4200` y Angular tiene fijada la URL `http://localhost:3000/analysis`. Cambiar un puerto requiere mantener esas configuraciones alineadas; no hay configuración compartida ni carga de `.env` implementada en el código revisado.

## Formato y significado de las métricas

Ejemplo existente en `cv/output/metrics.json` durante la revisión; no es un resultado nuevo generado por esta documentación:

```json
{
  "conteo": { "ids_unicos_detectados": 5 },
  "flujo": { "arriba": 2, "abajo": 2 },
  "permanencia": {
    "promedio_segundos": 8.26,
    "tiempos_segundos": { "1": 8.96, "5": 7.56 }
  }
}
```

| Campo | Interpretación exacta |
| --- | --- |
| `conteo.ids_unicos_detectados` | Cantidad de IDs distintos entregados por el tracker durante los frames procesados; no es ocupación instantánea ni garantía de personas distintas. |
| `flujo.arriba` | IDs que cruzaron desde una coordenada Y mayor hacia la línea o por encima de ella; cada ID se cuenta como máximo una vez en esa dirección. |
| `flujo.abajo` | IDs que cruzaron desde una coordenada Y menor hacia la línea o por debajo de ella; cada ID se cuenta como máximo una vez en esa dirección. |
| `permanencia.tiempos_segundos` | Última estancia completada por ID, calculada con diferencia de frames dividida por FPS. Las claves JSON son cadenas. |
| `permanencia.promedio_segundos` | Media de las estancias almacenadas, redondeada a dos decimales; 0 si no existen salidas registradas. |

Un ID puede contar una vez en cada sentido. La permanencia usa el centro inferior de la caja y una zona rectangular con bordes incluidos. No suma visitas repetidas: una salida posterior del mismo ID sobrescribe su duración anterior. El promedio no incluye a quienes nunca entraron o permanecen dentro al terminar.

## Limitaciones verificadas del MVP

- Un video, una línea horizontal y una zona rectangular, configurados en código; sin carga de videos ni selección de zonas desde el panel.
- Los IDs pueden fragmentarse o cambiar con oclusiones y pérdidas de seguimiento. No existe validación cuantitativa de exactitud en el repositorio.
- El JSON se sobrescribe dentro del bucle de frames, después de comprobar `q`; no se escribe exclusivamente al final. Interrumpir con `q` omite la escritura del frame actual. Si no se procesa ningún frame o hay un fallo previo, puede conservarse un JSON anterior.
- La escritura no es atómica: consultar durante el procesamiento puede producir una lectura incompleta y un error 500. Para la demostración, terminar el análisis antes de consultar.
- Las estancias abiertas no se cierran al finalizar ni al desaparecer un ID. Una pérdida temporal del mismo ID puede incluir frames sin observación en la duración. No hay validación de FPS cero.
- No hay histórico, base de datos, autenticación, streaming, múltiples cámaras, gráficas ni actualización automática del dashboard.
- Las interfaces TypeScript no validan el JSON en ejecución. El archivo no contiene fecha, nombre de video, FPS ni versión del esquema.
- Las pruebas existentes no cubren el flujo académico completo. La prueba de título de Angular sigue esperando el texto inicial del generador y su preparación no proporciona el cliente HTTP requerido.

## Verificación manual y resolución de problemas

Comprobar que el JSON se actualiza después de procesar un video; comparar sus valores con `GET /analysis` y con las tarjetas y filas de Angular. Revisar visualmente cruces y entradas/salidas en un segmento con conteo manual antes de atribuir exactitud al MVP.

| Síntoma | Qué revisar |
| --- | --- |
| `No se pudo abrir el video` | Ejecutar desde `cv/`; verificar ruta, archivo y compatibilidad del video. |
| Error al guardar métricas | Existencia de `cv/output/` y permiso de escritura. |
| Ventana OpenCV no disponible | Sesión gráfica y paquete OpenCV con soporte de ventanas. |
| API 404 en `/analysis` | Generar el JSON e iniciar NestJS desde su propia carpeta. |
| API 500 | JSON válido, permisos y ausencia de escritura simultánea. |
| Panel muestra error | API activa, URL/puerto y origen CORS exactos. |
| Panel muestra valores anteriores | Esperar el análisis, verificar el JSON y recargar el navegador. |

## Próximos pasos — no implementados

1. Fijar dependencias Python y validar el MVP con videos y anotaciones manuales, documentando errores de conteo, flujo y permanencia.
2. Definir cómo tratar visitas repetidas, estancias abiertas y pérdida de IDs; añadir pruebas de esas reglas.
3. Mejorar el cierre del procesamiento y la publicación del JSON, validar su esquema y registrar metadatos del análisis.
4. Actualizar las pruebas del dashboard y cubrir errores de lectura en la API.
5. Añadir gráficas sencillas a partir de las métricas disponibles, manteniendo el alcance académico.

Streaming, múltiples cámaras, usuarios e históricos requerirían ampliar explícitamente el alcance; no son capacidades actuales ni requisitos asumidos para completar este MVP.
