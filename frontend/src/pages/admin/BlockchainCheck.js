// pages/admin/BlockchainCheck.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import "./BlockchainCheck.css";

export default function BlockchainCheck() {
  const [status, setStatus] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const baseURL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const check = async () => {
      try {
        const res = await axios.get(`${baseURL}/admin/validate-chain`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStatus(res.data);
      } catch (err) {
        setStatus({ valid: false, message: "❌ Sunucu hatası" });
        setError("Zincir kontrolü başarısız");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const fetchBlocks = async () => {
      try {
        const res = await axios.get(`${baseURL}/blockchain/blocks`);
        setBlocks(res.data);
      } catch (err) {
        console.error("Bloklar alınamadı:", err);
      }
    };

    check();
    fetchBlocks();
  }, [baseURL, token]);

  return (
    <div className="blockchain-check">
      <h2>🧱 Blockchain Zincir Kontrolü</h2>

      {loading ? (
        <p>🔄 Kontrol ediliyor...</p>
      ) : (
        <p style={{ color: status.valid ? "green" : "red" }}>
          {status.valid ? "✅" : "❌"} {status.message}
        </p>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}

      <h3>📜 Zincirdeki Bloklar</h3>
      <div className="block-list">
        {blocks.map((block, i) => (
          <div key={i} className="block-card">
            <p><strong># {block.index}</strong></p>
            <p><strong>Veri:</strong> {block.data}</p>
            <p><strong>Tarih:</strong> {block.timestamp}</p>
            <p><strong>Nonce:</strong> {block.nonce}</p>
            <p><strong>Hash:</strong> {block.hash}</p>
            <p><strong>Önceki Hash:</strong> {block.previous_hash}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
