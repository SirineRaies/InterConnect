import { useState, useEffect } from "react";
import api from "../../Api/AxiosConfig";
import Swal from "sweetalert2";
import "../../styles/AddInternship.css";
import { useNavigate, useParams } from "react-router-dom";

function AddAdminApplicationForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    userId: "",
    internshipId: "",
    status: "En attente",
    scoreIA: "",
  });

  const [students, setStudents] = useState([]);
  const [internships, setInternships] = useState([]);

  useEffect(() => {
    // Récupérer tous les étudiants
    api.get("/students")
      .then(res => setStudents(res.data))
      .catch(err => console.error(err));

    // Récupérer toutes les offres de stage
    api.get("/internships")
      .then(res => setInternships(res.data))
      .catch(err => console.error(err));

    // Si édition, charger la candidature
    if (isEditMode) {
  api.get(`/applications/${id}`)
    .then(res => {
      const app = res.data;

    setFormData({
        userId: app.userId?._id || "",
        internshipId: app.internshipId?._id || "",
        status: app.status,
        scoreIA: app.scoreIA ?? "",
      });

    })
    .catch(() =>
      Swal.fire("Erreur", "Impossible de charger la candidature", "error")
    );
}

  }, [id, isEditMode]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditMode) {
        await api.patch(`/applications/${id}`, formData);
        Swal.fire("Succès", "Candidature mise à jour avec succès", "success");
      } else {
        await api.post("/applications", formData);
        Swal.fire("Succès", "Candidature ajoutée avec succès", "success");
      }
      navigate("/admin/applications");
    } catch (error) {
      Swal.fire("Erreur", "Erreur lors de l'enregistrement", "error");
      console.error(error);
    }
  };

  return (
    <div>
      <div className="form-container">
        <h2>{isEditMode ? "Modifier la candidature" : "Ajouter une candidature"}</h2>

        <form onSubmit={handleSubmit} className="internship-form">
          <label>Étudiant</label>
          <select name="userId" value={formData.userId} onChange={handleChange} required>
            <option value="">-- Sélectionner un étudiant --</option>
            {students.map(s => (
              <option key={s.userId._id} value={s.userId._id}>
                {s.userId.name} ({s.userId.email})
              </option>
            ))}
          </select>

          <label>Offre de stage</label>
          <select name="internshipId" value={formData.internshipId} onChange={handleChange} required>
            <option value="">-- Sélectionner une offre --</option>
            {internships.map(i => (
              <option key={i._id} value={i._id}>{i.title}</option>
            ))}
          </select>

          <label>Statut</label>
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="En attente">En attente</option>
            <option value="Accepté">Accepté</option>
            <option value="Refusé">Refusé</option>
          </select>

          <label>Score IA</label>
          <input
            type="number"
            name="scoreIA"
            placeholder="Score IA (optionnel)"
            value={formData.scoreIA}
            onChange={handleChange}
          />

          <button type="submit">{isEditMode ? "Mettre à jour" : "Ajouter la candidature"}</button>
        </form>
      </div>
    </div>
  );
}

export default AddAdminApplicationForm;
