import React, { useEffect, useState } from "react";
import api from "../../Api/AxiosConfig";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import UserDefault from "../../assets/user.png";
function CompanyProfileForm() {
  const navigate = useNavigate();

 const user = localStorage.getItem("user");
 const userId = JSON.parse(user).id;

  const [secteur, setSecteur] = useState("");
  const [description, setDescription] = useState("");
  const [companyId, setCompanyId] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {

    const fetchCompany = async () => {
      try {
        const companyRes = await api.get(`/users/company/user/${userId}`);
        const id = companyRes.data._id;
        console.log("Company ID fetched:", id);
        setCompanyId(id);

        const res = await api.get(`/companies/${id}`);
        setSecteur(res.data.secteur || "");
        setDescription(res.data.description || "");
        setName(res.data.idUser.name || "");
        setEmail(res.data.idUser.email || "");
        setImageUrl(res.data.image || "");
      } catch (error) {
        Swal.fire(
          "Erreur",
          "Impossible de charger les données de l'entreprise",
          "error",error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [userId, navigate]);

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!companyId) {
    Swal.fire("Erreur", "Entreprise introuvable", "error");
    return;
  }

  try {
    const formData = new FormData();
    formData.append("secteur", secteur);
    formData.append("description", description);

    if (imageFile) {
      formData.append("image", imageFile);
    }

    await api.patch(`/companies/${companyId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    Swal.fire(
      "Succès",
      "Entreprise mise à jour avec succès",
      "success"
    );

    navigate("/company/internships");
  } catch (error) {
    Swal.fire(
      "Erreur",
      error.response?.data?.message || "Erreur serveur",
      "error"
    );
  }
};


  if (loading) return <p>Chargement...</p>;

  return (
    <div className="DonnéesPersonnellesAdmin">
      <form className="DPformAdmin" onSubmit={handleSubmit}>
        <h2>Profil Entreprise</h2>

<label htmlFor="companyImage" style={{ cursor: "pointer" }}>
  <img
    src={
      imageFile
        ? URL.createObjectURL(imageFile)
        : imageUrl
          ? `http://localhost:5000${imageUrl}`
          : UserDefault
    }
    alt="Image de l'entreprise"
    style={{
      width: "150px",
      height: "150px",
      objectFit: "cover",
      borderRadius: "50%",
      border: "2px solid #ddd",
    }}
  />
</label>

<input
  type="file"
  id="companyImage"
  accept="image/*"
  hidden
  onChange={(e) => setImageFile(e.target.files[0])}
/>        

        <label className="labelNameDPAdmin">Nom</label>
        <input
          className="InputDPAdmin"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label className="labelNameDPAdmin">Email</label>
        <input
            className="InputDPAdmin"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
        />


        <label className="labelNameDPAdmin">Secteur</label>
        <input
          className="InputDPAdmin"
          type="text"
          value={secteur}
          onChange={(e) => setSecteur(e.target.value)}
          required
        />

        <label className="labelNameDPAdmin">Description</label>
        <textarea
          className="InputDPAdmin"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button
          className="EnregistrerEditProfilDashboard"
          type="submit"
        >
          Enregistrer
        </button>
      </form>
    </div>
  );
}

export default CompanyProfileForm;
