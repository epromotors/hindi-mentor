"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    const res = await signIn("credentials", {
      password,
      redirect: false
    });
    if (res?.ok) router.push("/admin");
    else setError("❌ गलत पासवर्ड!");
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>🔐 Admin Login</h2>
        <p style={{color:"#666"}}>Hindi Mentor Admin Panel</p>
        <form onSubmit={handleLogin}>
          <input
            type="password"
            placeholder="पासवर्ड डालें"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={styles.input}
          />
          <button type="submit" style={styles.btn}>Login करें →</button>
        </form>
        {error && <p style={{color:"red", marginTop:"10px"}}>{error}</p>}
      </div>
    </div>
  );
}

const styles = {
  container: { display:"flex", justifyContent:"center", alignItems:"center", height:"100vh", background:"#f0f4ff" },
  card: { background:"white", padding:"40px", borderRadius:"16px", boxShadow:"0 4px 20px rgba(0,0,0,0.1)", textAlign:"center", width:"350px" },
  input: { width:"100%", padding:"12px", margin:"10px 0", borderRadius:"8px", border:"1px solid #ddd", fontSize:"16px", boxSizing:"border-box" },
  btn: { width:"100%", padding:"12px", background:"#4f46e5", color:"white", border:"none", borderRadius:"8px", fontSize:"16px", cursor:"pointer", marginTop:"10px" }
};
