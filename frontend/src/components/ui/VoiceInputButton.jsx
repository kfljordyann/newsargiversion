import { useVoiceInput } from '../hooks/useVoiceInput';

const LABELS = {
  inactif: '🎙️ Parler pour écrire',
  ecoute: '🔴 Écoute en cours…',
  transcription: '✍️ Transcription…',
  erreur: '⚠️ Réessayer',
  indisponible: '🎙️ Non disponible',
};

/**
 * Bouton microphone à placer à côté d'un champ texte. Ajoute le texte
 * transcrit au contenu existant du champ (l'utilisateur peut ensuite le
 * corriger normalement au clavier avant l'envoi).
 */
export default function VoiceInputButton({ currentValue = '', onTranscript }) {
  const { status, isSupported, start, stop } = useVoiceInput({
    onResult: (transcript) => {
      const base = currentValue ? `${currentValue.trim()} ` : '';
      onTranscript(`${base}${transcript}`);
    },
  });

  if (!isSupported) {
    return (
      <span className="badge badge--neutral" title="La saisie vocale n'est pas supportée par ce navigateur.">
        🎙️ Indisponible sur ce navigateur
      </span>
    );
  }

  return (
    <button
      type="button"
      className="btn btn--ghost"
      onClick={status === 'ecoute' ? stop : start}
      aria-pressed={status === 'ecoute'}
      aria-label="Utiliser la saisie vocale pour remplir ce champ"
    >
      {LABELS[status] || LABELS.inactif}
    </button>
  );
}
