# ==========================
# IMAGEN BASE
# ==========================

FROM node:24-bookworm-slim


# ==========================
# INSTALAR PYTHON
# ==========================

RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    ffmpeg \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*


# ==========================
# DIRECTORIO PRINCIPAL
# ==========================

WORKDIR /app


# ==========================
# COPIAR BACKEND
# ==========================

COPY backend/package*.json ./backend/


# ==========================
# INSTALAR DEPENDENCIAS NODE
# ==========================

WORKDIR /app/backend

# ==========================
# VERSION DE NPM
# ==========================

RUN npm install -g npm@11.18.0

RUN npm ci


# ==========================
# COPIAR CODIGO BACKEND
# ==========================

COPY backend/ /app/backend/


# ==========================
# COMPILAR NESTJS
# ==========================

RUN npm run build


# ==========================
# COPIAR COMPUTER VISION
# ==========================

COPY cv/ /app/cv/


# ==========================
# ENTORNO PYTHON
# ==========================

RUN python3 -m venv /opt/venv


# ==========================
# INSTALAR DEPENDENCIAS PYTHON
# ==========================

RUN /opt/venv/bin/pip install \
    --no-cache-dir \
    --upgrade pip

RUN /opt/venv/bin/pip install \
    --no-cache-dir \
    -r /app/cv/requirements.txt


# ==========================
# VARIABLES
# ==========================

ENV NODE_ENV=production

ENV PYTHON_EXECUTABLE=/opt/venv/bin/python

ENV CV_DIRECTORY=/app/cv


# ==========================
# DIRECTORIO DE EJECUCION
# ==========================

WORKDIR /app/backend


# ==========================
# INICIAR NESTJS
# ==========================

CMD ["node", "dist/main"]

# ==========================
# CARPETA DE VIDEOS TEMPORALES
# ==========================

RUN mkdir -p /app/backend/uploads