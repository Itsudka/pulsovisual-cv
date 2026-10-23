# PulsoVisual — dashboard Angular

El frontend presenta las métricas disponibles en la API NestJS: IDs únicos, flujo hacia arriba y abajo, permanencia promedio y detalle por ID. No procesa video ni calcula las métricas originales. Véase el [README general](../README.md).

## Inventario de archivos

| Archivo | Responsabilidad |
| --- | --- |
| `src/main.ts` | Inicia la aplicación con `bootstrapApplication(App, appConfig)`. |
| `src/index.html` | Documento HTML, elemento `app-root`, título y favicon; conserva `lang="en"`. |
| `src/styles.css` | Archivo global con comentario inicial; sin estilos funcionales propios. |
| `src/app/app.ts` | Componente principal, petición inicial, señales de estado y transformación de tiempos en filas. |
| `src/app/app.html` | Tarjetas, tabla y mensajes de carga, error y ausencia de permanencias. |
| `src/app/app.css` | Estilos del dashboard; tres columnas y una columna por debajo de 750 px. |
| `src/app/app.config.ts` | Proveedores de errores globales, router y cliente HTTP. |
| `src/app/app.routes.ts` | Lista de rutas vacía; no existen páginas adicionales configuradas. |
| `src/app/app.spec.ts` | Pruebas iniciales del componente; aún esperan el título del proyecto generado. |
| `src/app/services/analysis.ts` | Servicio raíz `AnalysisService`: GET tipado a la API local. |
| `src/app/interfaces/analysis.interface.ts` | Interfaz `AnalysisMetrics`, equivalente a la del backend. |
| `public/favicon.ico` | Recurso binario del icono; sin lógica del dominio. |
| `angular.json` | Compilación, servidor, recursos públicos y ejecutor de pruebas; producción por defecto al compilar. |
| `package.json` | Dependencias Angular, RxJS, herramientas y scripts npm. |
| `package-lock.json` | Versiones resueltas e integridades para instalación reproducible de dependencias JavaScript. |
| `tsconfig.json` | TypeScript estricto, objetivo ES2022 y comprobación estricta de plantillas. |
| `tsconfig.app.json` | Configuración de aplicación; excluye archivos de pruebas. |
| `tsconfig.spec.json` | Configuración de pruebas con tipos `vitest/globals`. |
| `.editorconfig` | UTF-8, dos espacios y reglas de formato del editor. |
| `.prettierrc` | Ancho 100, comillas simples y parser Angular para HTML. |
| `.gitignore` | Exclusiones de dependencias, compilación, cachés y archivos locales. |
| `.vscode/extensions.json` | Recomienda la extensión de plantillas Angular. |
| `.vscode/tasks.json` | Tareas del editor para iniciar aplicación y pruebas. |
| `.vscode/launch.json` | Depuración en Chrome; incluye una URL de pruebas `9876/debug.html` que no acredita configuración de Karma. |
| `.vscode/mcp.json` | Configuración opcional del servidor MCP de Angular CLI para herramientas del editor; no forma parte de la aplicación. |
| `README.md` | Documentación de esta capa. |

## Instalación y ejecución

Desde `pulsovisual-frontend/`:

```powershell
npm ci
npm start
```

Abrir `http://localhost:4200` con la API funcionando en 3000 y el JSON previamente generado. El lockfile exige para Angular Node `^20.19.0 || ^22.12.0 || >=24.0.0`; `package.json` declara el gestor `npm@11.18.0`. No se requiere instalar Angular CLI globalmente para los scripts npm.

```powershell
npm run build
npm test
```

`build` genera la salida de compilación en `dist/` con configuración de producción. `watch` compila continuamente en desarrollo; `ng` permite invocar el CLI local. `angular.json` configura presupuestos de 500 kB de advertencia/1 MB de error para el paquete inicial y 4 kB/8 kB por estilos de componente. No hay configuración propia de despliegue ni pruebas e2e.

## Configuración e integración

`src/app/services/analysis.ts` fija `apiUrl = 'http://localhost:3000/analysis'`. No existe archivo de entornos ni proxy configurado para sustituir esa URL. `provideHttpClient()` está registrado en `app.config.ts`; el backend admite el origen `http://localhost:4200`. Si se cambian puertos u origen, esas configuraciones deben permanecer alineadas.

La entrada es el [objeto JSON de métricas](../README.md#formato-y-significado-de-las-métricas), recibido como `Observable<AnalysisMetrics>`. No se envían parámetros ni archivos. El servicio utiliza un tipo estático, sin validación de respuesta en ejecución.

## Flujo de la interfaz

1. El componente comienza con `analysis=null`, `loading=true` y `error=null`.
2. `ngOnInit` se suscribe una vez a `getAnalysis()`.
3. En éxito almacena el objeto y desactiva la carga. Las tarjetas presentan los números recibidos.
4. `dwellRows`, una señal calculada, transforma `Object.entries(tiempos_segundos)` en objetos `{id, seconds}`. No recalcula ni redondea esos tiempos ni aplica un orden personalizado.
5. Si hay filas, la plantilla muestra ID y segundos; si no, muestra que no hay registros de permanencia.
6. En error registra el detalle en consola y muestra `No fue posible obtener las métricas del análisis.`.

La plantilla usa `@if` y `@for` y sigue cada fila por ID. No hay botón de reintento, sondeo periódico, suscripción en tiempo real ni actualización tras finalizar Python: recargar el navegador para volver a consultar.

## Verificación y límites

Comparar las tarjetas y la tabla con `GET /analysis`. Verificar el mensaje de carga, el resultado con permanencias vacías y el mensaje de error cuando la API no está disponible. Estas son comprobaciones manuales propuestas, no resultados de pruebas ejecutadas en esta revisión.

La configuración actual de pruebas usa el ejecutor unitario de Angular con Vitest. `app.spec.ts` conserva una expectativa de `Hello, pulsovisual-frontend`, pero la plantilla muestra `PulsoVisual`; además no aporta un proveedor o sustituto HTTP para el servicio inyectado. Por ello las pruebas requieren actualización antes de usarse como evidencia del dashboard.

No hay gráficas, filtros, selección de videos, autenticación, exportación ni histórico. El panel no distingue mensajes HTTP 404 y 500 y no puede detectar por sí mismo un JSON antiguo. Como próximos pasos quedan actualizar las pruebas, añadir comprobaciones de estados y, dentro del alcance académico, representar las métricas existentes con gráficas sencillas.
