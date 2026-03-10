"use client";
import { useState, useEffect, useRef } from "react";

export default function MentorChat({ chapter }) {
  const [messages, setMessages] = useState([{
    role: "assistant",
    text: `नमस्ते! 🙏 मैं आपका AI मेंटर हूँ।\n"${chapter.title}" से जुड़ा कोई भी सवाल पूछें — बोलकर या लिखकर!`
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const bottomRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Voice Input Setup
  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.lang = "hi-IN";
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.onresult = (e) => {
        setInput(e.results[0][0].transcript);
        setListening(false);
      };
      recognition.onerror = () => setListening(false);
      recognition.onend = () => setListening(false);
      recognitionRef.current = recognition;
    }
  }, []);

  function toggleVoice() {
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
    } else {
      recognitionRef.current?.start();
      setListening(true);
    }
  }

  function speakText(text) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "hi-IN";
    utterance.rate = 0.9;
    setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }

  function stopSpeaking() {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }

  async function askMentor() {
    if (!input.trim()) return;
    const userMsg = { role: "user", text: input };
    const updatedMsgs = [...messages, userMsg];
    setMessages(updatedMsgs);
    setInput("");
    setLoading(true);

    const history = updatedMsgs.slice(1).map(m => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.text }]
    }));

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: userMsg.text,
        chapterContent: chapter.content,
        history: history.slice(0, -1)
      })
    });

    const data = await res.json();
    const answer = data.answer;
    setMessages(prev => [...prev, { role: "assistant", text: answer }]);
    setLoading(false);
    speakText(answer);
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <span>🧑‍🏫 AI मेंटर — {chapter.title}</span>
        {speaking && (
          <button onClick={stopSpeaking} style={styles.stopBtn}>🔇 बंद करें</button>
        )}
      </div>

      {/* Messages */}
      <div style={styles.messagesBox}>
        {messages.map((m, i) => (
          <div key={i} style={{ ...styles.msgRow, justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            {m.role === "assistant" && <span style={styles.avatar}>🧑‍🏫</span>}
            <div style={{ ...styles.bubble, background: m.role === "user" ? "#4f46e5" : "#f3f4f6", color: m.role === "user" ? "white" : "#111" }}>
              <p style={{ whiteSpace: "pre-wrap", margin: 0 }}>{m.text}</p>
              {m.role === "assistant" && (
                <button onClick={() => speakText(m.text)} style={styles.speakBtn}>🔊 सुनें</button>
              )}
            </div>
            {m.role === "user" && <span style={styles.avatar}>🎓</span>}
          </div>
        ))}
        {loading && (
          <div style={{ ...styles.msgRow, justifyContent: "flex-start" }}>
            <span style={styles.avatar}>🧑‍🏫</span>
            <div style={{ ...styles.bubble, background: "#f3f4f6" }}>
              <p style={{ margin: 0 }}>मेंटर सोच रहे हैं... ⏳</p>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick Prompts */}
      <div style={styles.quickRow}>
        {["और विस्तार से बताएं", "उदाहरण दें", "आसान भाषा में", "मुख्य बिंदु"].map(p => (
          <button key={p} onClick={() => setInput(p)} style={styles.quickBtn}>{p}</button>
        ))}
      </div>

      {/* Input Row */}
      <div style={styles.inputRow}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && askMentor()}
          placeholder="सवाल लिखें या 🎤 से बोलें..."
          style={styles.input}
        />
        <button onClick={toggleVoice}
          style={{ ...styles.micBtn, background: listening ? "#ef4444" : "#6366f1" }}>
          {listening ? "🔴" : "🎤"}
        </button>
        <button onClick={askMentor} style={styles.sendBtn}>पूछें →</button>
      </div>
    </div>
  );
}

const styles = {
  container: { display:"flex", flexDirection:"column", height:"100%", border:"1px solid #e5e7eb", borderRadius:"16px", overflow:"hidden", background:"white" },
  header: { padding:"16px 20px", background:"#4f46e5", color:"white", fontWeight:"600", display:"flex", justifyContent:"space-between", alignItems:"center" },
  stopBtn: { background:"rgba(255,255,255,0.2)", border:"none", color:"white", padding:"6px 12px", borderRadius:"8px", cursor:"pointer" },
  messagesBox: { flex:1, overflowY:"auto", padding:"16px", display:"flex", flexDirection:"column", gap:"12px", minHeight:"300px", maxHeight:"400px" },
  msgRow: { display:"flex", alignItems:"flex-start", gap:"8px" },
  avatar: { fontSize:"24px", flexShrink:0 },
  bubble: { padding:"12px 16px", borderRadius:"12px", maxWidth:"80%" },
  speakBtn: { background:"none", border:"none", cursor:"pointer", fontSize:"12px", marginTop:"6px", color:"#6b7280" },
  quickRow: { padding:"8px 16px", display:"flex", gap:"8px", flexWrap:"wrap", borderTop:"1px solid #f3f4f6" },
  quickBtn: { padding:"6px 12px", background:"#f3f4f6", border:"none", borderRadius:"20px", cursor:"pointer", fontSize:"13px", color:"#374151" },
  inputRow: { padding:"12px 16px", display:"flex", gap:"8px", borderTop:"1px solid #e5e7eb" },
  input: { flex:1, padding:"12px", borderRadius:"8px", border:"1px solid #ddd", fontSize:"15px" },
  micBtn: { padding:"12px", borderRadius:"8px", border:"none", color:"white", cursor:"pointer", fontSize:"18px" },
  sendBtn: { padding:"12px 20px", background:"#4f46e5", color:"white", border:"none", borderRadius:"8px", cursor:"pointer", fontWeight:"600" }
};
