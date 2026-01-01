import React, { useState , useEffect } from "react";
import api from '../../Api/AxiosConfig';
import Swal from "sweetalert2";
import "../../styles/AddInternship.css";
import { useNavigate , useParams } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";
import { useContext } from "react";

function AddInternship() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const { user } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requiredSkills: "",
    supervisor: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
  if (isEditMode) {
    api
      .get(`/internships/${id}`)
      .then((res) => {
        const offer = res.data;

        setFormData({
          title: offer.title,
          description: offer.description,
          requiredSkills: offer.requiredSkills.join(", "),
          supervisor: offer.supervisor,
          startDate: offer.startDate.slice(0, 10),
          endDate: offer.endDate ? offer.endDate.slice(0, 10) : "",
        });
      })
      .catch(() => {
        Swal.fire("Erreur", "Impossible de charger l’offre", "error");
      });
  }
}, [id]);


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const payload = {
      ...formData,
      companyId: user.id, 
      requiredSkills: formData.requiredSkills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean), 
    };

  try {
    if (isEditMode) {
      await api.patch(`/internships/${id}`,payload);
      Swal.fire("Succès", "Offre mise à jour avec succès", "success");
    } else {
      await api.post("/internships",payload);
      Swal.fire("Succès", "Offre ajoutée avec succès", "success");
    }

    navigate("/company/internships");
  } catch (error) {
     Swal.fire({
        title: "Erreur",
        text: error.response?.data?.message || "Erreur lors de l'enregistrement",
        icon: "error",
      });
    }
  }


  return (
    <div>

      <div className="form-container">
        <h2>{isEditMode ? "Modifier l'offre de stage" : "Ajouter une offre de stage"}</h2>

        <form onSubmit={handleSubmit} className="internship-form">
          <input
            type="text"
            name="title"
            placeholder="Titre de l'offre"
            required
            value={formData.title}
            onChange={handleChange}
          />

          <textarea
            name="description"
            placeholder="Description"
            required
            rows="4"
            value={formData.description}
            onChange={handleChange}
          />

          <input
            type="text"
            name="requiredSkills"
            placeholder="Compétences requises (ex: React, Node, MongoDB)"
            value={formData.requiredSkills}
            onChange={handleChange}
          />

          <input
            type="text"
            name="supervisor"
            placeholder="Superviseur"
            required
            value={formData.supervisor}
            onChange={handleChange}
          />

          <label>Date début</label>
          <input
            type="date"
            name="startDate"
            required
            value={formData.startDate}
            onChange={handleChange}
          />

          <label>Date fin (optionnelle)</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
          />

          <button type="submit">{isEditMode ? "Mettre à jour" : "Ajouter l'offre"}</button>
        </form>
      </div>
    </div>
  );
}

export default AddInternship;
