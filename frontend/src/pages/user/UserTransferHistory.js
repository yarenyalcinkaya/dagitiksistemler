import { useEffect, useState } from "react";
import axios from "axios";
import './UserTransferHistory.css'

export default function UserTransferHistory() {
  const [transfers, setTransfers] = useState([]);
  const token = localStorage.getItem("token");
  const baseURL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchTransfers = async () => {
      try {
        const res = await axios.get(`${baseURL}/transfers/mine`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTransfers(res.data);
      } catch (err) {
        console.error("Transfer geçmişi alınamadı:", err);
      }
    };

    fetchTransfers();
  }, [baseURL, token]);

  return (
      <div className="transfer-history-container">
        <h2>📜 Transfer Geçmişin</h2>
        {transfers.length === 0 ? (
            <p>Henüz transfer geçmişiniz yok.</p>
        ) : (
            <table>
              <thead>
              <tr>
                <th>ID</th>
                <th>Eşya ID</th>
                <th>Gönderen</th>
                <th>Alıcı</th>
                <th>Tarih</th>
              </tr>
              </thead>
              <tbody>
              {transfers.map((t) => (
                  <tr key={t.id}>
                    <td>{t.id}</td>
                    <td>{t.item_id}</td>
                    <td>{t.from_user_id}</td>
                    <td>{t.to_user_id}</td>
                    <td>{new Date(t.timestamp).toLocaleString()}</td>
                  </tr>
              ))}
              </tbody>
            </table>
        )}
      </div>

  );
}
