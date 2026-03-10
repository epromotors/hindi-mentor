"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const [file, setFile] = useState(null);
  const [subject, setSubject] = useState("");
  const [level, setLevel] = useState("BA");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleUpload(e) {
    e.preventDefault();
    if (!file || !subject) return;
    setLoading(true);
    setStatus("⏳ Upload हो रहा है...");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("subject", subject);
    formData.append("level", level);

    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();

    setLoading(false);
    if (data.success)
      setStatus(`✅ ${data.count} Chapters successfully upload हो गए!`);
    else
      setStatus("❌ Error आई, फिर try करें");
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>📚 Admin Panel</h1>
        <p style={styles.subtitle}>Hindi Mentor — Notes Upload करें</p>

        <form onSubmit={handleUpload} style={styles.form}>
          <label style={styles.label}>Subject का नाम</label>
          <input
            type="text"
            placeholder="जैसे: Hindi Sahitya, Sociology"
            value={subject}
            onChange={e => setSubject(e.target.value)}
            style={styles.input}
            required
          />

          <label style={styles.label}>Level</label>
          <select
            value={level}
            onChange={e => setLevel(e.target.value)}
            style={styles.input}
          >
            <option value="BA">B.A.</option>
            <option value="MA">M.A.</option>
          </select>

          <label style={styles.label}>Word File (.docx) Upload करें</label>
          <input
            type="file"
            accept=".docx"
            onChange={e => setFile(e.target.files[0])}
            style={styles.fileInput}
            required
          />

          <button type="submit" style={styles.btn} disabled={loading}>
            {loading ? "⏳ Processing..." : "📤 Upload करें"}
          </button>
        </form>

        {status && (
          <div style={styles.status}>
            <p>{status}</p>
            {status.includes("✅") && (
              <a href="/" style={styles.link}>🏠 Homepage देखें →</a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight:"100vh", background:"#f0f4ff", display:"flex", justifyContent:"center", alignItems:"center", padding:"20px" },
  card: { background:"white", padding:"40px", borderRadius:"16px", boxShadow:"0 4px 20px rgba(0,0,0,0.1)", width:"100%", maxWidth:"480px" },
  title: { margin:"0 0 5px", color:"#1e1b4b", fontSize:"24px" },
  subtitle: { color:"#666", marginBottom:"30px" },
  form: { display:"flex", flexDirection:"column", gap:"8px" },
  label: { fontWeight:"600", color:"#374151", fontSize:"14px" },
  input: { padding:"12px", borderRadius:"8px", border:"1px solid #ddd", fontSize:"15px", marginBottom:"10px" },
  fileInput: { padding:"8px", border:"1px dashed #4f46e5", borderRadius:"8px", marginBottom:"10px", background:"#f5f3ff" },
  btn: { padding:"14px", background:"#4f46e5", color:"white", border:"none", borderRadius:"8px", fontSize:"16px", cursor:"pointer", fontWeight:"600" },
  status: { marginTop:"20px", padding:"16px", background:"#f0fdf4", borderRadius:"8px", textAlign:"center" },
  link: { color:"#4f46e5", fontWeight:"600", textDecoration:"none" }
};
