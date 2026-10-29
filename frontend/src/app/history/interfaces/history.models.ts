// ==========================
// ESTADOS
// ==========================

export type AnalysisStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED';


// ==========================
// SECTOR
// ==========================

export interface HistorySector {
  id: number;
  name: string;
}


// ==========================
// METRICA
// ==========================

export interface HistoryMetric {
  id: number;
  detectedTrackCount: number;
  flowUpCount: number;
  flowDownCount: number;
  averageDwellSeconds: number | string;
}


// ==========================
// ANALISIS
// ==========================

export interface HistoryAnalysis {
  id: number;

  sectorId: number;

  name: string;

  recordedAt: string;

  originalFilename: string;

  videoDurationSeconds:
    number | string | null;

  status: AnalysisStatus;

  flowLineOrientation: string;

  flowLinePosition: number;

  flowTolerancePx: number;

  processedAt: string | null;

  createdAt: string;

  updatedAt: string;

  sector?: HistorySector;

  metric?: HistoryMetric | null;
}


// ==========================
// FILTROS
// ==========================

export interface HistoryFilters {
  sectorId?: number;

  status?: AnalysisStatus;

  dateFrom?: string;

  dateTo?: string;
}


// ==========================
// RESUMEN
// ==========================

export interface HistorySummary {
  totalAnalyses: number;
  registeredSectors: number;
  completedAnalyses: number;
}
