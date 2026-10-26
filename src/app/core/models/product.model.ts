export interface Product {
  id: string;
  name: string;
  slug: string;        // generado con generateSlug(name); no viene del Sheet
  category: string;
  description: string;
  imageUrl: string;    // foto del equipo
  stillUrl: string;    // fotograma de la producción donde se usó ('' si no hay)
  production: string;  // título de la película/serie donde se usó ('' si no hay)
  stock: number | null; // null = el Sheet no informa stock; 0 = sin stock
  discount: number;    // porcentaje de descuento (0 = sin descuento)
}
