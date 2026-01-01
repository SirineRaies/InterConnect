import { useState, useEffect } from "react";
import api from "../../Api/AxiosConfig";
import Swal from "sweetalert2";
import "../../styles/AddInternship.css";
import { useNavigate, useParams } from "react-router-dom";

function AddAdminStudentForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    niveau: "",
    specialite: "",
    skills: "",
    cvUrl: "",
  });

  useEffect(() => {
    if (!isEditMode) {
      api.get("/users?role=student").then((res) => {
        setUsers(res.data);
      });
    }
  }, [isEditMode]);

  useEffect(() => {
    if (isEditMode) {
      api.get(`/students/${id}`).then((res) => {
        const student = res.data;

        setFormData({
          name: student.userId?.name || "",
          email: student.userId?.email || "",
          niveau: student.niveau || "",
          specialite: student.specialite || "",
          skills: student.skills?.join(", ") || "",
          cvUrl: student.cvUrl || "",
        });

        setSelectedUserId(student.userId?._id);
      });
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUserSelect = (e) => {
    const userId = e.target.value;
    const user = users.find((u) => u._id === userId);

    setSelectedUserId(userId);
    setFormData({
      ...formData,
      name: user.name,
      email: user.email,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      userId: selectedUserId,
      niveau: formData.niveau,
      specialite: formData.specialite,
      skills: formData.skills
        ? formData.skills.split(",").map((s) => s.trim())
        : [],
      cvUrl: formData.cvUrl,
    };

    try {
      if (isEditMode) {
        await api.patch(`/students/${id}`, payload);
        Swal.fire("Succès", "Étudiant mis à jour", "success");
      } else {
        await api.post("/students", payload);
        Swal.fire("Succès", "Étudiant ajouté", "success");
      }

      navigate("/admin/students");
    } catch (error) {
      Swal.fire("Erreur", "Erreur lors de l'enregistrement", error);
    }
  };

  return (
    <div className="form-container">
      <h2>{isEditMode ? "Modifier étudiant" : "Ajouter étudiant"}</h2>

      <form onSubmit={handleSubmit} className="internship-form">

        {!isEditMode ? (
          <select required value={selectedUserId} onChange={handleUserSelect}>
            <option value="">-- Sélectionner un utilisateur --</option>
            {users.map((user) => (
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
          name="niveau"
          placeholder="Niveau"
          required
          value={formData.niveau}
          onChange={handleChange}
        />

        <input
          type="text"
          name="specialite"
          placeholder="Spécialité"
          value={formData.specialite}
          onChange={handleChange}
        />

        <input
          type="text"
          name="skills"
          placeholder="Compétences (React, Java...)"
          value={formData.skills}
          onChange={handleChange}
        />

        <input
          type="text"
          name="cvUrl"
          placeholder="Lien du CV"
          value={formData.cvUrl}
          onChange={handleChange}
        />

        <button type="submit">
          {isEditMode ? "Mettre à jour" : "Ajouter"}
        </button>
      </form>
    </div>
  );
}

export default AddAdminStudentForm;
