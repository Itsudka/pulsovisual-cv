# PulsoVisual — visión por computador

Esta capa transforma `input/sample.mp4` en `output/metrics.json` mediante detección de personas, seguimiento y cálculo de métricas. Consultar el [README general](../README.md) para la instalación completa y el contrato JSON.

## Inventario de archivos

| Archivo | Responsabilidad |
| --- | --- |
| `main.py` | Abre el video, crea detector y contadores, recorre frames, acumula IDs únicos, dibuja resultados y sobrescribe el JSON. Libera captura y ventanas al salir normalmente. |
| `config.py` | Define `FLOW_LINE_Y = 550` y `DWELL_ZONE = {x1: 400, y1: 400, x2: 900, y2: 700}` en píxeles del video original. |
| `detection/detector.py` | Clase `PersonDetector`: carga YOLO, invoca seguimiento persistente y devuelve tracks normalizados. |
| `tracking/tracker.py` | Archivo vacío; el seguimiento real está integrado en `PersonDetector`. |
| `metrics/counting.py` | Archivo vacío; el conteo real utiliza `unique_ids` en `main.py`. |
| `metrics/flow.py` | `FlowCounter`: posiciones Y anteriores y conjuntos de IDs ya contados por dirección. |
| `metrics/dwell_time.py` | `DwellTimeCounter`: entrada a zona por frame, tiempo en curso y última duración completada por ID. |
| `utils/geometry.py` | `bottom_center(box)` devuelve `int((x1+x2)/2), int(y2)`. |
| `input/sample.mp4` | Video de entrada pregrabado. Es un recurso binario; no se ejecutó ni se evaluó su contenido en esta revisión documental. |
| `yolo11n.pt` | Pesos binarios usados por defecto; no se entrenan desde este proyecto ni se inspeccionaron internamente. |
| `output/metrics.json` | Última instantánea persistida; incluye conteo, flujo y permanencia. Puede proceder de una ejecución anterior. |
| `README.md` | Documentación de esta capa. |

Los entornos virtuales y cachés son recursos generados, no componentes funcionales propios del MVP. No existe configuración local `botsort.yaml`: se solicita por nombre a Ultralytics.

## Instalación y ejecución

Desde `cv/`, con Python y soporte de ventanas disponible:

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install ultralytics opencv-python
New-Item -ItemType Directory -Path output -Force
.\.venv\Scripts\python.exe main.py
```

No hay versiones Python fijadas ni manifiesto de dependencias. Este procedimiento se deriva de los imports y no fue ejecutado como parte de la documentación. El script usa rutas relativas al directorio de trabajo; ejecutarlo desde otra carpeta puede impedir encontrar video, pesos o salida. `output/` debe existir, pues el programa no la crea.

## Configuración real

| Parámetro | Ubicación y valor |
| --- | --- |
| Video | `main.py`: `video_path = "input/sample.mp4"` |
| Pesos | Constructor de `PersonDetector`: `model_name="yolo11n.pt"` |
| Confianza mínima | Constructor de `PersonDetector`: `confidence=0.5` |
| Clase | `classes=[0]` en `model.track`, correspondiente a persona para los pesos utilizados |
| Seguimiento | `persist=True`, `tracker="botsort.yaml"`, `verbose=False` |
| Línea y zona | Constantes en `config.py`; no se escalan con la resolución |
| FPS | Leídos de `cv2.CAP_PROP_FPS`; no se sustituyen ni validan |
| Salida | `output/metrics.json`, UTF-8, indentación de cuatro espacios |

No existe interfaz de argumentos, variables de entorno ni controles web para cambiar estos valores. Para otros videos, el operador debe ajustar las rutas y coordenadas en el código en una tarea distinta a esta documentación.

## Algoritmo y contratos internos

`PersonDetector.track(frame)` devuelve una lista de objetos `{"id": int, "box": (x1,y1,x2,y2), "confidence": float}`. Descarta cajas sin ID, convierte coordenadas a enteros y conserva el estado del tracker entre frames. `main.py` añade cada ID a un conjunto durante toda la ejecución.

El centro inferior de cada caja alimenta las dos métricas. En la imagen, Y aumenta hacia abajo. `FlowCounter` registra un cruce hacia abajo cuando `previous_y < line_y <= y` y hacia arriba cuando `previous_y > line_y >= y`. La primera observación solo establece la posición previa. Un ID puede contar una vez por sentido; cruces repetidos en el mismo sentido no incrementan el contador. Si la posición previa está exactamente en la línea, el movimiento posterior no cumple por sí solo esas condiciones estrictas.

`DwellTimeCounter` considera dentro los bordes del rectángulo. Al entrar guarda el frame; al observar el mismo ID fuera calcula `(frame_salida - frame_entrada) / fps`. `current_time` sirve para la etiqueta en pantalla mientras está dentro. `results()` devuelve solo las duraciones completadas, sin redondearlas. Una segunda visita completada sustituye el valor anterior. El promedio del JSON se redondea a dos decimales.

## Entradas, salidas e integración

La entrada es el video local más los pesos y constantes. La salida visual es una ventana con cajas verdes, IDs y confianza, centro inferior rojo, línea azul, zona amarilla y contadores. No se guarda un video anotado.

La salida persistida es el [JSON documentado en la raíz](../README.md#formato-y-significado-de-las-métricas). El bloque de cálculo y escritura está dentro del `while`, después de la comprobación de `q`. Se sobrescribe por frame procesado que llega a ese bloque. Al alcanzar el final del video queda la última escritura; no hay una consolidación adicional fuera del bucle. Pulsar `q` deja fuera de la escritura el frame actual y puede dejar resultados parciales.

NestJS lee este mismo archivo al recibir `GET /analysis`. CV no realiza llamadas a la API y Angular no accede directamente al sistema de archivos. Se recomienda finalizar Python antes de consultar para evitar una lectura durante una escritura.

## Límites y comprobación

No hay pruebas automatizadas propias de CV. Para comprobar manualmente, observar un cruce por sentido, una entrada y salida de la zona, y comparar el JSON con el conteo manual del segmento. Un ID que no sale antes del final no aparece en permanencia. Los FPS cero pueden provocar división por cero; una desaparición no cierra una estancia y puede distorsionar su duración. Las excepciones no están protegidas con un bloque `finally` para garantizar limpieza.

El conteo es de IDs, no una identificación real. No hay reidentificación desarrollada por el proyecto, entrenamiento propio, seguimiento implementado en `tracking/tracker.py`, histórico ni procesamiento por lotes. Como mejoras futuras quedan fijar dependencias, validar FPS, acordar las reglas de permanencia y publicar el resultado de forma atómica, sin ampliar el MVP automáticamente.
