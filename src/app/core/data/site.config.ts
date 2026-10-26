// Contenido editable del sitio. Ningún componente hardcodea estos datos.
// Todo lo marcado [COMPLETAR] es un placeholder hasta tener el dato real.

export const BASE_URL = 'https://gatotuerto.com.ar'; // sin www (dominio oficial)

export const SITE = {
  name: 'El Gato Tuerto',
  tagline: 'Rental de equipamiento médico para producciones audiovisuales',
  heroTitle: 'Equipamiento médico para tu rodaje',
  heroSlogan: 'Camillas, monitores y más: listos para filmar, sin alarma y con asesoría de escena.',
  whatsapp: '5491131080787', // [COMPLETAR] confirmar que sea el WhatsApp
  whatsappDisplay: '+54 11 3108 0787',
  email: 'gatotuertoproducciones@gmail.com',
  address: 'Cerrito 2018, Bernal Oeste, Buenos Aires',
  mapQuery: 'Cerrito 2018, Bernal Oeste, Buenos Aires',
  instagram: 'https://www.instagram.com/rental.elgatotuerto',
  instagramHandle: '@rental.elgatotuerto',
  catalogPdf: '/catalogo-el-gato-tuerto.pdf',
  logo: '/images/logo.png',
  ogImage: '/images/og-cover.jpg',
} as const;

// Videos cortos y cuadrados del gato (en loop). Uno distinto en cada visita.
// [COMPLETAR] reemplazar por los reales en public/videos/
export const HERO_VIDEOS: { src: string; poster: string; label: string }[] = [
  {
    src: '/videos/video_1.mp4',
    poster: '/images/video_1.png',
    label: 'El gato con una camilla',
  },
  {
    src: '/videos/video_2.mp4',
    poster: '/images/video_1.png',
    label: 'El gato con un monitor',
  },
  {
    src: '/videos/video_1.mp4',
    poster: '/images/video_1.png',
    label: 'El gato con una bomba de infusión',
  },
];

export const CONSULTING_WHATSAPP_MESSAGE =
  'Hola! Quisiera consultar por la asesoría de escenas médicas para un guión.\n\n' +
  'Producción / proyecto: [Completar]\nEscena: [Completar]\n\nMuchas gracias!';
