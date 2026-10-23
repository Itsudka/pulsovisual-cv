class FlowCounter:

    # ==========================
    # INICIALIZACIÓN
    # ==========================

    def __init__(self, line_y, margin):
        self.line_y = line_y
        self.margin = margin

        # Último lado estable conocido por cada ID
        self.last_stable_side = {}

        self.crossed_down = set()
        self.crossed_up = set()

        self.down_count = 0
        self.up_count = 0

        # Historial de cruces detectados
        self.flow_events = []


    # ==========================
    # DETERMINAR LADO
    # ==========================

    def get_side(self, y):

        upper_limit = self.line_y - self.margin
        lower_limit = self.line_y + self.margin

        if y < upper_limit:
            return "arriba"

        if y > lower_limit:
            return "abajo"

        return "neutral"


    # ==========================
    # ACTUALIZAR FLUJO
    # ==========================

    def update(
        self,
        track_id,
        point,
        frame_number
    ):

        _, y = point

        current_side = self.get_side(y)


        # ==========================
        # ZONA NEUTRA
        # ==========================

        if current_side == "neutral":
            return


        # ==========================
        # PRIMER LADO ESTABLE
        # ==========================

        if track_id not in self.last_stable_side:

            self.last_stable_side[track_id] = current_side

            return


        previous_side = self.last_stable_side[track_id]


        # ==========================
        # CRUCE HACIA ABAJO
        # ==========================

        if (
            previous_side == "arriba"
            and current_side == "abajo"
        ):

            if track_id not in self.crossed_down:

                self.down_count += 1

                self.crossed_down.add(
                    track_id
                )

                self.flow_events.append({
                    "id": track_id,
                    "direccion": "abajo",
                    "frame": frame_number
                })


        # ==========================
        # CRUCE HACIA ARRIBA
        # ==========================

        elif (
            previous_side == "abajo"
            and current_side == "arriba"
        ):

            if track_id not in self.crossed_up:

                self.up_count += 1

                self.crossed_up.add(
                    track_id
                )

                self.flow_events.append({
                    "id": track_id,
                    "direccion": "arriba",
                    "frame": frame_number
                })


        # ==========================
        # ACTUALIZAR LADO ESTABLE
        # ==========================

        self.last_stable_side[track_id] = current_side


    # ==========================
    # RESULTADOS GENERALES
    # ==========================

    def results(self):

        return {
            "up": self.up_count,
            "down": self.down_count
        }


    # ==========================
    # EVENTOS POR ID
    # ==========================

    def events_for_id(self, track_id):

        return {
            "cruzo_arriba":
                track_id in self.crossed_up,

            "cruzo_abajo":
                track_id in self.crossed_down
        }


    # ==========================
    # HISTORIAL DE CRUCES
    # ==========================

    def events(self):

        return self.flow_events