import json


# ==========================
# RESULTADO DE PRUEBA
# ==========================

result = {
    "detectedTrackCount": 29,
    "flowUpCount": 8,
    "flowDownCount": 8,
    "averageDwellSeconds": 16.26,
}


# ==========================
# SALIDA PARA NESTJS
# ==========================

print(json.dumps(result))                                                                                                                             