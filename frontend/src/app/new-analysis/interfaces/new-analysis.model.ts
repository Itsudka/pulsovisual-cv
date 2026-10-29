// ==========================
// DATOS PARA PROCESAR ANALISIS
// ==========================

export interface ProcessAnalysisRequest {
  video: File;

  sectorId: number;

  name: string;

  recordedAt: string;

  flowLineOrientation: 'HORIZONTAL';

  flowLinePosition: number;

  flowTolerancePx: number;
}


// ==========================
// SECTOR DEL ANALISIS
// ==========================

export interface AnalysisSector {
  id: number;

  userId: number;

  name: string;

  description: string | null;

  type: string;

  status: string;
}


// ==========================
// METRICAS
// ==========================

export interface AnalysisMetric {
  id: number;

  analysisId: number;

  detectedTrackCount: number;

  flowUpCount: number;

  flowDownCount: number;

  averageDwellSeconds: number | string;

  createdAt: string;
}


// ==========================
// ANALISIS PROCESADO
// ==========================

export interface ProcessedAnalysis {
  id: number;

  sectorId: number;

  name: string;

  recordedAt: string;

  originalFilename: string;

  videoDurationSeconds:
    number | string | null;

  status:
    | 'PENDING'
    | 'PROCESSING'
    | 'COMPLETED'
    | 'FAILED';

  flowLineOrientation:
    'HORIZONTAL';

  flowLinePosition: number;

  flowTolerancePx: number;

  processedAt: string | null;

  createdAt: string;

  updatedAt: string;

  sector: AnalysisSector;

  metric: AnalysisMetric | null;
}

// ==========================
// DATOS DEL FORMULARIO
// ==========================

export interface AnalysisFormData {
  name: string;
  sectorId: number;
  date: string;
  time: string;
}
