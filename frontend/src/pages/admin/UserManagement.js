import { useEffect, useState } from 'react';
import axios from 'axios';
import './UserManagement.css';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem('token');
  const baseURL = process.env.REACT_APP_API_URL;

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${baseURL}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) {
      console.error('Kullanıcılar alınamadı:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bu kullanıcıyı silmek istediğinize emin misiniz?")) return;

    try {
      await axios.delete(`${baseURL}/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(users.filter(u => u.id !== id)); // 🔄 listeyi güncelle
    } catch (err) {
      alert("❌ Kullanıcı silinemedi");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
      <div className="user-management">
        <h2>👥 Kullanıcı Yönetimi</h2>
        <table>
          <thead>
          <tr>
            <th>ID</th>
            <th>Kullanıcı Adı</th>
            <th>İşlem</th>
          </tr>
          </thead>
          <tbody>
          {users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>
                  <button className="delete-btn">Sil</button>
                </td>
              </tr>
          ))}
          </tbody>
        </table>
      </div>

  );
}
