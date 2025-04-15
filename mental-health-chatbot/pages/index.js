import { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [chat, setChat] = useState([]);
  const [history, setHistory] = useState([]);

  const sendMessage = async () => {
    const newUserMessage = { role: 'user', content: input };
    const updatedHistory = [...history, newUserMessage];

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input, history: updatedHistory }),
    });

    const data = await res.json();
    const newBotMessage = { role: 'assistant', content: data.response };

    setChat([...chat, newUserMessage, newBotMessage]);
    setHistory([...updatedHistory, newBotMessage]);
    setInput('');
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">🧠 MindCare Chatbot</h1>
      <div className="space-y-2 h-96 overflow-y-scroll border p-2 rounded">
        {chat.map((msg, idx) => (
          <div key={idx} className={`p-2 ${msg.role === 'user' ? 'text-right' : 'text-left'} bg-gray-100 rounded`}>
            {msg.content}
          </div>
        ))}
      </div>
      <div className="flex mt-4 gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          className="flex-1 border rounded p-2"
          placeholder="How are you feeling today?"
        />
        <button onClick={sendMessage} className="bg-blue-500 text-white p-2 rounded">Send</button>
      </div>
    </div>
  );
}
