class DwellTimeCounter:

    # ==========================
    # INICIALIZACIÓN
    # ==========================

    def __init__(self, fps):
        self.fps = fps

        self.first_seen_frames = {}
        self.last_seen_frames = {}


    # ==========================
    # ACTUALIZAR PERMANENCIA
    # ==========================

    def update(self, track_id, frame_number):

        if track_id not in self.first_seen_frames:
            self.first_seen_frames[track_id] = frame_number

        self.last_seen_frames[track_id] = frame_number


    # ==========================
    # TIEMPO ACTUAL DEL ID
    # ==========================

    def current_time(self, track_id, frame_number):

        if track_id not in self.first_seen_frames:
            return 0

        first_frame = self.first_seen_frames[track_id]

        return (frame_number - first_frame) / self.fps


    # ==========================
    # DETALLE POR ID
    # ==========================

    def details_for_id(self, track_id):

        if track_id not in self.first_seen_frames:
            return None

        first_frame = self.first_seen_frames[track_id]
        last_frame = self.last_seen_frames[track_id]

        duration = (
            last_frame - first_frame
        ) / self.fps

        return {
            "primer_frame": first_frame,
            "ultimo_frame": last_frame,
            "permanencia_segundos": round(
                duration,
                2
            )
        }


    # ==========================
    # RESULTADOS FINALES
    # ==========================

    def results(self):

        dwell_times = {}

        for track_id, first_frame in self.first_seen_frames.items():

            last_frame = self.last_seen_frames[track_id]

            duration = (
                last_frame - first_frame
            ) / self.fps

            dwell_times[track_id] = round(
                duration,
                2
            )

        return dwell_times