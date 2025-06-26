import { useEffect, useState } from 'react';
import axios from 'axios';
import './ItemManagement.css';

export default function ItemManagement() {
  const [items, setItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [itemName, setItemName] = useState('');
  const [ownerId, setOwnerId] = useState('');

  const token = localStorage.getItem('token');
  const baseURL = process.env.REACT_APP_API_URL;

  const fetchData = async () => {
    try {
      const [itemsRes, usersRes] = await Promise.all([
        axios.get(`${baseURL}/admin/items`, {
  headers: { Authorization: `Bearer ${token}` }
}),

        axios.get(`${baseURL}/users`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      setItems(itemsRes.data);
      setUsers(usersRes.data);
      console.log("Kullanıcılar:", users);
      console.log("Itemlar:", items);

    } catch (err) {
      console.error('Veriler alınamadı:', err);
    }
  };

  const handleAddItem = async () => {
    if (!itemName || !ownerId) return alert("Lütfen item adı ve kullanıcı seçin.");
    try {
      await axios.post(`${baseURL}/admin/items`, {
        name: itemName,
        owner_id: ownerId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setItemName('');
      setOwnerId('');
      await fetchData(); // listeyi yenile
    } catch (err) {
      alert("❌ Item eklenemedi");
      console.error(err);
    }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm("Bu item'ı silmek istiyor musunuz?")) return;
    try {
      await axios.delete(`${baseURL}/admin/items/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems(items.filter(i => i.id !== id));
    } catch (err) {
      alert("❌ Item silinemedi");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="item-management">
      <h2>🎒 Item Yönetimi</h2>

      <div className="item-form">
        <input
          type="text"
          placeholder="Item adı"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
        />
        <select value={ownerId} onChange={(e) => setOwnerId(e.target.value)}>
          <option value="">Kullanıcı seç</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>{user.username}</option>
          ))}
        </select>
        <button onClick={handleAddItem}>➕ Ekle</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>İsim</th>
            <th>Sahip</th>
            <th>İşlem</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{users.find(u => u.id === Number(item.owner_id))?.username || "Bilinmiyor"}</td>

              <td>
                <button onClick={() => handleDeleteItem(item.id)} className="delete-btn">
                  ❌ Sil
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
