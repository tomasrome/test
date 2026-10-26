export interface TeamMember {
  name: string;
  role: string; // rol completo (página Nosotros)
  cardTitle: string; // título corto de la card del Home
  cardText: string; // frase corta de la card del Home
  bio: string;
  photo: string; // '' → se muestra el logo en la card
}

// [COMPLETAR] nombres, fotos y bajadas reales
export const TEAM: TeamMember[] = [
  {
    name: 'Merlina Atena',
    role: 'Licenciada en Artes Audiovisuales',
    cardTitle: 'Lic. en Artes Audiovisuales',
    cardText: 'Conoce el lenguaje del set: traduce lo que pide la escena a lo que se ve en cámara.',
    bio: 'Conoce el lenguaje del set: traduce lo que pide la escena a lo que se ve en cámara.',
    photo: '/images/licenciada.jfif',
  },
  {
    name: 'Pablo Atena',
    role: 'Técnico',
    cardTitle: 'Técnico',
    cardText: 'Acondiciona, revisa y deja cada equipo listo para filmar.',
    bio: 'Acondiciona, revisa y deja cada equipo listo para filmar.',
    photo: '/images/video_1.png',
  },
  {
    name: 'Yasmin Atena',
    role: 'Médica',
    cardTitle: 'Médica',
    cardText: 'Asegura que lo que se muestra en pantalla sea médicamente verosímil.',
    bio: 'Asegura que lo que se muestra en pantalla sea médicamente verosímil.',
    photo: '/images/medica.jfif',
  },
];
