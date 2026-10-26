import { Product } from '../models/product.model';
import { generateSlug } from '../utils/slug.util';

type Row = [string, string, string, number | null, number, string];

// Datos de ejemplo claramente falsos: se usan solo si environment.apiUrl está vacío.
const rows: Row[] = [
  ['Cama hospitalaria', 'Camas y camillas', '[COMPLETAR] Cama hospitalaria articulada, acondicionada para rodaje.', 2, 0, '[COMPLETAR] Película 1'],
  ['Camilla de traslado', 'Camas y camillas', '[COMPLETAR] Camilla de traslado con ruedas.', 3, 15, ''],
  ['Camilla de emergencias', 'Camas y camillas', '[COMPLETAR] Camilla de emergencias plegable.', 0, 0, ''],
  ['Monitor multiparamétrico', 'Monitoreo', '[COMPLETAR] Monitor de signos vitales, sin alarma.', 2, 0, '[COMPLETAR] Serie 1'],
  ['Desfibrilador', 'Monitoreo', '[COMPLETAR] Desfibrilador de demostración, sin alarma.', 1, 10, ''],
  ['Bomba de infusión', 'Infusión', '[COMPLETAR] Bomba de infusión activa, sin alarma.', 4, 0, '[COMPLETAR] Película 2'],
  ['Soporte de suero', 'Infusión', '[COMPLETAR] Soporte de suero con ruedas.', null, 0, ''],
  ['Estetoscopio negro', 'Instrumental', '[COMPLETAR] Estetoscopio profesional.', 6, 0, ''],
];

export const SAMPLE_PRODUCTS: Product[] = rows.map(([name, category, description, stock, discount, production], i) => ({
  id: String(i + 1),
  name,
  slug: generateSlug(name),
  category,
  description,
  imageUrl: '',
  stillUrl: '',
  production,
  stock,
  discount,
}));
