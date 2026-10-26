# El Gato Tuerto — web institucional + catálogo de consulta

Angular 21 (standalone, signals, SSR + PWA) · Google Sheets + Apps Script como base de datos · Cloudinary · Vercel.
Sin e-commerce: el "carrito" arma una **consulta de alquiler** que se envía por WhatsApp (y por email solo en mobile).

## Setup

```bash
npm install
ng serve          # desarrollo → http://localhost:4200  (sin service worker)
ng build          # producción: SSR + prerender + PWA
node dist/gato-tuerto/server/server.mjs   # probar el build con SSR real
```

> Si `npm install` falla con `Cannot read properties of null (reading 'edgesOut')`, es un bug de npm 10: actualizá a npm 11 (`npm i -g npm@11`).
> Nunca uses `--force` / `--legacy-peer-deps`. Todos los `@angular/*` deben estar en la misma versión.

Sin `environment.apiUrl` el sitio usa **datos de ejemplo** (`core/data/sample-products.ts`), así se ve completo antes de conectar el Sheet.

## Conectar el Google Sheet

1. Subí `sheet-template/gato-tuerto-catalogo.xlsx` a Drive y abrilo como Google Sheet (o Archivo > Importar > "Insertar nuevas hojas").
2. En la pestaña `Productos`, columna **Mostrar en web**: borrá los valores y usá *Insertar > Casilla de verificación* (tiene que ser un booleano real, no `=FALSO()`).
3. Subí `sheet-template/gato-tuerto-leads.xlsx` como **otro** Sheet (datos personales: no se mezclan con el catálogo) y copiá su ID.
4. En el Sheet del catálogo: *Extensiones > Apps Script*, pegá `apps-script/Code.gs` y reemplazá `LEADS_SHEET_ID`.
5. *Implementar > Nueva implementación > Aplicación web*: ejecutar como **Yo**, acceso **Cualquiera**. Copiá la URL `/exec`.
6. Pegala en `src/environments/environment.ts` (`apiUrl`) y en `environment.development.ts`.
7. Cada cambio de código del script exige *Gestionar implementaciones > Nueva versión* (la URL no cambia).

**Columnas de `Productos`** (encabezados en la fila 3, datos desde la fila 4 y desde la columna B):
`ID | NOMBRE | CATEGORIA | DESCRIPCION | IMAGEN | FOTOGRAMA | PRODUCCION | STOCK | DESCUENTO | MOSTRAR EN WEB`

- `ID`: fórmula `=IF(C4="","",ROW()-3)` (funciones en inglés aunque la UI esté en español).
- `CATEGORIA`: lista desplegable desde la pestaña `Config`. Una categoría nueva con al menos un producto aparece sola en la web.
- `IMAGEN` / `FOTOGRAMA`: link directo de **Cloudinary** (Google Drive devuelve 403 como host de imágenes).
- `STOCK`: número. `0` → la ficha dice "Sin stock — se consulta igual" (igual se puede agregar). Vacío = no se muestra nada.
- `DESCUENTO`: porcentaje (ej. `15`) → badge "15% off". Vacío o `0` = sin badge.
- Descripción con viñetas `•` → se muestra como intro + lista.
- Los cambios del Sheet tardan hasta ~5 min en verse (caché).

## Dónde editar el contenido

| Qué | Archivo |
|---|---|
| Textos del hero, WhatsApp, email, dirección, redes, videos del hero, PDF | `src/app/core/data/site.config.ts` |
| Integrantes del equipo (nombre, rol, foto, bajada) | `src/app/core/data/team.ts` |
| Carrusel de películas / series / productoras (contenido fijo) | `src/app/core/data/productions.ts` |
| Logo | `public/images/logo.svg` (placeholder) — reemplazar por el PNG real y actualizar `SITE.logo` |
| Videos del hero | `public/videos/` (ver `README.txt` ahí) |
| Catálogo PDF descargable | `public/catalogo-el-gato-tuerto.pdf` (placeholder) |

Todo lo que dice `[COMPLETAR]` es un placeholder.

