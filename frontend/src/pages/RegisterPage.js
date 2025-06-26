import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./RegisterPage.css";

const baseURL = process.env.REACT_APP_API_URL;

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await axios.post(`${baseURL}/register`, { username, password });
      alert("✅ Kayıt başarılı! Giriş yapabilirsiniz.");
      navigate("/login");
    } catch (error) {
      alert("❌ Kayıt başarısız!");
      console.error(error);
    }
  };

  return (
      <div className="register-container">
          <img
              src="/images/logo.png"
              alt="Sanal Miras Logo"
              className="entry-logo"
          />
          <h2>📝 Kayıt Ol</h2>
          <input
              type="text"
              placeholder="Kullanıcı Adı"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
          />
          <input
              type="password"
              placeholder="Şifre"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleRegister}>Kayıt Ol</button>
      </div>
  );
}
