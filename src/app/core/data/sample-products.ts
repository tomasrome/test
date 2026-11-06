import { Product } from '../models/product.model';
import { generateSlug } from '../utils/slug.util';

// Datos de ejemplo claramente falsos: se usan solo si environment.apiUrl está vacío.
// 14 categorías (como las del cliente) para ver el diseño completo. Los nombres reales van en la pestaña Config del Sheet.
const CATEGORIES = 14;

export const SAMPLE_PRODUCTS: Product[] = Array.from({ length: CATEGORIES }, (_, c) => {
  const category = `Categoría ${c + 1}`;
  const count = c === 0 ? 4 : 2;
  return Array.from({ length: count }, (_, k): Product => {
    const name = `Equipo ${c + 1}.${k + 1}`;
    return {
      id: `${c + 1}-${k + 1}`,
      name,
      slug: generateSlug(name),
      category,
      description: 'Descripción del equipo.',
      imageUrl: '',
      stock: c === 0 && k === 1 ? 0 : c === 1 && k === 0 ? null : 2,
      discount: c === 0 && k === 0 ? 15 : 0,
      categoryOrder: c,
    };
  });
}).flat();
