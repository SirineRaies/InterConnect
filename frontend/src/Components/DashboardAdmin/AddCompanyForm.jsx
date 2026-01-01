import { useState, useEffect } from "react";
import api from '../../Api/AxiosConfig';
import Swal from "sweetalert2";
import "../../styles/AddInternship.css";
import { useNavigate, useParams } from "react-router-dom";

function AddCompanyForm() {
  const navigate = useNavigate();
  const { id } = useParams(); // idCompany
  const isEditMode = Boolean(id);

  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    secteur: "",
    description: "",
    profileCompleted: false,
  });

  // 🔹 Charger les utilisateurs de rôle company si création
  useEffect(() => {
    if (!isEditMode) {
      api.get("/users?role=company")
        .then(res => setUsers(res.data))
        .catch(() => Swal.fire("Erreur", "Impossible de charger les utilisateurs", "error"));
    }
  }, [isEditMode]);

  // 🔹 Charger les données en mode EDIT
  useEffect(() => {
    if (isEditMode) {
      api.get(`/companies/${id}`)
        .then(res => {
          const company = res.data;
          setSelectedUserId(company.idUser._id);
          setFormData({
            name: company.idUser.name,
            email: company.idUser.email,
            secteur: company.secteur,
            description: company.description,
            profileCompleted: company.idUser.profileCompleted,
          });
        })
        .catch(() => Swal.fire("Erreur", "Impossible de charger l’entreprise", "error"));
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleUserSelect = (e) => {
    const userId = e.target.value;
    const user = users.find(u => u._id === userId);
    if (!user) return;

    setSelectedUserId(userId);
    setFormData({
      ...formData,
      name: user.name,
      email: user.email,
      profileCompleted: user.profileCompleted,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditMode) {
        await api.patch(`/companies/${id}`, {
          secteur: formData.secteur,
          description: formData.description,
        });
        await api.patch(`/users/${selectedUserId}`, {
          name: formData.name,
          email: formData.email,
          profileCompleted: formData.profileCompleted,
        });

        Swal.fire("Succès", "Entreprise mise à jour avec succès", "success");
      } else {
          await api.post("/companies", {
      userId: selectedUserId,
      secteur: formData.secteur,
      description: formData.description,
    });

    Swal.fire("Succès", "Entreprise ajoutée avec succès", "success");
  }
  navigate("/admin/companies");
} catch (error) {
  // Ici on affiche le message du backend
  Swal.fire(
    "Erreur",
    error.response?.data?.message || "Erreur lors de l’enregistrement",
    "error"
  );
}
};

  return (
    <div className="form-container">
      <h2>{isEditMode ? "Modifier une entreprise" : "Ajouter une entreprise"}</h2>

      <form onSubmit={handleSubmit} className="internship-form">
        {!isEditMode ? (
          <select required value={selectedUserId} onChange={handleUserSelect}>
            <option value="">-- Sélectionner un utilisateur --</option>
            {users.map(user => (
              <option key={user._id} value={user._id}>
                {user.name} - {user.email}
              </option>
            ))}
          </select>
        ) : (
          <>
            <input type="text" value={formData.name} disabled />
            <input type="email" value={formData.email} disabled />
          </>
        )}

        <input
          type="text"
          name="secteur"
          placeholder="Secteur d’activité"
          required
          value={formData.secteur}
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Description de l’entreprise"
          rows="4"
          value={formData.description}
          onChange={handleChange}
        />

        <label className="checkbox-label">
          <input
            type="checkbox"
            name="profileCompleted"
            checked={formData.profileCompleted}
            onChange={handleChange}
          />
          Profil complété
        </label>

        <button type="submit">{isEditMode ? "Mettre à jour" : "Ajouter l’entreprise"}</button>
      </form>
    </div>
  );
}

export default AddCompanyForm;
