// ==========================
// SECTOR
// ==========================

export interface Sector {
  id: number;
  userId: number;
  name: string;
  description: string | null;
  type: SectorType;
  status: SectorStatus;
  createdAt: string;
  updatedAt: string;
}


// ==========================
// TIPOS
// ==========================

export type SectorType =
  | 'ENTRADA_SALIDA'
  | 'PASILLO'
  | 'CAJAS'
  | 'OTRO';


// ==========================
// ESTADOS
// ==========================

export type SectorStatus =
  | 'ACTIVE'
  | 'IN_REVIEW'
  | 'INACTIVE';


// ==========================
// CREAR SECTOR
// ==========================

export interface CreateSectorRequest {
  name: string;
  description?: string;
  type: SectorType;
}


// ==========================
// ACTUALIZAR SECTOR
// ==========================

export interface UpdateSectorRequest {
  name?: string;
  description?: string;
  type?: SectorType;
  status?: SectorStatus;
}

// ==========================
// ANALITICA DE SECTOR
// ==========================

export interface SectorAnalytics {
  sectorId: number;
  sectorName: string;
  analysisCount: number;
  detectedTrackCount: number;
  averageDwellSeconds: number;
}


// ==========================
// RESUMEN DE SECTORES
// ==========================

export interface SectorSummary {
  registeredSectors: number;
  associatedAnalyses: number;
  activeSectors: number;
  averageDwellSeconds: number;
}
