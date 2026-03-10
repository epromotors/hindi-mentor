"use client";
import { useState } from "react";

export default function QuizMode({ chapter }) {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);

  async function startQuiz() {
    setLoading(true);
    const res = await fetch("/api/quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chapterContent: chapter.content,
        chapterTitle: chapter.title,
        count: 5
      })
    });
    const data = await res.json();
    setQuestions(data.questions);
    setLoading(false);
    setStarted(true);
    setCurrent(0);
    setScore(0);
    setSelected(null);
    setDone(false);
  }

  function handleAnswer(option) {
    if (selected) return;
    setSelected(option);
    if (option === questions[current].correct) setScore(s => s + 1);
  }

  function nextQuestion() {
    if (current + 1 >= questions.length) { setDone(true); return; }
    setCurrent(c => c + 1);
    setSelected(null);
  }

  if (!started) return (
    <div style={styles.center}>
      <div style={styles.startCard}>
        <p style={styles.emoji}>📝</p>
        <h3 style={styles.title}>Quiz Mode</h3>
        <p style={styles.sub}>इस chapter पर अपनी knowledge test करें!</p>
        <button onClick={startQuiz} style={styles.startBtn} disabled={loading}>
          {loading ? "⏳ प्रश्न बन रहे हैं..." : "🚀 Quiz शुरू करें"}
        </button>
      </div>
    </div>
  );

  if (done) return (
    <div style={styles.center}>
      <div style={styles.startCard}>
        <p style={styles.emoji}>🎉</p>
        <h2 style={styles.title}>Quiz पूरा हुआ!</h2>
        <p style={styles.scoreText}>
          आपका Score: <strong style={{color:"#4f46e5"}}>{score}/{questions.length}</strong>
        </p>
        {score === questions.length && <p style={{color:"#16a34a"}}>🏆 शाबाश! सभी सही!</p>}
        {score >= questions.length / 2 && score < questions.length && <p style={{color:"#ca8a04"}}>👍 अच्छा प्रयास!</p>}
        {score < questions.length / 2 && <p style={{color:"#dc2626"}}>📖 एक बार और notes पढ़ें!</p>}
        <button onClick={startQuiz} style={styles.startBtn}>🔄 फिर से खेलें</button>
      </div>
    </div>
  );

  const q = questions[current];
  return (
    <div style={styles.quizBox}>
      {/* Progress */}
      <div style={styles.progress}>
        <span>प्रश्न {current + 1}/{questions.length}</span>
        <span>Score: {score} ⭐</span>
      </div>

      {/* Progress Bar */}
      <div style={styles.progressBar}>
        <div style={{ ...styles.progressFill, width: `${((current + 1) / questions.length) * 100}%` }} />
      </div>

      {/* Question */}
      <h3 style={styles.question}>{q.question}</h3>

      {/* Options */}
      <div style={styles.options}>
        {Object.entries(q.options).map(([key, val]) => {
          let bg = "white";
          if (selected) {
            if (key === q.correct) bg = "#dcfce7";
            else if (key === selected) bg = "#fee2e2";
          }
          return (
            <button key={key} onClick={() => handleAnswer(key)}
              style={{ ...styles.option, background: bg, border: selected && key === q.correct ? "2px solid #16a34a" : selected && key === selected ? "2px solid #dc2626" : "2px solid #e5e7eb" }}>
              <strong style={styles.optKey}>{key}</strong> {val}
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {selected && (
        <div style={styles.explanation}>
          <p>💡 <strong>Explanation:</strong> {q.explanation}</p>
          <button onClick={nextQuestion} style={styles.nextBtn}>
            {current + 1 >= questions.length ? "Result देखें 🎯" : "अगला प्रश्न →"}
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  center: { display:"flex", justifyContent:"center", alignItems:"center", padding:"40px" },
  startCard: { textAlign:"center", padding:"40px", background:"white", borderRadius:"16px", border:"1px solid #e5e7eb", maxWidth:"400px", width:"100%" },
  emoji: { fontSize:"48px", margin:"0 0 10px" },
  title: { margin:"0 0 8px", color:"#1e1b4b" },
  sub: { color:"#6b7280", marginBottom:"24px" },
  scoreText: { fontSize:"24px", margin:"10px 0 20px" },
  startBtn: { padding:"14px 32px", background:"#4f46e5", color:"white", border:"none", borderRadius:"10px", fontSize:"16px", cursor:"pointer", fontWeight:"600" },
  quizBox: { padding:"24px" },
  progress: { display:"flex", justifyContent:"space-between", marginBottom:"8px", color:"#6b7280", fontSize:"14px" },
  progressBar: { height:"6px", background:"#e5e7eb", borderRadius:"99px", marginBottom:"24px" },
  progressFill: { height:"100%", background:"#4f46e5", borderRadius:"99px", transition:"width 0.3s" },
  question: { fontSize:"18px", color:"#1e1b4b", marginBottom:"20px", lineHeight:"1.6" },
  options: { display:"flex", flexDirection:"column", gap:"12px" },
  option: { padding:"14px 16px", borderRadius:"10px", cursor:"pointer", textAlign:"left", fontSize:"15px", transition:"all 0.2s" },
  optKey: { display:"inline-block", width:"24px", color:"#4f46e5" },
  explanation: { marginTop:"20px", padding:"16px", background:"#f0f9ff", borderRadius:"10px", border:"1px solid #bae6fd" },
  nextBtn: { marginTop:"12px", padding:"12px 24px", background:"#4f46e5", color:"white", border:"none", borderRadius:"8px", cursor:"pointer", fontWeight:"600", fontSize:"15px" }
};

