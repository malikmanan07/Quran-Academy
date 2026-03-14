import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import useMessages from '../../hooks/useMessages';

const MessagesPage = () => {
  const { user } = useAuth();
  const [selectedPartner, setSelectedPartner] = useState(null);
  const { conversations, messages, sendMessage, loading, fetchInbox } = useMessages(selectedPartner?.partner_id);
  const [newMessage, setNewMessage] = useState('');
  const scrollRef = useRef();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedPartner) return;
    try {
      await sendMessage(selectedPartner.partner_id, newMessage);
      setNewMessage('');
    } catch (err) {
      alert('Failed to send message');
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex bg-white rounded-2xl shadow-sm border border-[#E2E8F0] overflow-hidden">
      {/* Left Panel: Conversations */}
      <div className="w-full md:w-80 border-r border-[#E2E8F0] flex flex-col">
        <div className="p-4 border-b border-[#E2E8F0] bg-gray-50/50">
          <h2 className="text-lg font-bold text-[#1A1A2E]">Messages</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-8 text-center text-sm text-[#4A5568]">No conversations yet</div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.partner_id}
                onClick={() => setSelectedPartner(conv)}
                className={`flex items-center gap-3 p-4 cursor-pointer transition-colors hover:bg-gray-50 ${selectedPartner?.partner_id === conv.partner_id ? 'bg-[#00B4D8]/5 border-r-4 border-[#00B4D8]' : ''}`}
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1B3A5C] to-[#1B4332] flex items-center justify-center text-white font-bold shrink-0">
                  {conv.partner_name?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <p className="font-semibold text-[#1A1A2E] truncate">{conv.partner_name}</p>
                    <span className="text-[10px] text-[#4A5568]">{conv.created_at ? new Date(conv.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                  </div>
                  <p className="text-xs text-[#4A5568] truncate">{conv.message}</p>
                </div>
                {conv.is_read === false && conv.receiver_id === user.id && (
                  <div className="w-2 h-2 rounded-full bg-[#00B4D8]"></div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Panel: Chat Window */}
      <div className="hidden md:flex flex-1 flex-col bg-gray-50/30">
        {selectedPartner ? (
          <>
            <div className="p-4 border-b border-[#E2E8F0] bg-white flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1B3A5C] to-[#1B4332] flex items-center justify-center text-white font-bold">
                {selectedPartner.partner_name?.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-[#1A1A2E]">{selectedPartner.partner_name}</p>
                <p className="text-[10px] text-[#4A5568] uppercase tracking-wider">{selectedPartner.partner_role}</p>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto space-y-4">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.senderId === user.id ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] p-3 rounded-2xl shadow-sm text-sm ${m.senderId === user.id ? 'bg-[#1B3A5C] text-white rounded-tr-none' : 'bg-white text-[#1A1A2E] border border-[#E2E8F0] rounded-tl-none'}`}>
                    <p>{m.message}</p>
                    <p className={`text-[10px] mt-1 text-right ${m.senderId === user.id ? 'text-blue-100' : 'text-gray-400'}`}>
                      {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSend} className="p-4 bg-white border-t border-[#E2E8F0]">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="w-full pl-4 pr-12 py-3 rounded-xl border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#00B4D8] focus:border-transparent"
                />
                <button
                  type="submit"
                  className="absolute right-2 p-2 text-[#00B4D8] hover:text-[#1B3A5C] transition-colors"
                >
                  <svg className="w-6 h-6 rotate-90" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-[#4A5568]">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-lg font-semibold">Select a conversation to start chatting</p>
            <p className="text-sm">Stay connected with your teachers and students</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
