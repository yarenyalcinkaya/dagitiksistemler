import { useEffect, useState } from "react";
import axios from "axios";
import './UserItems.css'
export default function UserItems() {
  const [items, setItems] = useState([]);
  const token = localStorage.getItem("token");
  const baseURL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get(`${baseURL}/items`, {
          headers: {Authorization: `Bearer ${token}`},
        });
        setItems(res.data);
      } catch (err) {
        console.error("Eşyalar alınamadı:", err);
      }
    };

    fetchItems();
  }, [baseURL, token]);

  return (
      <div className="user-items-container">
        <h2>🎒 Eşyalarım</h2>
        {items.length === 0 ? (
            <p>Hiç eşyanız yok.</p>
        ) : (
            <table>
              <thead>
              <tr>
                <th>ID</th>
                <th>İsim</th>
              </tr>
              </thead>
              <tbody>
              {items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                  </tr>
              ))}
              </tbody>
            </table>
        )}
      </div>
  );
}
