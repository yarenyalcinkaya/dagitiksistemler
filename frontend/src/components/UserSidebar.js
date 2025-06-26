// src/components/UserSidebar.jsx
import './UserSidebar.css';

export default function UserSidebar({ currentPage, setCurrentPage }) {
  return (
    <div className="sidebar">
      <h3>🎮 Kullanıcı Paneli</h3>
      <button onClick={() => setCurrentPage("items")} className={currentPage === "items" ? "active" : ""}>
        🎒 Eşyalarım
      </button>
      <button onClick={() => setCurrentPage("transfer")} className={currentPage === "transfer" ? "active" : ""}>
        🔁 Transfer Yap
      </button>
      <button onClick={() => setCurrentPage("history")} className={currentPage === "history" ? "active" : ""}>
        📜 Transfer Geçmişi
      </button>
      <button
        onClick={() => {
          localStorage.clear();
          window.location.href = "/";
        }}
      >
        🚪 Çıkış Yap
      </button>
    </div>
  );
}
