import { useState } from "react";
import "../styles/Form.css";
import LogoText from "./LogoText";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import SchoolIcon from "@mui/icons-material/School";
import BusinessIcon from "@mui/icons-material/Business";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import api from "../Api/AxiosConfig";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate(); 
  const [role, setRole] = useState("student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [niveau, setNiveau] = useState("");
  const [secteur, setSecteur] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || (role === "student" && !niveau) || (role === "company" && !secteur)) {
      alert("Veuillez remplir tous les champs obligatoires !");
      return;
    }

    try {
      setLoading(true);

      const resUser = await api.post("/users/register", {
        name,
        email,
        password,
        role
      });

      const userId = resUser.data.newUser._id;
      const token = resUser.data.token;

       login({
        id: userId,
        role,
        token,
        name,
      });

      if (role === "student") {
        await api.post("http://localhost:5000/api/students", {
          userId,
          niveau,
          specialite: "",
          skills: [],
          cvUrl: ""
        });
      } else if (role === "company") {
        await api.post("http://localhost:5000/api/companies", {
          userId,
          secteur,
          description: ""
        });
      }
      navigate(role === "company" ? "/company/internships" : "/");

      setName("");
      setEmail("");
      setPassword("");
      setNiveau("");
      setSecteur("");

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
              <LogoText />
            </div>
          </div>

          {/* ROLE SELECTION */}
          <div className="role-section">
            <div className="roles">
              <input
                type="radio"
                id="student"
                name="role"
                checked={role === "student"}
                onChange={() => setRole("student")}
              />
              <label htmlFor="student">Étudiant</label>

              <input
                type="radio"
                id="company"
                name="role"
                checked={role === "company"}
                onChange={() => setRole("company")}
              />
              <label htmlFor="company">Entreprise</label>
            </div>
          </div>

          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label className="input-label">
                {role === "student" ? "Nom complet" : "Nom de l'entreprise"}
              </label>
              <div className="input-group">
                <PersonIcon className="input-icon" />
                <input
                  type="text"
                  placeholder={role === "student" ? "Votre nom complet" : "Nom de l'entreprise"}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            {/* EMAIL */}
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

            {/* PASSWORD */}
            <div className="form-group">
              <label className="input-label">Mot de passe</label>
              <div className="input-group">
                <LockIcon className="input-icon" />
                <input
                  type="password"
                  placeholder="Créer un mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* STUDENT ROLE */}
            {role === "student" && (
              <div className="form-group">
                <label className="input-label">Niveau</label>
                <div className="input-group">
                  <SchoolIcon className="input-icon" />
                  <select
                    className="select-input"
                    value={niveau}
                    onChange={(e) => setNiveau(e.target.value)}
                  >
                    <option value="">Sélectionnez votre niveau</option>
                    <option value="licence">Licence</option>
                    <option value="master">Master</option>
                    <option value="ingenieur">Ingénieur</option>
                  </select>
                </div>
              </div>
            )}

            {/* COMPANY ROLE */}
            {role === "company" && (
              <div className="form-group">
                <label className="input-label">Secteur d'activité</label>
                <div className="input-group">
                  <BusinessIcon className="input-icon" />
                  <select
                    className="select-input"
                    value={secteur}
                    onChange={(e) => setSecteur(e.target.value)}
                  >
                    <option value="">Sélectionnez un secteur</option>
                    <option value="informatique">Informatique</option>
                    <option value="developpement">Finance</option>
                    <option value="marketing">Marketing</option>
                    <option value="industrie">Industrie</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>
              </div>
            )}

            <button className="btn-primary" type="submit" disabled={loading}>
              <span>{loading ? "Inscription..." : "Créer un compte"}</span>
              <ArrowForwardIcon className="login-icon" />
            </button>
          </form>
          <div className="register-section">
            <p className="register-text">
                Vous avez déjà un compte ?
                <a href="/login" className="register-link">Se connecter</a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
