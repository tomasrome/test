export interface TeamMember {
  name: string;
  role: string; // rol completo (página Nosotros)
  bio: string;
  photo: string; // '' → se muestra la inicial
}

// [COMPLETAR] nombres, fotos y bajadas reales
export const TEAM: TeamMember[] = [
  {
    name: 'Merlina Atena',
    role: 'Licenciada en Artes Audiovisuales',
    bio: 'Conoce el lenguaje del set: traduce lo que pide la escena a lo que se ve en cámara.',
    photo: '/images/medica.jpg',
  },
  {
    name: 'Pablo Atena',
    role: 'Técnico',
    bio: 'Acondiciona, revisa y deja cada equipo listo para filmar.',
    photo: '/images/medica.jpg',
  },
  {
    name: 'Yasmin Atena',
    role: 'Médica',
    bio: 'Asegura que lo que se muestra en pantalla sea médicamente verosímil.',
    photo: '/images/medica.jpg',
  },
];
