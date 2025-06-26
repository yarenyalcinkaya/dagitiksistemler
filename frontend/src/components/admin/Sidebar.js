import './Sidebar.css';

export default function Sidebar({ currentPage, setCurrentPage }) {
  return (
    <div className="sidebar">
      <h3>🛡️ Admin Panel</h3>

      <button
        onClick={() => setCurrentPage("users")}
        className={currentPage === "users" ? "active" : ""}
      >👤 Kullanıcılar</button>

      <button
        onClick={() => setCurrentPage("items")}
        className={currentPage === "items" ? "active" : ""}
      >🎒 Item İşlemleri</button>

      <button
        onClick={() => setCurrentPage("transfers")}
        className={currentPage === "transfers" ? "active" : ""}
      >🔁 Transfer Geçmişi</button>

      <button
        onClick={() => setCurrentPage("blockchain")}
        className={currentPage === "blockchain" ? "active" : ""}
      >🧱 Zinciri Kontrol Et</button>

      <button
        onClick={() => {
          localStorage.clear();
          window.location.href = "/";
        }}
      >🚪 Çıkış Yap</button>
    </div>
  );
}
