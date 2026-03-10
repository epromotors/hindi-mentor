"use client";
import { useState, useEffect } from "react";

export default function HomePage() {
  const [chapters, setChapters] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [level, setLevel] = useState("ALL");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/upload")
      .then(r => r.json())
      .then(data => {
        setChapters(data.chapters || []);
        setFiltered(data.chapters || []);
      });
  }, []);

  useEffect(() => {
    let result = chapters;
    if (level !== "ALL") result = result.filter(c => c.level === level);
    if (search) result = result.filter(c =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.subject.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [level, search, chapters]);

  return (
    <div style={styles.page}>
      {/* Hero */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>📚 Hindi Mentor</h1>
        <p style={styles.heroSub}>B.A. & M.A. छात्रों के लिए AI-powered हिंदी शिक्षक</p>
      </div>

      {/* Filters */}
      <div style={styles.filters}>
        <input
          placeholder="🔍 Subject या Chapter खोजें..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={styles.search}
        />
        <div style={styles.levelBtns}>
          {["ALL", "BA", "MA"].map(l => (
            <button key={l} onClick={() => setLevel(l)}
              style={{ ...styles.levelBtn, background: level === l ? "#4f46e5" : "white", color: level === l ? "white" : "#374151" }}>
              {l === "ALL" ? "सभी" : l}
            </button>
          ))}
        </div>
      </div>

      {/* Chapter Cards */}
      {filtered.length === 0 ? (
        <div style={styles.empty}>
          <p>📭 अभी कोई Notes नहीं हैं।</p>
          <a href="/admin" style={styles.uploadLink}>Admin Panel से Notes Upload करें →</a>
        </div>
      ) : (
        <div style={styles.grid}>
          {filtered.map(chapter => (
            <a key={chapter.id} href={`/chapter/${chapter.id}`} style={styles.card}>
              <div style={styles.cardTop}>
                <span style={styles.badge}>{chapter.level}</span>
                <span style={styles.subject}>{chapter.subject}</span>
              </div>
              <h3 style={styles.cardTitle}>{chapter.title}</h3>
              <p style={styles.cardPreview}>
                {chapter.content.substring(0, 100)}...
              </p>
              <div style={styles.cardFooter}>
                <span>🧑‍🏫 Mentor से पूछें</span>
                <span>📝 Quiz दें</span>
              </div>
            </a>
          ))}
        </div>
      )}

      {/* Admin Link */}
      <div style={styles.adminBar}>
        <a href="/admin" style={styles.adminLink}>🔐 Admin Panel</a>
      </div>
    </div>
  );
}

const styles = {
  page: { maxWidth:"1000px", margin:"0 auto", padding:"20px", fontFamily:"sans-serif" },
  hero: { textAlign:"center", padding:"50px 20px 30px", background:"linear-gradient(135deg, #4f46e5, #7c3aed)", borderRadius:"20px", marginBottom:"30px", color:"white" },
  heroTitle: { margin:"0 0 10px", fontSize:"36px" },
  heroSub: { margin:0, fontSize:"16px", opacity:0.9 },
  filters: { display:"flex", gap:"12px", marginBottom:"24px", flexWrap:"wrap", alignItems:"center" },
  search: { flex:1, minWidth:"200px", padding:"12px 16px", borderRadius:"10px", border:"1px solid #ddd", fontSize:"15px" },
  levelBtns: { display:"flex", gap:"8px" },
  levelBtn: { padding:"10px 20px", border:"2px solid #4f46e5", borderRadius:"8px", cursor:"pointer", fontWeight:"600" },
  grid: { display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))", gap:"20px" },
  card: { background:"white", borderRadius:"16px", padding:"20px", border:"1px solid #e5e7eb", textDecoration:"none", color:"inherit", display:"block", transition:"transform 0.2s, box-shadow 0.2s", boxShadow:"0 2px 8px rgba(0,0,0,0.05)" },
  cardTop: { display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"12px" },
  badge: { background:"#ede9fe", color:"#4f46e5", padding:"4px 10px", borderRadius:"20px", fontSize:"12px", fontWeight:"600" },
  subject: { color:"#6b7280", fontSize:"13px" },
  cardTitle: { margin:"0 0 8px", color:"#1e1b4b", fontSize:"17px" },
  cardPreview: { color:"#9ca3af", fontSize:"13px", lineHeight:"1.5", margin:"0 0 16px" },
  cardFooter: { display:"flex", justifyContent:"space-between", fontSize:"12px", color:"#4f46e5", fontWeight:"600" },
  empty: { textAlign:"center", padding:"60px", color:"#6b7280" },
  uploadLink: { color:"#4f46e5", fontWeight:"600", textDecoration:"none", display:"block", marginTop:"10px" },
  adminBar: { textAlign:"center", marginTop:"40px", paddingTop:"20px", borderTop:"1px solid #e5e7eb" },
  adminLink: { color:"#9ca3af", fontSize:"13px", textDecoration:"none" }
};
