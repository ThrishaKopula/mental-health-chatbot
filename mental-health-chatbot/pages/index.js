import { useState, useRef, useEffect } from 'react';
import '../styles/globals.css';

import { Quicksand } from 'next/font/google';

const quicksand = Quicksand({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});


export default function Home() {
  const [input, setInput] = useState('');
  const [chat, setChat] = useState([]);
  const [history, setHistory] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newUserMessage = { role: 'user', content: input };
    const updatedHistory = [...history, newUserMessage];

    setChat([...chat, newUserMessage]);
    setInput('');

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input, history: updatedHistory }),
    });

    const data = await res.json();
    const newBotMessage = { role: 'assistant', content: data.response };
    setChat(prev => [...prev, newBotMessage]);
    setHistory([...updatedHistory, newBotMessage]);
  };

  return (
    <main className={`${quicksand.className} min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4`}>
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-6 space-y-6">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-blue-600">Supportly</h1>
          <p className="text-sm text-gray-500">Your personal therapeutic AI companion</p>
        </header>

        <div className="h-[400px] overflow-y-auto border rounded-lg p-4 bg-gray-50 space-y-3 scroll-smooth">
          {chat.map((msg, idx) => (
            <div
            key={idx}
            className={`w-fit max-w-[70%] px-4 py-2 rounded-lg whitespace-pre-wrap break-words ${
              msg.role === 'user'
                ? 'ml-auto bg-blue-100 text-right'
                : 'mr-auto bg-gray-200 text-left'
            }`}
          >
            {msg.content}
          </div>
          
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            placeholder="How are you feeling today?"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
          >
            Send
          </button>
        </div>
      </div>
    </main>
  );
}
