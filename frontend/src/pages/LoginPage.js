import { useState } from 'react';
import axios from 'axios';
import './LoginPage.css';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const baseURL = process.env.REACT_APP_API_URL;

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = location.state?.isAdmin || false;

 const handleLogin = async () => {
  setError('');
  try {
    const res = await axios.post(`${baseURL}/login`, {
      username,
      password,
      expected_role: isAdmin ? "ADMIN" : "USER" // 👈 bu satır eklendi
    });
    const { token, role, userId } = res.data;

    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId);
    localStorage.setItem("role", role);
    localStorage.setItem("user", JSON.stringify({ username }));

    alert("✅ Giriş başarılı!");

    if (role === "ADMIN") {
      navigate("/admin-dashboard");
    } else {
      navigate("/dashboard");
    }

  } catch (err) {
    setError(err.response?.data?.error || "❌ Giriş başarısız!");
    console.error(err);
  }
};


  return (
      <div className="login-container">
          <img
              src="/images/logo.png"
              alt="Sanal Miras Logo"
              className="entry-logo"
          />
          <h2 className="login-title">
              {isAdmin ? "🛡️ Admin Girişi" : "🔐 Giriş Yap"}
          </h2>

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
          <button onClick={handleLogin}>Giriş</button>

          {error && <p className="login-error">{error}</p>}

          {!isAdmin && (
              <p className="login-register-link">
                  Hesabınız yok mu? <Link to="/register">Kayıt Ol</Link>
              </p>
          )}
      </div>
  );
}
