import { useEffect, useState } from 'react';
import axios from 'axios';
import '../Dashboard.css';

export default function TransferForm() {
  const [items, setItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedItem, setSelectedItem] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [message, setMessage] = useState('');

  const token = localStorage.getItem("token");
  const baseURL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemsRes, usersRes] = await Promise.all([
          axios.get(`${baseURL}/items`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${baseURL}/users`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        setItems(itemsRes.data);
        setUsers(usersRes.data);
      } catch (err) {
        console.error("Veriler alınamadı:", err);
      }
    };

    fetchData();
  }, [baseURL, token]);

  const handleTransfer = async () => {
    if (!selectedItem || !selectedUser) {
      setMessage("⚠️ Lütfen eşya ve alıcı seçin.");
      return;
    }

    try {
      await axios.post(`${baseURL}/transfer`, {
        item_id: selectedItem,
        to_user_id: selectedUser
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessage("✅ Transfer başarılı!");
      setSelectedItem('');
      setSelectedUser('');
    } catch (err) {
      console.error("Transfer hatası:", err);
      setMessage("❌ Transfer başarısız!");
    }
  };

  return (
    <div className="transfer-form">
      <h2>🔁 Transfer Yap</h2>
      <div className="form-column">
        <select value={selectedItem} onChange={(e) => setSelectedItem(e.target.value)}>
          <option value="">Eşya Seç</option>
          {items.map(item => (
            <option key={item.id} value={item.id}>{item.name}</option>
          ))}
        </select>

        <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
          <option value="">Alıcı Seç</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>{user.username}</option>
          ))}
        </select>

        <button onClick={handleTransfer}>Transfer Et</button>
      </div>

      {message && <p className="message">{message}</p>}
    </div>
  );
}
