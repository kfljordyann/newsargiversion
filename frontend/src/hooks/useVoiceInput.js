import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Hook de saisie vocale (section 12 du cahier des charges).
 *
 * États exposés : 'inactif' | 'ecoute' | 'transcription' | 'erreur' | 'indisponible'
 *
 * - N'enregistre jamais l'audio automatiquement : la reconnaissance ne
 *   démarre qu'au clic explicite de l'utilisateur (consentement).
 * - Se dégrade proprement si l'API Web Speech n'est pas supportée par le
 *   navigateur : le champ reste utilisable au clavier (la voix est un
 *   complément, jamais l'unique moyen de saisie — section 19).
 */
export function useVoiceInput({ lang = 'fr-FR', onResult } = {}) {
  const [status, setStatus] = useState('inactif');
  const recognitionRef = useRef(null);

  const isSupported =
    typeof window !== 'undefined' &&
    !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  useEffect(() => {
    if (!isSupported) {
      setStatus('indisponible');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = lang;
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onstart = () => setStatus('ecoute');

    recognition.onresult = (event) => {
      setStatus('transcription');
      let transcript = '';
      for (let i = 0; i < event.results.length; i += 1) {
        transcript += event.results[i][0].transcript;
      }
      onResult?.(transcript);
    };

    recognition.onerror = () => setStatus('erreur');
    recognition.onend = () => setStatus((prev) => (prev === 'erreur' ? prev : 'inactif'));

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, isSupported]);

  const start = useCallback(async () => {
    if (!isSupported || !recognitionRef.current) {
      setStatus('indisponible');
      return;
    }
    try {
      // Demande explicite du micro : déclenche la boîte de dialogue native
      // du navigateur, jamais de démarrage silencieux.
      await navigator.mediaDevices?.getUserMedia?.({ audio: true });
      recognitionRef.current.start();
    } catch (err) {
      setStatus('erreur');
    }
  }, [isSupported]);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  return { status, isSupported, start, stop };
}
