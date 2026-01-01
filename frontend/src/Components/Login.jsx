import "../styles/Form.css";
import LogoText from "./LogoText";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useState, useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../Api/AxiosConfig";

export default function Login() {
  const [role, setRole] = useState("student"); // rôle sélectionné
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();

  if (!email || !password) {
    alert("Veuillez remplir tous les champs obligatoires !");
    return;
  }

  try {
    setLoading(true);

    const resUser = await api.post("/users/login", {
      email,
      password,
    });

    const user = resUser.data.user;

    if (user.role !== role) {
      alert(`Vous n'êtes pas un ${role}`);
      return;
    }

    console.log(user);
    setEmail("");
    setPassword("");

     login({
        id: user._id,
        role: user.role,
        token: resUser.data.token,
        name: user.name,
      });


    if (user.role === "admin") navigate("/admin/users");
    else if (user.role === "company") navigate("/company/internships");
    else navigate("/");

  } catch (error) {
    console.error(error);
    if (error.response && error.response.data) {
      alert(error.response.data.message);
    } else {
      alert("Erreur du serveur");
    }
  } finally {
    setLoading(false);
  }
};


  return (
    <main className="login-container">
      <div className="login-card">
        <div className="login-left">
          <div className="overlay" />
        </div>

        <div className="login-right">
          <div className="login_right_part1">
            <div className="logo_container">
              <LogoText className="logo_img"/>
            </div>
          </div>

          {/* ROLE */}
          <div className="role-section">
            <div className="roles">
              <input type="radio" id="student" name="role" checked={role === "student"} onChange={() => setRole("student")} />
              <label htmlFor="student">Étudiant</label>

              <input type="radio" id="company" name="role" checked={role === "company"} onChange={() => setRole("company")} />
              <label htmlFor="company">Entreprise</label>

              <input type="radio" id="admin" name="role" checked={role === "admin"} onChange={() => setRole("admin")} />
              <label htmlFor="admin">Administrateur</label>
            </div>
          </div>

          {/* FORM */}
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="input-label">Adresse email</label>
              <div className="input-group">
                <EmailIcon className="input-icon" />
                <input
                  type="email"
                  placeholder="exemple@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="input-label">Mot de passe</label>
              <div className="forgot-password">
                <a href="#">Mot de passe oublié ?</a>
              </div>
              <div className="input-group">
                <LockIcon className="input-icon" />
                <input
                  type="password"
                  placeholder="Entrez votre mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button className="btn-primary" type="submit" disabled={loading}>
              <span>{loading ? "Connexion..." : "Se connecter"}</span>
              <ArrowForwardIcon className="login-icon" />
            </button>
          </form>

          <div className="register-section">
            <p className="register-text">
              Vous n'avez pas de compte ?
              <a href="/register" className="register-link">Créer un compte</a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
