'use client'

import { useState, useRef, useEffect } from 'react'
declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
}

function ChatMessage({ msg }: { msg: Message }) {
  const isUser = msg.role === 'user'
  return (
    <div className="fade-in" style={{
      display: 'flex',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      marginBottom: '16px',
      padding: '0 16px',
    }}>
      {!isUser && (
        <div style={{
          width: '28px', height: '28px',
          borderRadius: '50%',
          background: 'var(--accent)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-mono)',
          fontSize: '11px', fontWeight: 700, color: '#000',
          marginRight: '10px',
          flexShrink: 0,
          marginTop: '2px',
        }}>AI</div>
      )}
      <div style={{
        maxWidth: '80%',
        padding: '12px 16px',
        borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
        background: isUser ? 'var(--accent)' : 'var(--bg-surface)',
        color: isUser ? '#000' : 'var(--text-primary)',
        fontSize: '15px',
        lineHeight: 1.6,
        border: isUser ? 'none' : '1px solid var(--border-default)',
        fontWeight: isUser ? 500 : 400,
      }}>
        {msg.content}
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0 16px 16px 54px' }}>
      <div className="typing-dot" />
      <div className="typing-dot" />
      <div className="typing-dot" />
    </div>
  )
}

const QUICK_COMMANDS = [
  '+ Завдання',
  '+ Подія',
  '+ Звичка',
  '+ Нотатка',
]

const WELCOME: Message = {
  id: 'welcome',
  role: 'assistant',
  content: 'Чим я можу допомогти сьогодні?\n\nСпробуйте: "Створи завдання перевірити звіт до п’ятниці" або "Що у мене заплановано на завтра?"',
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [recording, setRecording] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {

  const savedChat = localStorage.getItem("ai-chat-history")


  if (savedChat) {

    setMessages(JSON.parse(savedChat))

  } else {

    setMessages([WELCOME])

  }

}, [])

useEffect(() => {

  if (messages.length > 0) {

    localStorage.setItem(
      "ai-chat-history",
      JSON.stringify(messages)
    )

  }

}, [messages])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

function newChat() {

  localStorage.removeItem("ai-chat-history")

  setMessages([WELCOME])

}

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-10),
        }),
      })
      const data = await res.json()
      const reply = data.reply || 'Something went wrong. Try again.'
      const aiMsg: Message = { id: Date.now().toString() + '_ai', role: 'assistant', content: reply }
      setMessages((prev) => [...prev, aiMsg])
    } catch {
      const errMsg: Message = { id: Date.now().toString() + '_err', role: 'assistant', content: 'Помилка з’єднання. Спробуйте ще раз.' }
      setMessages((prev) => [...prev, errMsg])
    } finally {
      setLoading(false)
    }
  }

function startVoice() {

  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition


  if (!SpeechRecognition) {
    alert("Голосове введення не підтримується")
    return
  }


  const recognition = new SpeechRecognition()


  recognition.lang = "uk-UA"

  recognition.continuous = false

  recognition.interimResults = false



  recognition.onstart = () => {
    setRecording(true)
  }



  recognition.onend = () => {
    setRecording(false)
  }



  recognition.onresult = (event: any) => {

    const text =
      event.results[0][0].transcript


    setInput((prev) =>
      prev
        ? prev + " " + text
        : text
    )

  }



  recognition.start()

}

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', paddingTop: '16px' }}>
        {messages.map((msg) => <ChatMessage key={msg.id} msg={msg} />)}
        {loading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

<div
  style={{
    display: "flex",
    justifyContent: "flex-end",
    padding: "8px 16px"
  }}
>

<button
  onClick={newChat}
  style={{
    background:"transparent",
    border:"1px solid var(--border-default)",
    color:"var(--accent)",
    borderRadius:"8px",
    padding:"6px 12px",
    cursor:"pointer",
    fontFamily:"var(--font-mono)",
    fontSize:"12px"
  }}
>
  + Новий чат
</button>

</div>

      {/* Quick commands */}
      <div style={{
        display: 'flex',
        gap: '8px',
        padding: '8px 16px',
        overflowX: 'auto',
        scrollbarWidth: 'none',
      }}>
        {QUICK_COMMANDS.map((cmd) => (
          <button
            key={cmd}
            onClick={() => sendMessage(cmd)}
            style={{
              flexShrink: 0,
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--accent)',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              padding: '6px 12px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease',
            }}
          >
            {cmd}
          </button>
        ))}
      </div>

      {/* Input */}
      <div style={{
        padding: '12px 16px 16px',
        borderTop: '1px solid var(--border-subtle)',
        background: 'rgba(10,10,10,0.8)',
        backdropFilter: 'blur(20px)',
      }}>
        <div style={{
          display: 'flex',
          gap: '10px',
          alignItems: 'flex-end',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-lg)',
          padding: '10px 14px',
          transition: 'border-color 0.2s ease',
        }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
              e.target.style.height = 'auto'
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
            }}
            onKeyDown={handleKey}
            placeholder="Напишіть повідомлення AI Planner..."
            rows={1}
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontSize: '15px',
              lineHeight: 1.5,
              resize: 'none',
              fontFamily: 'var(--font-sans)',
              maxHeight: '120px',
              overflowY: 'auto',
            }}
          />
<button
  onClick={startVoice}
  style={{
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: recording
      ? 'var(--accent)'
      : 'var(--bg-elevated)',
    border: '1px solid var(--border-default)',
    color: recording
      ? '#000'
      : 'var(--text-muted)',
    fontSize: '18px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  }}
>
  {recording ? "🔴" : "🎤"}
</button>

          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading}
            style={{
              width: '36px', height: '36px',
              borderRadius: '50%',
              background: input.trim() ? 'var(--accent)' : 'var(--bg-elevated)',
              border: '1px solid var(--border-default)',
              color: input.trim() ? '#000' : 'var(--text-muted)',
              fontSize: '16px',
              cursor: input.trim() ? 'pointer' : 'default',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s ease',
              flexShrink: 0,
            }}
          >
            ▶
          </button>
        </div>
      </div>
    </div>
  )
}
