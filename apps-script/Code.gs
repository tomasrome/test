// Apps Script (Web App): ejecutar como "Yo", acceso "Cualquiera".
// Cada cambio de código requiere "Nueva versión" en Implementar > Gestionar implementaciones (la URL no cambia).
// Este script debe estar vinculado al Sheet del catálogo (Extensiones > Apps Script).

const LEADS_SHEET_ID = 'PEGAR_ID_DEL_SHEET_DE_LEADS';
const CACHE_SECONDS = 300;

function doGet(e) {
  const cache = CacheService.getScriptCache();
  const cached = cache.get('productos');
  if (cached) return json_(cached);

  const out = JSON.stringify(obtenerProductos_());
  cache.put('productos', out, CACHE_SECONDS);
  return json_(out);
}

function obtenerProductos_() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Productos');
  const data = sheet.getDataRange().getValues();
  const headers = data[2]; // fila 3 = encabezados
  const rows = data.slice(3);
  const idx = {};
  ['ID', 'NOMBRE', 'CATEGORIA', 'DESCRIPCION', 'IMAGEN', 'FOTOGRAMA', 'PRODUCCION', 'STOCK', 'DESCUENTO', 'MOSTRAR EN WEB']
    .forEach(h => idx[h] = headers.indexOf(h)); // por NOMBRE de columna, nunca por posición fija

  return rows
    .filter(r => r[idx['ID']] !== '' && r[idx['MOSTRAR EN WEB']] === true)
    .map(r => ({
      id: r[idx['ID']],
      nombre: r[idx['NOMBRE']],
      categoria: r[idx['CATEGORIA']],
      descripcion: r[idx['DESCRIPCION']],
      imagen: r[idx['IMAGEN']],
      fotograma: r[idx['FOTOGRAMA']] || '',
      produccion: r[idx['PRODUCCION']] || '',
      stock: r[idx['STOCK']] === '' ? '' : Number(r[idx['STOCK']]), // '' = sin dato; 0 = sin stock
      descuento: Number(r[idx['DESCUENTO']]) || 0, // porcentaje (ej. 15)
    }));
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents); // llega como text/plain
    if (data.honeypot) return json_(JSON.stringify({ success: true })); // bot: ignorar sin avisar
    const sheet = SpreadsheetApp.openById(LEADS_SHEET_ID).getSheetByName('Consultas');
    sheet.appendRow([new Date(), data.tipo || '', data.nombre || '', data.email || '', data.detalle || '']);
    return json_(JSON.stringify({ success: true }));
  } catch (err) {
    return json_(JSON.stringify({ success: false, error: String(err) }));
  }
}

function json_(s) {
  return ContentService.createTextOutput(s).setMimeType(ContentService.MimeType.JSON);
}
