import argparse
import cv2
import json
import sys

from pathlib import Path

from detection.detector import PersonDetector
from utils.geometry import bottom_center
from metrics.flow import FlowCounter
from metrics.dwell_time import DwellTimeCounter
from config import (
    FLOW_LINE_Y,
    FLOW_LINE_MARGIN,
)


# ==========================
# RUTAS DEL PROYECTO
# ==========================

BASE_DIR = Path(__file__).resolve().parent

MODEL_PATH = BASE_DIR / "yolo11n.pt"

OUTPUT_DIR = BASE_DIR / "output"

OUTPUT_PATH = OUTPUT_DIR / "metrics.json"


# ==========================
# ARGUMENTOS
# ==========================

parser = argparse.ArgumentParser(
    description="Procesamiento de video de PulsoVisual"
)

parser.add_argument(
    "video_path",
    help="Ruta del video que se desea procesar",
)

parser.add_argument(
    "--headless",
    action="store_true",
    help="Ejecuta el procesamiento sin abrir ventanas",
)

# ==========================
# ARGUMENTOS
# ==========================

parser.add_argument(
    "--flow-line-position",
    type=int,
    default=FLOW_LINE_Y,
    help="Posición de la línea horizontal de flujo",
)

parser.add_argument(
    "--flow-tolerance",
    type=int,
    default=FLOW_LINE_MARGIN,
    help="Margen de tolerancia alrededor de la línea",
)

args = parser.parse_args()


# ==========================
# CONFIGURACION DEL ANALISIS
# ==========================

flow_line_position = args.flow_line_position
flow_tolerance = args.flow_tolerance

args = parser.parse_args()


# ==========================
# CONFIGURACION DEL ANALISIS
# ==========================

flow_line_position = args.flow_line_position
flow_tolerance = args.flow_tolerance





# ==========================
# VIDEO DE ENTRADA
# ==========================

video_path = Path(args.video_path).resolve()

if not video_path.exists():
    raise FileNotFoundError(
        f"No se encontró el video: {video_path}"
    )

cap = cv2.VideoCapture(
    str(video_path)
)

if not cap.isOpened():
    raise RuntimeError(
        f"No se pudo abrir el video: {video_path}"
    )


# ==========================
# INFORMACION DEL VIDEO
# ==========================

fps = cap.get(
    cv2.CAP_PROP_FPS
)

width = int(
    cap.get(
        cv2.CAP_PROP_FRAME_WIDTH
    )
)

height = int(
    cap.get(
        cv2.CAP_PROP_FRAME_HEIGHT
    )
)

if fps <= 0:
    cap.release()

    raise RuntimeError(
        "No fue posible obtener los FPS del video"
    )


# ==========================
# INFORMACION DE DIAGNOSTICO
# ==========================

print(
    f"Video abierto correctamente: {video_path}",
    file=sys.stderr,
)

print(
    f"Resolución: {width} x {height}",
    file=sys.stderr,
)

print(
    f"Línea de flujo Y: {flow_line_position}",
    file=sys.stderr,
)

print(
    f"Tolerancia de flujo: {flow_tolerance}px",
    file=sys.stderr,
)

print(
    f"FPS: {fps}",
    file=sys.stderr,
)


# ==========================
# COMPONENTES PRINCIPALES
# ==========================

detector = PersonDetector(
    model_name=str(
        MODEL_PATH
    )
)

flow_counter = FlowCounter(
    flow_line_position,
    flow_tolerance,
)

dwell_counter = DwellTimeCounter(
    fps
)


# ==========================
# VARIABLES GENERALES
# ==========================

frame_number = 0

unique_ids = set()


# ==========================
# PROCESAMIENTO DEL VIDEO
# ==========================

