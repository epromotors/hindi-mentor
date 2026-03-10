"use client";
import { useState, useEffect } from "react";
import MentorChat from "@/components/MentorChat";
import QuizMode from "@/components/QuizMode";

export default function ChapterPage({ params }) {
  const [chapter, setChapter] = useState(null);
  const [activeTab, setActiveTab] = useState("notes");

  useEffect(() => {
    fetch("/api/upload")
      .then(r => r.json())
      .then(data => {
        const found = data.chapters.find(c => c.id === params.id);
        setChapter(found);
      });
  }, [params.id]);

  if (!chapter) return (
    <div style={styles.loading}>⏳ Chapter लोड हो रहा है...</div>
  );

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <a href="/" style={styles.back}>← वापस जाएं</a>
        <div>
          <h1 style={styles.title}>{chapter.title}</h1>
          <p style={styles.meta}>{chapter.subject} • {chapter.level}</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        {["notes", "mentor", "quiz"].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            style={{ ...styles.tab, background: activeTab === tab ? "#4f46e5" : "white", color: activeTab === tab ? "white" : "#374151" }}>
            {tab === "notes" && "📖 Notes"}
            {tab === "mentor" && "🧑‍🏫 Mentor से पूछें"}
            {tab === "quiz" && "📝 Quiz"}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={styles.content}>
        {activeTab === "notes" && (
          <div style={styles.notesBox}>
            <pre style={styles.notesText}>{chapter.content}</pre>
          </div>
        )}
        {activeTab === "mentor" && <MentorChat chapter={chapter} />}
        {activeTab === "quiz" && <QuizMode chapter={chapter} />}
      </div>
    </div>
  );
}

const styles = {
  page: { maxWidth:"900px", margin:"0 auto", padding:"20px" },
  loading: { textAlign:"center", padding:"100px", fontSize:"18px" },
  header: { marginBottom:"24px" },
  back: { color:"#4f46e5", textDecoration:"none", fontSize:"14px", fontWeight:"600" },
  title: { margin:"8px 0 4px", fontSize:"28px", color:"#1e1b4b" },
  meta: { color:"#6b7280", margin:0 },
  tabs: { display:"flex", gap:"8px", marginBottom:"24px", flexWrap:"wrap" },
  tab: { padding:"10px 20px", border:"2px solid #4f46e5", borderRadius:"8px", cursor:"pointer", fontWeight:"600", fontSize:"14px" },
  content: { background:"white", borderRadius:"16px", border:"1px solid #e5e7eb", overflow:"hidden" },
  notesBox: { padding:"24px", maxHeight:"600px", overflowY:"auto" },
  notesText: { whiteSpace:"pre-wrap", fontFamily:"inherit", lineHeight:"1.8", color:"#374151", fontSize:"15px" }
};
