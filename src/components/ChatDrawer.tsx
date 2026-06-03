import React, { useState, useEffect, useRef } from 'react';
import { Send, X, MessageSquare, ShieldAlert } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../supabaseClient';
import type { Message } from '../types';

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserEmail: string;
  otherUserEmail: string;
  otherUserName: string;
}

export default function ChatDrawer({
  isOpen,
  onClose,
  currentUserEmail,
  otherUserEmail,
  otherUserName
}: ChatDrawerProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 1. Fetch message history
  useEffect(() => {
    if (!isOpen || !currentUserEmail || !otherUserEmail) return;

    const fetchMessages = async () => {
      setLoading(true);
      if (isSupabaseConfigured()) {
        try {
          const { data, error } = await supabase
            .from('messages')
            .select('*')
            .or(`and(sender_email.eq.${currentUserEmail},receiver_email.eq.${otherUserEmail}),and(sender_email.eq.${otherUserEmail},receiver_email.eq.${currentUserEmail})`)
            .order('created_at', { ascending: true });

          if (!error && data) {
            setMessages(data);
          }
        } catch (err) {
          console.error('Gagal mengambil riwayat pesan:', err);
        }
      } else {
        // LocalStorage mock chat history
        const localKey = `sewarion_chat_${[currentUserEmail, otherUserEmail].sort().join('_')}`;
        const raw = localStorage.getItem(localKey);
        setMessages(raw ? JSON.parse(raw) : []);
      }
      setLoading(false);
      setTimeout(scrollBottom, 100);
    };

    const timer = setTimeout(fetchMessages, 50);
    return () => clearTimeout(timer);
  }, [isOpen, currentUserEmail, otherUserEmail]);

  // 2. Realtime listener for message inserts
  useEffect(() => {
    if (!isOpen || !currentUserEmail || !otherUserEmail || !isSupabaseConfigured()) return;

    const channel = supabase
      .channel('messages_realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          const newMsg = payload.new as Message;
          // Filter if the message belongs to this conversation
          const isRelated =
            (newMsg.sender_email === currentUserEmail && newMsg.receiver_email === otherUserEmail) ||
            (newMsg.sender_email === otherUserEmail && newMsg.receiver_email === currentUserEmail);

          if (isRelated) {
            setMessages((prev) => {
              // Avoid duplicates
              if (prev.some((m) => m.id === newMsg.id)) return prev;
              return [...prev, newMsg];
            });
            setTimeout(scrollBottom, 50);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isOpen, currentUserEmail, otherUserEmail]);

  // Auto-scroll when messages change
  useEffect(() => {
    scrollBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || !currentUserEmail || !otherUserEmail) return;

    const text = inputVal.trim();
    setInputVal('');

    const newMsg: Message = {
      sender_email: currentUserEmail,
      receiver_email: otherUserEmail,
      content: text,
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('messages')
          .insert({
            sender_email: currentUserEmail,
            receiver_email: otherUserEmail,
            content: text
          })
          .select()
          .single();

        if (!error && data) {
          setMessages((prev) => [...prev, data]);
        }
      } catch (err) {
        console.error('Gagal mengirim pesan ke cloud:', err);
      }
    } else {
      // LocalStorage mock fallback persistence
      const localKey = `sewarion_chat_${[currentUserEmail, otherUserEmail].sort().join('_')}`;
      const existing = [...messages, { ...newMsg, id: `msg-${Date.now()}` }];
      setMessages(existing);
      localStorage.setItem(localKey, JSON.stringify(existing));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end font-sans">
      {/* Backdrop overlay */}
      <div onClick={onClose} className="fixed inset-0 bg-black/45 backdrop-blur-xs animate-in fade-in" />

      {/* Slide panel */}
      <div className="relative w-96 max-w-full bg-[#f7fcf5] dark:bg-[#0f140e] h-full shadow-2xl flex flex-col justify-between border-l border-[#bdcaba] dark:border-[#2b3a27] z-10 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 border-b border-[#bdcaba] dark:border-[#2b3a27] bg-[#e9f0e5] dark:bg-[#151f14] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#006b2c] text-white flex items-center justify-center font-bold text-sm">
              {otherUserName ? otherUserName[0].toUpperCase() : 'U'}
            </div>
            <div className="text-left">
              <h4 className="text-sm font-extrabold text-[#171d16] dark:text-[#dde5d9] line-clamp-1">{otherUserName}</h4>
              <p className="text-[10px] text-[#546253] dark:text-[#9bb198] line-clamp-1">{otherUserEmail}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white dark:hover:bg-[#202e1c] text-[#546253] dark:text-[#9bb198] focus:outline-none transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messaging Logs Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f7fcf5] dark:bg-[#0f140e]">
          {!isSupabaseConfigured() && (
            <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900/35 text-yellow-800 dark:text-yellow-200 text-[10px] rounded-xl flex items-start gap-2 text-left mb-2">
              <ShieldAlert className="w-4 h-4 text-yellow-600 flex-shrink-0" />
              <span>
                <strong>Mode Simulasi</strong>: Supabase URL/Anon Key belum dikonfigurasi. Chat saat ini disimpan secara lokal di browser Anda.
              </span>
            </div>
          )}

          {loading ? (
            <div className="h-full flex items-center justify-center text-xs text-[#829281]">
              Memuat percakapan...
            </div>
          ) : messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-xs text-[#829281] py-20">
              <MessageSquare className="w-8 h-8 text-[#bdcaba] dark:text-[#435241] mb-2" />
              <span>Mulai kirim pesan untuk berkoordinasi serah terima barang sewaan.</span>
            </div>
          ) : (
            messages.map((msg, idx) => {
              const isMe = msg.sender_email === currentUserEmail;
              return (
                <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in duration-200`}>
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-xs text-left shadow-sm ${
                      isMe
                        ? 'bg-[#006b2c] text-white rounded-tr-none'
                        : 'bg-white dark:bg-[#1c261b] border border-[#bdcaba]/60 dark:border-[#384c34]/60 text-[#171d16] dark:text-[#dde5d9] rounded-tl-none'
                    }`}
                  >
                    <p className="leading-relaxed break-words">{msg.content}</p>
                    <span
                      className={`block text-[8px] text-right mt-1 ${
                        isMe ? 'text-white/70' : 'text-[#829281]'
                      }`}
                    >
                      {msg.created_at ? new Date(msg.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="p-3 border-t border-[#bdcaba] dark:border-[#2b3a27] bg-white dark:bg-[#121811] flex gap-2">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="flex-1 bg-[#eff6ea]/55 dark:bg-[#1a2319]/55 border border-[#bdcaba] dark:border-[#334630] rounded-xl h-10 px-4 font-sans text-xs text-[#171d16] dark:text-[#dde5d9] outline-none focus:border-[#006b2c] dark:focus:border-[#00873a]"
            placeholder="Tulis pesan..."
            required
          />
          <button
            type="submit"
            className="bg-[#006b2c] hover:bg-[#00873a] text-white w-10 h-10 rounded-xl flex items-center justify-center active:scale-95 transition-all focus:outline-none"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
