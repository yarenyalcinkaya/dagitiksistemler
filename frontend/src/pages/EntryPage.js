import { useNavigate } from "react-router-dom";
import "./EntryPage.css";

export default function EntryPage() {
  const navigate = useNavigate();

  return (


      <div className="entry-container">
              <img
                  src="/images/logo.png"
                  alt="Sanal Miras Logo"
                  className="entry-logo"
              />
              <div className="entry-buttons">
                  <button onClick={() => navigate("/register")}>📝 Kayıt Ol</button>
                  <button onClick={() => navigate("/login", {state: {isAdmin: false}})}>
                      👤 Kullanıcı Girişi
                  </button>
                  <button onClick={() => navigate("/login", {state: {isAdmin: true}})}>
                      🛡️ Admin Girişi
                  </button>
              </div>
          </div>
          );
          }
