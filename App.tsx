// frontend/src/App.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:4000" });

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [stores, setStores] = useState<any[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function login(e: React.FormEvent) {
    e.preventDefault();
    const res = await api.post("/auth/login", { email, password });
    setToken(res.data.token);
    localStorage.setItem("token", res.data.token);
  }

  async function fetchStores() {
    const res = await api.get("/stores");
    setStores(res.data);
  }

  async function rateStore(id: number, rating: number) {
    await api.post(`/stores/${id}/rating`, { rating }, { headers: { Authorization: `Bearer ${token}` } });
    fetchStores();
  }

  useEffect(() => { fetchStores(); }, []);

  return (
    <div style={{ padding: 20 }}>
      {!token && (
        <form onSubmit={login}>
          <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
          <button>Login</button>
        </form>
      )}
      <h2>Stores</h2>
      {stores.map((s) => (
        <div key={s.id} style={{ marginBottom: 10 }}>
          <b>{s.name}</b> (Avg: {s.ratingAvg}) <br />
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              style={{ cursor: "pointer", color: "gold" }}
              onClick={() => rateStore(s.id, star)}
            >
              {star}⭐
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
