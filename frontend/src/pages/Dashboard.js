import { useState, useEffect } from 'react';
import UserSidebar from '../components/UserSidebar';
import UserItems from './user/UserItems';
import UserTransfer from './user/UserTransfer';
import UserTransferHistory from './user/UserTransferHistory';
import UserWelcome from './user/UserWelcome'; // Yeni bileşen
import './Dashboard.css';

export default function Dashboard() {
  const [currentPage, setCurrentPage] = useState("welcome"); // ilk girişte hoşgeldin sayfası
  const [username, setUsername] = useState("");

  useEffect(() => {
    const tokenData = JSON.parse(localStorage.getItem("user")); // örnek: { username: "samet", ... }
    if (tokenData && tokenData.username) {
      setUsername(tokenData.username);
    }
  }, []);

  return (
    <div className="user-dashboard">
      <UserSidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />

      <div className="dashboard-content">
        {currentPage === "welcome" && <UserWelcome username={username} />}
        {currentPage === "items" && <UserItems />}
        {currentPage === "transfer" && <UserTransfer />}
        {currentPage === "history" && <UserTransferHistory />}
      </div>
    </div>
  );
}
