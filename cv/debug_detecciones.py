
from pathlib import Path

import cv2
from ultralytics import YOLO

BASE_DIR = Path(__file__).resolve().parent
OUTPUT_DIR = BASE_DIR / "output"
OUTPUT_DIR.mkdir(exist_ok=True)

cap = cv2.VideoCapture(
    str(BASE_DIR / "input" / "sample-1.mp4")
)

segundo = 8
cap.set(cv2.CAP_PROP_POS_MSEC, segundo * 1000)
ok, frame = cap.read()
cap.release()

if not ok:
    raise RuntimeError("No se pudo leer el fotograma")

model = YOLO(str(BASE_DIR / "yolo11n.pt"))

pruebas = [
    ("original", 0.50, 640),
    ("confianza-035", 0.35, 640),
    ("resolucion-960", 0.35, 960),
]

for nombre, confianza, resolucion in pruebas:
    resultado = model.predict(
        frame,
        classes=[0],
        conf=confianza,
        imgsz=resolucion,
        verbose=False,
    )[0]

    archivo = OUTPUT_DIR / f"{nombre}-{segundo}s.jpg"
    cv2.imwrite(str(archivo), resultado.plot())

    print(f"{nombre}: {len(resultado.boxes)} detecciones")
