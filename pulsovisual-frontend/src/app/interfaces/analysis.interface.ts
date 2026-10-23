export interface AnalysisMetrics {
  conteo: {
    ids_unicos_detectados: number;
  };

  flujo: {
    arriba: number;
    abajo: number;
  };

  permanencia: {
    promedio_segundos: number;
    tiempos_segundos: Record<string, number>;
  };
}
