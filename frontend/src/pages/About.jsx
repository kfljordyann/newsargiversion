import { siteConfig } from '../config/siteConfig';

export default function About() {
  return (
    <>
      <section className="section">
        <div className="container">
          <span className="badge badge--blue">À propos de SARGI</span>
          <h1>Un cabinet multidisciplinaire pensé pour l'avenir</h1>
          <p style={{ fontSize: '1.1rem', maxWidth: '70ch' }}>
            Fondé en {siteConfig.fondation} au Bénin, SARGI est un cabinet multidisciplinaire
            proposant une gamme complète de services dans les domaines juridique, financier,
            immobilier, informatique et de l'intelligence artificielle. Grâce à une équipe
            d'experts hautement qualifiés et une approche centrée sur l'innovation, SARGI
            accompagne entreprises et particuliers dans leurs projets stratégiques en offrant
            des solutions sur mesure adaptées aux défis contemporains.
          </p>
        </div>
      </section>

      <section className="section section--tint">
        <div className="container grid grid--cards">
          <div className="card">
            <h3>Notre positionnement</h3>
            <p>
              Une approche globale et intégrée : cinq domaines d'expertise réunis sous un même
              accompagnement, pour éviter à nos clients de multiplier les interlocuteurs.
            </p>
          </div>
          <div className="card">
            <h3>Notre mission</h3>
            <p>
              Offrir des solutions fiables, accessibles et humaines, en combinant expertise
              terrain et innovation technologique, au service des particuliers comme des
              entreprises.
            </p>
          </div>
          <div className="card">
            <h3>Notre approche</h3>
            <p>
              Un accompagnement personnalisé et pédagogique, de la première consultation
              jusqu'au suivi de chaque dossier, avec une exigence constante de confidentialité
              et de transparence.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>Accompagnement des particuliers et des entreprises</h2>
          <div className="grid grid--cards">
            <div className="card">
              <h3>Particuliers</h3>
              <p>
                Bilans personnalisés, protection du patrimoine, accompagnement juridique et
                immobilier, formations pratiques en informatique et en intelligence
                artificielle.
              </p>
            </div>
            <div className="card">
              <h3>Entreprises &amp; investisseurs</h3>
              <p>
                Structuration juridique et financière, gestion des risques, transformation
                numérique, conseil en stratégie d'investissement et accompagnement des levées
                de fonds.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--tint">
        <div className="container">
          <h2>Chiffres clés</h2>
          <div className="grid grid--cards">
            {siteConfig.chiffresClés.map((c) => (
              <div key={c.label} className="card" style={{ textAlign: 'center' }}>
                <div className="hero__stat" style={{ alignItems: 'center' }}>
                  <strong>{c.valeur}</strong>
                  <span>{c.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
