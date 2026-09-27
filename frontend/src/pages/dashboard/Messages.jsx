import { useEffect, useState } from 'react';
import { fetchMyMessages, sendClientMessage } from '../../api/messages';
import VoiceInputButton from '../../components/ui/VoiceInputButton';
import { useToast } from '../../contexts/ToastContext';

export default function Messages() {
  const { showToast } = useToast();
  const [messages, setMessages] = useState(null);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);

  function reload() {
    fetchMyMessages().then((data) => setMessages(data.messages)).catch(() => setMessages([]));
  }

  useEffect(() => {
    reload();
  }, []);

  async function handleSend(e) {
    e.preventDefault();
    if (!text.trim()) return;
    setSending(true);
    try {
      await sendClientMessage(text);
      setText('');
      showToast('Message envoyé.', 'success');
      reload();
    } catch (err) {
      showToast(err.message || "Erreur lors de l'envoi.", 'error');
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="stack">
      <h1>Messages</h1>

      <div className="card stack">
        {!messages && <div className="skeleton" style={{ height: 80 }} />}
        {messages && messages.length === 0 && <p className="hint">Aucun message pour le moment.</p>}
        {messages && messages.map((m) => (
          <div key={m.id} className="card" style={{ background: 'var(--sargi-blue-50)' }}>
            <p style={{ margin: 0 }}>{m.message}</p>
            <span className="hint">{new Date(m.dateEnvoi).toLocaleString('fr-FR')}</span>
          </div>
        ))}
      </div>

      <form className="card" onSubmit={handleSend}>
        <div className="field">
          <label htmlFor="nouveauMessage">Nouveau message à SARGI</label>
          <textarea
            id="nouveauMessage"
            className="textarea"
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <VoiceInputButton currentValue={text} onTranscript={setText} />
        </div>
        <button type="submit" className="btn btn--primary" disabled={sending}>
          {sending ? 'Envoi…' : 'Envoyer'}
        </button>
      </form>
    </div>
  );
}
