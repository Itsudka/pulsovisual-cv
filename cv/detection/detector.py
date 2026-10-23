from ultralytics import YOLO


class PersonDetector:
    def __init__(self, model_name="yolo11n.pt", confidence=0.5):
        self.model = YOLO(model_name)
        self.confidence = confidence

    def track(self, frame):
        results = self.model.track(
            frame,
            persist=True,
            classes=[0],
            conf=self.confidence,
            tracker="botsort.yaml",
            verbose=False
        )

        tracks = []

        for result in results:
            for box in result.boxes:
                if box.id is None:
                    continue

                x1, y1, x2, y2 = box.xyxy[0].tolist()
                confidence = float(box.conf[0])
                track_id = int(box.id[0])

                tracks.append({
                    "id": track_id,
                    "box": (
                        int(x1),
                        int(y1),
                        int(x2),
                        int(y2)
                    ),
                    "confidence": confidence
                })

        return tracks