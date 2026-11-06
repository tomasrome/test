export interface Product {
  id: string;
  name: string;
  slug: string;        // generado con generateSlug(name); no viene del Sheet
  category: string;
  description: string;
  imageUrl: string;    // foto del equipo
  categoryOrder: number; // posición de la categoría en la pestaña Config del Sheet (999 si no figura)
  stock: number | null; // null = el Sheet no informa stock; 0 = sin stock
  discount: number;    // porcentaje de descuento (0 = sin descuento)
}
