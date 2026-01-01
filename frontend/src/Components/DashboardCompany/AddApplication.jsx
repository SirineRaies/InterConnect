import { useState, useEffect } from "react";
import api from "../../Api/AxiosConfig";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";

function AddApplication() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [students, setStudents] = useState([]);
  const [internships, setInternships] = useState([]);
  const [cvFile, setCvFile] = useState(null);
  const [existingCvUrl, setExistingCvUrl] = useState("");
  const [formData, setFormData] = useState({
    userId: "",
    name: "",
    email: "",
    internshipId: "",
    status: "En attente",
    scoreIA: "",
  });

  useEffect(() => {
  api.get("/students")
    .then(res => setStudents(res.data))
    .catch(err => console.error(err));

  api.get("/internships")
    .then(res => setInternships(res.data))
    .catch(err => console.error(err));

  if (isEditMode) {
    api.get(`/applications/${id}`)
      .then(res => {
        const app = res.data;
        console.log("Application data:", app);
        setFormData({
          userId: app.userId?._id || app.userId || "",
          internshipId: app.internshipId?._id || app.internshipId || "",
          name: app.userId?.name || app.name || "",
          email: app.userId?.email || app.email || "",
          status: app.status || "En attente",
          scoreIA: app.scoreIA ?? "",
        });
        setExistingCvUrl(app.cv || app.cvUrl || "");
      })
      .catch((error) => {
        console.error("Error loading application:", error);
        Swal.fire("Erreur", "Impossible de charger la candidature", "error");
      });
  }
}, [id, isEditMode]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCvChange = (e) => {
    setCvFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isEditMode) {
      if (!formData.userId || !formData.internshipId) {
        return Swal.fire("Erreur","Veuillez sélectionner un étudiant et un stage","warning");
      }
    } else {
      if (!formData.userId || !formData.internshipId || !cvFile) {
        return Swal.fire("Erreur","Veuillez sélectionner un étudiant, un stage et uploader un CV","warning");
      }
    }

    try {
      const data = new FormData();
      data.append("userId", formData.userId);
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("internshipId", formData.internshipId);
      data.append("status", formData.status);
      data.append("scoreIA", formData.scoreIA || "");

      if (cvFile) {
        data.append("cv", cvFile);
      }

      if (isEditMode) {
        await api.patch(`/applications/${id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        Swal.fire("Succès", "Candidature mise à jour avec succès", "success");
      } else {
        await api.post("/applications", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        Swal.fire("Succès", "Candidature ajoutée avec succès", "success");
      }

      navigate("/company/applications");
    } catch (error) {
      console.error(error);
      Swal.fire(
        "Erreur",
        error.response?.data?.message || "Erreur lors de l'enregistrement",
        "error"
      );
    }
  };

  return (
    <div className="form-container">
      <h2>{isEditMode ? "Modifier la candidature" : "Ajouter une candidature"}</h2>

      <form onSubmit={handleSubmit} className="internship-form">
        <label>Étudiant</label>
        <select
          name="userId"
          value={formData.userId}
          onChange={(e) => {
            const selectedId = e.target.value;
            const selectedStudent = students.find(s => s.userId._id === selectedId);

            setFormData({
              ...formData,
              userId: selectedId,
              name: selectedStudent?.userId?.name || "",
              email: selectedStudent?.userId?.email || "",
            });
          }}
          required
        >
          <option value="">-- Sélectionner un étudiant --</option>
          {students.map(s => (
            <option key={s.userId._id} value={s.userId._id}>
              {s.userId.name} ({s.userId.email})
            </option>
          ))}
        </select>

        <label>Nom</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          readOnly
        />

        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          readOnly
        />

        <label>Offre de stage</label>
        <select
          name="internshipId"
          value={formData.internshipId}
          onChange={handleChange}
          required
        >
          <option value="">-- Sélectionner un stage --</option>
          {internships.map((i) => (
            <option key={i._id} value={i._id}>
              {i.title}
            </option>
          ))}
        </select>

        <label>Statut</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
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

        <label>CV (PDF)</label>
        <input
          type="file"
          accept=".pdf"
          onChange={handleCvChange}
          required={!isEditMode} 
        />

        {isEditMode && existingCvUrl && (
          <div>
            <p>CV actuel : <a href={existingCvUrl} target="_blank" rel="noopener noreferrer">Voir CV</a></p>
            <p style={{ color: '#666', fontSize: '0.9em' }}>
              Laissez vide pour conserver le CV actuel
            </p>
          </div>
        )}

        <button type="submit">
          {isEditMode ? "Mettre à jour" : "Ajouter la candidature"}
        </button>
      </form>
    </div>
  );
}

export default AddApplication;