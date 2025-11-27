import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const AITeacher: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI Teacher. Ask me anything about your courses, homework, or any subject you\'d like to learn!',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const token = localStorage.getItem('access_token');
      
      // TODO: Replace with actual AI endpoint
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/ai/chat`,
        { message: userMessage.content },
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error: any) {
      console.error('AI Chat error:', error);
      
      // Mock response for now (until backend is ready)
      const mockResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I'm currently in development mode. Soon I'll be able to help you with:
        
• Explaining complex topics
• Solving math problems
• Reviewing homework
• Practice exercises
• Study tips and guidance

For now, I'm learning just like you! 📚`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, mockResponse]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickPrompts = [
    '📐 Explain Pythagorean theorem',
    '🧪 What is photosynthesis?',
    '📝 Help me write an essay',
    '🔢 Solve this math problem'
  ];

  return (
    <div className="ai-teacher-container">
      <div className="ai-teacher-header">
        <div className="header-content">
          <div className="ai-avatar">🤖</div>
          <div className="header-info">
            <h2>AI Teacher</h2>
            <p className="status">
              <span className="status-dot"></span>
              Online & Ready to Help
            </p>
          </div>
        </div>
      </div>

      <div className="chat-container">
        <div className="messages-list">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.role}`}>
              <div className="message-avatar">
                {message.role === 'assistant' ? '🤖' : '👤'}
              </div>
              <div className="message-content">
                <div className="message-text">{message.content}</div>
                <div className="message-time">
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="message assistant">
              <div className="message-avatar">🤖</div>
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <div className="quick-prompts">
          {quickPrompts.map((prompt, index) => (
            <button
              key={index}
              className="quick-prompt-btn"
              onClick={() => {
                setInput(prompt.substring(2).trim());
              }}
              disabled={loading}
            >
              {prompt}
            </button>
          ))}
        </div>

        <div className="chat-input-container">
          <textarea
            className="chat-input"
            placeholder="Ask me anything... (Press Enter to send)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
            rows={1}
          />
          <button
            className="send-button"
            onClick={handleSend}
            disabled={loading || !input.trim()}
          >
            {loading ? '⏳' : '📤'}
          </button>
        </div>
      </div>

      <style>{`
        .ai-teacher-container {
          display: flex;
          flex-direction: column;
          height: calc(100vh - 200px);
          background: var(--bg-primary, #ffffff);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .ai-teacher-header {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          padding: 1.5rem;
        }

        .header-content {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .ai-avatar {
          width: 60px;
          height: 60px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          backdrop-filter: blur(10px);
        }

        .header-info h2 {
          margin: 0;
          font-size: 1.5rem;
        }

        .status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin: 0.25rem 0 0;
          opacity: 0.9;
          font-size: 0.875rem;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          background: #4ade80;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .chat-container {
          display: flex;
          flex-direction: column;
          flex: 1;
          overflow: hidden;
        }

        .messages-list {
          flex: 1;
          overflow-y: auto;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .message {
          display: flex;
          gap: 0.75rem;
          animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .message.user {
          flex-direction: row-reverse;
        }

        .message-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          flex-shrink: 0;
        }

        .message.assistant .message-avatar {
          background: linear-gradient(135deg, #667eea, #764ba2);
        }

        .message.user .message-avatar {
          background: var(--bg-secondary, #f1f5f9);
        }

        .message-content {
          max-width: 70%;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .message.user .message-content {
          align-items: flex-end;
        }

        .message-text {
          padding: 0.875rem 1.125rem;
          border-radius: 16px;
          line-height: 1.5;
          white-space: pre-wrap;
          word-wrap: break-word;
        }

        .message.assistant .message-text {
          background: var(--bg-secondary, #f1f5f9);
          color: var(--text-primary, #1e293b);
          border-bottom-left-radius: 4px;
        }

        .message.user .message-text {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border-bottom-right-radius: 4px;
        }

        .message-time {
          font-size: 0.75rem;
          color: var(--text-secondary, #64748b);
          padding: 0 0.5rem;
        }

        .typing-indicator {
          display: flex;
          gap: 0.25rem;
          padding: 1rem;
          background: var(--bg-secondary, #f1f5f9);
          border-radius: 16px;
          border-bottom-left-radius: 4px;
        }

        .typing-indicator span {
          width: 8px;
          height: 8px;
          background: #64748b;
          border-radius: 50%;
          animation: bounce 1.4s infinite ease-in-out;
        }

        .typing-indicator span:nth-child(1) {
          animation-delay: -0.32s;
        }

        .typing-indicator span:nth-child(2) {
          animation-delay: -0.16s;
        }

        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }

        .quick-prompts {
          display: flex;
          gap: 0.5rem;
          padding: 1rem 1.5rem 0;
          flex-wrap: wrap;
        }

        .quick-prompt-btn {
          padding: 0.5rem 1rem;
          border: 1px solid var(--border-color, rgba(100, 116, 139, 0.2));
          background: var(--bg-secondary, #f1f5f9);
          border-radius: 20px;
          cursor: pointer;
          font-size: 0.875rem;
          transition: all 0.2s ease;
        }

        .quick-prompt-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border-color: transparent;
          transform: translateY(-2px);
        }

        .quick-prompt-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .chat-input-container {
          display: flex;
          gap: 0.75rem;
          padding: 1.5rem;
          border-top: 1px solid var(--border-color, rgba(100, 116, 139, 0.1));
          background: var(--bg-primary, #ffffff);
        }

        .chat-input {
          flex: 1;
          padding: 0.875rem 1.125rem;
          border: 1px solid var(--border-color, rgba(100, 116, 139, 0.2));
          border-radius: 12px;
          resize: none;
          font-family: inherit;
          font-size: 0.9375rem;
          line-height: 1.5;
          max-height: 120px;
          transition: border-color 0.2s ease;
        }

        .chat-input:focus {
          outline: none;
          border-color: #667eea;
        }

        .chat-input:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .send-button {
          width: 48px;
          height: 48px;
          border: none;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border-radius: 12px;
          cursor: pointer;
          font-size: 1.25rem;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .send-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .send-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default AITeacher;
