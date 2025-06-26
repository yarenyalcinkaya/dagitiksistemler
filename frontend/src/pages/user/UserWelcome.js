import './UserWelcome.css';

export default function UserWelcome({ username }) {
  return (
    <div className="user-welcome">
      <h1>👋 Hoş Geldin {username || "Kullanıcı"}</h1>
      <p>Yapmak istediğin işlemi sol menüden seçebilirsin.</p>
    </div>
  );
}
