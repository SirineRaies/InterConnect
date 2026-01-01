import React, { useState, useEffect } from "react";
import api from '../../Api/AxiosConfig';
import Swal from "sweetalert2";
import "../../styles/AddInternship.css";
import { useNavigate, useParams } from "react-router-dom";

function AddUserForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    profileCompleted: false,
  });

  // Charger user en mode édition
  useEffect(() => {
    if (isEditMode) {
      api.get(`/users/${id}`)
        .then(res => {
          const user = res.data;
          setFormData({
            name: user.name,
            email: user.email,
            password: "",
            role: user.role,
            profileCompleted: user.profileCompleted,
          });
        })
        .catch(() => {
          Swal.fire("Erreur", "Impossible de charger l'utilisateur", "error");
        });
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileCompletedChange = (e) => {
    setFormData(prev => ({ ...prev, profileCompleted: e.target.checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      if (isEditMode && !payload.password) {
        delete payload.password; // ne pas envoyer le password vide
      }

      if (isEditMode) {
        await api.patch(`/users/${id}`, payload);
        Swal.fire("Succès", "Utilisateur mis à jour avec succès", "success");
      } else {
        await api.post("/users/register", payload);
        Swal.fire("Succès", "Utilisateur ajouté avec succès", "success");
      }

      navigate("/admin/users");
    } catch (error) {
      Swal.fire(
        "Erreur",
        error.response?.data?.message || "Erreur lors de l'enregistrement",
        "error"
      );
    }
  };

  return (
    <div className="form-container">
      <h2>{isEditMode ? "Modifier l'utilisateur" : "Ajouter un utilisateur"}</h2>

      <form onSubmit={handleSubmit} className="internship-form">

        <input
          type="text"
          name="name"
          placeholder="Nom et prénom"
          required
          value={formData.name}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Adresse email"
          required
          value={formData.email}
          onChange={handleChange}
        />

        {!isEditMode && (
          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            required
            value={formData.password}
            onChange={handleChange}
          />
        )}

        {/* Rôle */}
        <div className="checkbox-group">
          <label>Rôle</label>
          <select name="role" value={formData.role} onChange={handleChange} required>
            <option value="">-- Sélectionner un rôle --</option>
            <option value="admin">Admin</option>
            <option value="company">Entreprise</option>
            <option value="student">Étudiant</option>
          </select>
        </div>

        {/* Profil complété */}
        <div className="checkbox-group">
          <label>
            Profil complété
            <input
              type="checkbox"
              checked={formData.profileCompleted}
              onChange={handleProfileCompletedChange}
            />
          </label>
        </div>

        <button type="submit">
          {isEditMode ? "Mettre à jour" : "Ajouter l'utilisateur"}
        </button>
      </form>
    </div>
  );
}

export default AddUserForm;
