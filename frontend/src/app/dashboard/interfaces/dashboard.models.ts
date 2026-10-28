// ==========================
// RESUMEN GENERAL
// ==========================

export interface DashboardSummary {
  sectorsRegistered: number;
  activeSectors: number;
  totalAnalyses: number;
  completedAnalyses: number;
  detectedTrackCount: number;
  averageDwellSeconds: number;
}


// ==========================
// ACTIVIDAD POR FECHA
// ==========================

export interface DashboardActivity {
  date: string;
  detectedTrackCount: number;
}


// ==========================
// ACTIVIDAD POR SECTOR
// ==========================

export interface DashboardSector {
  sectorId: number;
  sectorName: string;
  analysisCount: number;
  detectedTrackCount: number;
  averageDwellSeconds: number;
}


// ==========================
// ACTIVIDAD POR HORA
// ==========================

export interface DashboardHourlyItem {
  hour: number;
  detectedTrackCount: number;
  analysisCount: number;
}


// ==========================
// RESPUESTA HORARIA
// ==========================

export interface DashboardHourly {
  hourlyActivity: DashboardHourlyItem[];
  peakHour: DashboardHourlyItem | null;
  valleyHour: DashboardHourlyItem | null;
}
