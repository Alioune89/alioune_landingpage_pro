const unsplash = (id, w = 2400) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const IMAGES = {
  // Rue urbaine au crépuscule, lumières dorées — ombres architecturales
  hero: unsplash('photo-1519501025264-65ba15a82390'),
  // Texture de sable noir — fond organique du manifeste
  texture: unsplash('photo-1533134486753-c833f0ed4866'),
  // Tours de verre sombres — fond de la liste d'attente
  towers: unsplash('photo-1511818966892-d7d671e672a2', 1600),
};

export const NAV_LINKS = [
  { href: '#service', label: 'Service' },
  { href: '#manifeste', label: 'Manifeste' },
  { href: '#protocole', label: 'Méthode' },
  { href: '#formules', label: 'Formules' },
];

export const PLANS = [
  {
    id: 'essentiel',
    name: 'Essentiel',
    audience: 'Pour les envois ponctuels',
    price: '2 500',
    unit: 'FCFA / course',
    features: [
      'Livraison en moins de 2 h dans Dakar',
      'Suivi en temps réel',
      'Photo horodatée à la remise',
    ],
  },
  {
    id: 'performance',
    name: 'Performance',
    audience: 'Pour les commerçants et e-shops',
    price: '49 000',
    unit: 'FCFA / mois',
    featured: true,
    features: [
      '30 courses incluses chaque mois',
      'Enlèvements récurrents planifiés',
      'Coursier attitré',
      'Tableau de bord et export des preuves',
    ],
  },
  {
    id: 'entreprise',
    name: 'Entreprise',
    audience: 'Pour les volumes et les flottes',
    price: 'Sur devis',
    unit: 'Engagement annuel',
    features: [
      'Volume de courses illimité',
      'API et intégration e-commerce',
      'Gestionnaire de compte dédié',
      'Engagement de délai contractuel',
    ],
  },
];