## Decisiones asumidas (el spec o el cliente no las definieron)

- **Solo alquiler**: el texto del carrito dice "alquiler".
- **Home / hero**: 3 videos cuadrados cortos del gato guardados en el proyecto, en loop y sin audio; en cada visita se elige uno distinto (nunca el mismo dos veces seguidas). Con `prefers-reduced-motion` o "ahorro de datos" se muestra solo el poster. Los videos y posters actuales son placeholders.
- **Catálogo**: vista inicial de cards de categoría → al elegir una, cards de productos de esa categoría, con **flechas** a los costados para ir a la categoría anterior/siguiente (circular). **Sin buscador** (el cliente no lo pidió). La categoría va en la URL (`/catalogo?categoria=monitoreo`).
- **Stock y descuento** editables desde el Sheet (columnas `STOCK` y `DESCUENTO`).
- **Consulta de guión**: solo botón a WhatsApp con mensaje prearmado (sin formulario ni honeypot). Si más adelante quieren formulario, ver sección 16 del spec; `LeadSubmission` y el Apps Script (`doPost`) ya están listos.
- **Leads**: cada consulta del carrito se guarda (sin bloquear) en el Sheet de leads, solo si `apiUrl` está configurada.
- **Navbar oscuro** (coherente con el Instagram del cliente). Fuentes: Barlow Condensed (títulos, itálica) + Figtree (cuerpo).
- **Dominio oficial sin `www`** (`https://gatotuerto.com.ar`); `vercel.json` redirige `www` → sin `www`. Está en `BASE_URL`, `index.html`, `api/sitemap.ts` y `robots.txt`.
- **Analytics**: no se incluyó (sin respuesta). Si lo quieren, agregar GA/GTM con cuenta a nombre del cliente.
- **Sin `Schema.org Product`** (no hay precios). Solo `LocalBusiness` global en `index.html`.
- **Sin campo SUBTITULO** en el Sheet (el spec lo dejaba como `[CONFIRMAR]`).
- **Teléfono/WhatsApp**: `5491131080787` tomado del Instagram; confirmar que sea el WhatsApp.
- **Íconos PWA**: son los genéricos de Angular; reemplazar `public/icons/*` por el logo (con padding para la versión maskable) cuando esté el PNG.
- **`allowedHosts`** (angular.json): `gatotuerto.com.ar`, `www.gatotuerto.com.ar`, `*.vercel.app`, `localhost`. Sin esto Angular 21 cae a render en cliente y se pierde el SEO. Si cambian el dominio, actualizarlo.
- **Inlining de fuentes desactivado** en el build (`optimization.fonts: false`) para que el build no dependa de la red; las fuentes igual cargan con `preconnect` + `display=swap`.

## Deploy en Vercel

1. Repo en GitHub y cuenta de Vercel **a nombre del cliente** (el dev entra como colaborador).
2. Variable de entorno en Vercel: `PRODUCTS_API_URL` = URL `/exec` del Apps Script (la usa `api/sitemap.ts`).
3. Probar primero en la URL `*.vercel.app`.
4. Settings > Domains > "Add Existing" → `gatotuerto.com.ar`; configurar en el DNS (nic.ar) los registros A/CNAME que indique Vercel.
5. Search Console (cuenta del cliente, propiedad "Dominio", verificación TXT), enviar `sitemap.xml`, pedir indexación de Home y 2–3 productos. Verificar el canonical con Ctrl+U (HTML crudo del SSR).
6. Reemplazar filas e imágenes de ejemplo del Sheet antes de salir.

## Checklist antes de lanzar

- [ ] Logo real (favicon, íconos PWA, `og-cover.jpg` 1200×630)
- [ ] 3 videos del gato + posters
- [ ] Textos `[COMPLETAR]`: hero, "Sin alarma", equipo, consultoría
- [ ] Nombres / fotos del equipo y títulos del carrusel
- [ ] Catálogo PDF real
- [ ] Confirmar número de WhatsApp
- [ ] `apiUrl` configurada y Sheet cargado
