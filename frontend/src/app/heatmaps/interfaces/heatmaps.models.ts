
export interface TrajectoryPoint {
  track_id: number;
  frame: number;
  timestamp_seconds: number;
  x: number;
  y: number;
}

export interface AnalysisTrajectories {
  video: {
    width: number;
    height: number;
    fps: number;
  };

  configuration: {
    confidence: number;
    imgsz: number;
  };

  points: TrajectoryPoint[];
}
