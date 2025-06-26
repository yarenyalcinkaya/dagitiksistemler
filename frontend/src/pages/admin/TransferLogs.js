import { useEffect, useState } from "react";
import axios from "axios";
import "./TransferLogs.css";

export default function TransferLogs() {
  const [transfers, setTransfers] = useState([]);
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);

  const token = localStorage.getItem("token");
  const baseURL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchAllTransfers = async () => {
      try {
        const [transferRes, userRes, itemRes] = await Promise.all([
          axios.get(`${baseURL}/admin/transfers`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${baseURL}/users`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${baseURL}/admin/items`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
        ]);

        setTransfers(transferRes.data);
        setUsers(userRes.data);
        setItems(itemRes.data);
        console.log("Transferler:", transferRes.data);
        console.log("Kullanıcılar:", userRes.data);
        console.log("Itemlar:", itemRes.data);


      } catch (err) {
        console.error("Veriler alınamadı:", err);
      }
    };

    fetchAllTransfers();
  }, [baseURL, token]);

  const getUsername = (id) => users.find(u => u.id === id)?.username || "Bilinmiyor";
  const getItemName = (id) => items.find(i => i.id === id)?.name || "Eşya Yok";

  return (
    <div className="transfer-logs">
      <h2>🔁 Tüm Transfer Geçmişi</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Eşya</th>
            <th>Gönderen</th>
            <th>Alıcı</th>
            <th>Tarih</th>
          </tr>
        </thead>
        <tbody>
          {transfers.map(t => (
            <tr key={t.id}>
              <td>{t.id}</td>
              <td>{getItemName(t.item_id)}</td>
              <td>{getUsername(t.from_user_id)}</td>
              <td>{getUsername(t.to_user_id)}</td>
              <td>{new Date(t.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
