/**
 * Configuration centralisée du site. Modifier ce fichier suffit pour
 * changer le logo ou les informations de contact partout sur le site,
 * sans toucher aux composants.
 *
 * Les valeurs entre crochets sont des placeholders à remplacer dès que
 * l'information officielle sera fournie par SARGI (voir section 25 du
 * cahier des charges : ne jamais inventer ces informations).
 */
export const siteConfig = {
  nom: 'SARGI BENIN',
  accroche: "Cabinet multidisciplinaire d'expertise",
  fondation: 2022,
  logo: '/logo.png',
  contact: {
    email: '[À CONFIGURER]',
    telephone: '[À CONFIGURER]',
    adresse: '[INFORMATION À FOURNIR]',
    reseauxSociaux: {
      facebook: '[À CONFIGURER]',
      linkedin: '[À CONFIGURER]',
      instagram: '[À CONFIGURER]',
    },
  },
  chiffresClés: [
    { valeur: '5', label: "Domaines d'expertise" },
    { valeur: '100%', label: 'Engagement qualité' },
    { valeur: '24/7', label: 'Disponibilité' },
  ],
};