try:

    while True:

        ret, frame = cap.read()

        if not ret:
            break

        frame_number += 1


        # ==========================
        # DETECCION Y TRACKING
        # ==========================

        tracks = detector.track(
            frame
        )


        # ==========================
        # PROCESAR TRACKS
        # ==========================

        for track in tracks:

            x1, y1, x2, y2 = track["box"]

            confidence = track["confidence"]

            track_id = track["id"]


            # ==========================
            # CONTEO DE IDS
            # ==========================

            unique_ids.add(
                track_id
            )


            # ==========================
            # CENTRO INFERIOR
            # ==========================

            px, py = bottom_center(
                track["box"]
            )


            # ==========================
            # PERMANENCIA
            # ==========================

            dwell_counter.update(
                track_id,
                frame_number,
            )

            dwell_time = dwell_counter.current_time(
                track_id,
                frame_number,
            )


            # ==========================
            # FLUJO
            # ==========================

            flow_counter.update(
                track_id,
                (px, py),
                frame_number,
            )


            # ==========================
            # DIBUJO SOLO EN MODO VISUAL
            # ==========================

            if not args.headless:

                # ==========================
                # BOUNDING BOX
                # ==========================

                cv2.rectangle(
                    frame,
                    (x1, y1),
                    (x2, y2),
                    (0, 255, 0),
                    2,
                )


                # ==========================
                # ID Y CONFIANZA
                # ==========================

                cv2.putText(
                    frame,
                    f"ID {track_id} - {confidence:.2f}",
                    (x1, y1 - 10),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.5,
                    (0, 0, 0),
                    4,
                )

                cv2.putText(
                    frame,
                    f"ID {track_id} - {confidence:.2f}",
                    (x1, y1 - 10),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.5,
                    (0, 255, 255),
                    2,
                )


                # ==========================
                # CENTRO INFERIOR
                # ==========================

                cv2.circle(
                    frame,
                    (px, py),
                    5,
                    (0, 0, 255),
                    -1,
                )


                # ==========================
                # TIEMPO DE PERMANENCIA
                # ==========================

                if dwell_time > 0:

                    cv2.putText(
                        frame,
                        f"{dwell_time:.1f}s",
                        (x1, y2 + 20),
                        cv2.FONT_HERSHEY_SIMPLEX,
                        0.5,
                        (0, 255, 255),
                        2,
                    )


        # ==========================
        # RESULTADOS DE FLUJO
        # ==========================

        flow_results = flow_counter.results()


        # ==========================
        # VISUALIZACION
        # ==========================

        if not args.headless:

            # ==========================
            # METRICAS EN PANTALLA
            # ==========================

            cv2.putText(
                frame,
                f"Arriba: {flow_results['up']}",
                (20, 30),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.7,
                (255, 255, 255),
                2,
            )

            cv2.putText(
                frame,
                f"Abajo: {flow_results['down']}",
                (20, 60),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.7,
                (255, 255, 255),
                2,
            )

            cv2.putText(
                frame,
                f"IDs unicos: {len(unique_ids)}",
                (20, 90),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.7,
                (255, 255, 255),
                2,
            )


            # ==========================
            # LINEA DE FLUJO
            # ==========================

            cv2.line(
                frame,
                (0, flow_line_position),
                (
                    frame.shape[1],
                    flow_line_position,
                ),
                (255, 0, 0),
                2,
            )


            # ==========================
            # LIMITES DE TOLERANCIA
            # ==========================

            cv2.line(
                frame,
                (
                    0,
                    flow_line_position - flow_tolerance,
                ),
                (
                    frame.shape[1],
                    flow_line_position - flow_tolerance,
                ),
                (255, 255, 0),
                1,
            )

            cv2.line(
                frame,
                (
                    0,
                    flow_line_position + flow_tolerance,
                ),
                (
                    frame.shape[1],
                    flow_line_position + flow_tolerance,
                ),
                (255, 255, 0),
                1,
            )


            # ==========================
            # AMPLIAR SOLO VISUALIZACION
            # ==========================

            display_frame = cv2.resize(
                frame,
                None,
                fx=2,
                fy=2,
                interpolation=cv2.INTER_NEAREST,
            )


            # ==========================
            # MOSTRAR VIDEO
            # ==========================

            cv2.imshow(
                "PulsoVisual - Tracking",
                display_frame,
            )

            if cv2.waitKey(1) & 0xFF == ord("q"):
                break


finally:

    # ==========================
    # CERRAR RECURSOS
    # ==========================

    cap.release()

    if not args.headless:
        cv2.destroyAllWindows()


# ==========================
# RESULTADOS FINALES
# ==========================

flow_results = flow_counter.results()

dwell_results = dwell_counter.results()

flow_events = flow_counter.events()


# ==========================
# DETALLE DE IDS
# ==========================

id_details = {}

for track_id in sorted(
    unique_ids
):

    dwell_detail = dwell_counter.details_for_id(
        track_id
    )

    flow_detail = flow_counter.events_for_id(
        track_id
    )

    if dwell_detail is None:
        continue

    id_details[str(track_id)] = {
        **dwell_detail,
        **flow_detail,
    }


# ==========================
# PERMANENCIA PROMEDIO
# ==========================

if dwell_results:

    average_dwell_time = (
        sum(
            dwell_results.values()
        )
        / len(
            dwell_results
        )
    )

else:

    average_dwell_time = 0


# ==========================
# CONSTRUIR JSON
# ==========================

metrics = {

    "conteo": {
        "ids_unicos_detectados":
            len(unique_ids)
    },

    "flujo": {
        "arriba":
            flow_results["up"],

        "abajo":
            flow_results["down"],

        "eventos":
            flow_events,
    },

    "permanencia": {
        "promedio_segundos":
            round(
                average_dwell_time,
                2,
            ),

        "tiempos_segundos":
            dwell_results,
    },

    "detalle_ids":
        id_details,
}


# ==========================
# CREAR CARPETA DE SALIDA
# ==========================

OUTPUT_DIR.mkdir(
    parents=True,
    exist_ok=True,
)


# ==========================
# GUARDAR METRICAS
# ==========================

with open(
    OUTPUT_PATH,
    "w",
    encoding="utf-8",
) as file:

    json.dump(
        metrics,
        file,
        indent=4,
        ensure_ascii=False,
    )


# ==========================
# SALIDA RESUMIDA PARA NESTJS
# ==========================

backend_result = {
    "detectedTrackCount":
        metrics["conteo"]["ids_unicos_detectados"],

    "flowUpCount":
        metrics["flujo"]["arriba"],

    "flowDownCount":
        metrics["flujo"]["abajo"],

    "averageDwellSeconds":
        metrics["permanencia"]["promedio_segundos"],
}

print(
    json.dumps(
        backend_result,
        ensure_ascii=False,
    )
)