import React, { useRef, useState } from 'react';

// Placeholder for AI icon (SVG)
const AIIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
);

const AIAssistant: React.FC = () => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Placeholder: Call OpenAI API
  // const sendMessage = async (text: string) => {
  //   // if (!apiKey) {
  //   //   setShowKeyInput(true);
  //   //   return;
  //   // }
  //   setLoading(true);
  //   setMessages((msgs) => [...msgs, { role: 'user', content: text }]);
  //   setInput('');
  //   try {
  //     setTimeout(() => {
  //       setMessages((msgs) => [
  //         ...msgs,
  //         { role: 'assistant', content: 'This is a placeholder AI response.' },
  //       ]);
  //       setLoading(false);
  //     }, 1200);
  //   } catch (e) {
  //     setMessages((msgs) => [
  //       ...msgs,
  //       { role: 'assistant', content: 'Error: Unable to get response.' },
  //     ]);
  //     setLoading(false);
  //   }
  // };
  const sendMessage = async (inputTxt: string) => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: inputTxt }],
                role: 'user',
              },
            ],
          }),
        }
      );

      const data = await res.json();

      const message = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
      setMessages((msgs) => [...msgs, { role: 'assistant', content: message }]);
    } catch (err) {
      console.error(err);
      setMessages((msgs) => [...msgs, { role: 'assistant', content: 'Something went wrong.' }]);
    } finally {
      setLoading(false);
    }
  };

  // Voice input logic (Web Speech API)
  const startVoice = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Voice recognition not supported in this browser.');
      return;
    }
    setVoiceActive(true);
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setVoiceActive(false);
    };
    recognition.onerror = () => setVoiceActive(false);
    recognition.onend = () => setVoiceActive(false);
    recognition.start();
    recognitionRef.current = recognition;
  };

  const stopVoice = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setVoiceActive(false);
    }
  };

  // Text-to-speech for assistant replies
  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utter = new window.SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utter);
    }
  };

  // Play assistant reply with voice
  React.useEffect(() => {
    if (messages.length && messages[messages.length - 1].role === 'assistant') {
      speak(messages[messages.length - 1].content);
    }
    // eslint-disable-next-line
  }, [messages]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        width: '100%',
        height: '100%',
      }}
    >
      {/* Floating AI button */}
      <button
        className="fixed z-50 bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg p-4 flex items-center justify-center focus:outline-none focus:ring"
        style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.18)' }}
        onClick={() => setOpen(true)}
        aria-label="Open AI Assistant"
      >
        <AIIcon />
      </button>

      {/* Drawer */}
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black bg-opacity-30" onClick={() => setOpen(false)} />
          <div
            className="relative w-full max-w-md h-full bg-white shadow-xl flex flex-col"
            style={{ animation: 'slideInRight 0.3s' }}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2 font-bold text-lg">
                <AIIcon /> AI Assistant
              </div>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setOpen(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            {showKeyInput && (
              <div className="p-4 border-b bg-gray-50 flex flex-col gap-2">
                <button
                  className="bg-blue-600 text-white rounded px-3 py-1 mt-1"
                  onClick={() => setShowKeyInput(false)}
                  disabled={!apiKey}
                >
                  Save
                </button>
              </div>
            )}
            {/* Chat area */}
            <div className="flex-1 gap-2 flex flex-col overflow-y-auto p-4 space-y-3 bg-gray-50">
              {messages.length === 0 && (
                <div className="text-gray-400 text-center mt-8">
                  Start a conversation with your AI assistant!
                </div>
              )}
              {messages.map((msg, i) => {
                console.log(msg);
                return (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      justifyContent: msg.role === 'assistant' ? 'start' : 'end',
                      width: '100%',
                    }}
                    // className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`rounded-lg px-4 py-2 mt-2 max-w-xs ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-900'}`}
                      style={{
                        display: 'flex',
                        justifyContent: msg.role === 'assistant' ? 'start' : 'end',
                        width: '60%',
                      }}
                    >
                      {msg.content}
                    </div>
                  </div>
                );
              })}
              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-lg px-4 py-2 bg-gray-200 text-gray-900 animate-pulse">
                    Thinking...
                  </div>
                </div>
              )}
            </div>
            <form
              className="p-4 border-t flex gap-2 items-center bg-white"
              onSubmit={(e) => {
                e.preventDefault();
                if (input.trim() && !loading)
                  setMessages((msgs) => [...msgs, { role: 'user', content: input.trim() }]);
                sendMessage(input.trim());
              }}
            >
              <input
                className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                disabled={loading}
                autoFocus
              />

              {/* voice section */}
              {!voiceActive ? (
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-800"
                  onClick={startVoice}
                  title="Start voice input"
                  disabled={loading}
                >
                  <svg
                    width="24"
                    height="24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 18v2m0 0c-3.31 0-6-2.69-6-6v-2m12 2c0 3.31-2.69 6-6 6zm0 0v-2m0 0c3.31 0 6-2.69 6-6v-2" />
                    <rect x="9" y="2" width="6" height="12" rx="3" />
                  </svg>
                </button>
              ) : (
                <button
                  type="button"
                  className="text-red-600 hover:text-red-800 animate-pulse"
                  onClick={stopVoice}
                  title="Stop voice input"
                >
                  <svg
                    width="24"
                    height="24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="6" y="6" width="12" height="12" rx="2" />
                  </svg>
                </button>
              )}
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2 font-semibold disabled:opacity-50"
                disabled={loading || !input.trim()}
                title="Send"
              >
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
              {loading && (
                <button
                  type="button"
                  className="ml-2 text-red-600 hover:text-red-800"
                  onClick={() => setLoading(false)}
                  title="Stop AI response"
                >
                  <svg
                    width="24"
                    height="24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="6" y="6" width="12" height="12" rx="2" />
                  </svg>
                </button>
              )}
            </form>
          </div>
        </div>
      )}
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default AIAssistant;
