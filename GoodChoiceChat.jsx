import React, { useState } from 'react';

export default function GoodChoiceChat() {
  const [messages, setMessages] = useState([
    { role: 'system', content: 'Вы общаетесь с GoodChoice — вашим помощником.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim()) return;
    const userMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      const assistantMessage = data.choices[0].message;
      setMessages([...newMessages, assistantMessage]);
    } catch (err) {
      setMessages([...newMessages, { role: 'assistant', content: 'Произошла ошибка сервера.' }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: 'auto', fontFamily: 'Arial, sans-serif' }}>
      <h2>GoodChoice</h2>
      <div style={{ border: '1px solid #ddd', padding: 10, height: 400, overflowY: 'auto', marginBottom: 10 }}>
        {messages.filter(m => m.role !== 'system').map((m, i) => (
          <div key={i} style={{ margin: '10px 0', textAlign: m.role === 'user' ? 'right' : 'left' }}>
            <div style={{
              display: 'inline-block',
              background: m.role === 'user' ? '#007bff' : '#e5e5ea',
              color: m.role === 'user' ? 'white' : 'black',
              padding: '8px 12px',
              borderRadius: 16,
              maxWidth: '80%'
            }}>
              {m.content}
            </div>
          </div>
        ))}
      </div>
      <div>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if(e.key === 'Enter') sendMessage(); }}
          style={{ width: '80%', padding: 10, fontSize: 16 }}
          placeholder="Напиши сообщение..."
          disabled={loading}
        />
        <button onClick={sendMessage} disabled={loading} style={{ padding: '10px 20px', marginLeft: 10 }}>
          {loading ? 'Отправка...' : 'Отправить'}
        </button>
      </div>
    </div>
  );
}
