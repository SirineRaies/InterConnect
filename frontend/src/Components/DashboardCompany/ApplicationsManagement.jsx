import { useEffect, useState } from "react";
import "../../styles/StudentManagement.css";
import api from '../../Api/AxiosConfig';
import { DataGrid } from "@mui/x-data-grid";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import Swal from "sweetalert2";
import { Link, useNavigate } from 'react-router-dom';
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

function ApplicationManagement() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = localStorage.getItem("user");
  const userId = JSON.parse(user).id;

  const columns = [
    { field: "studentName", headerName: "Étudiant", width: 200, cellClassName: 'Column_style_Camping', headerClassName: 'custom-header_Camping' },
    { field: "email", headerName: "Email", width: 250, cellClassName: 'Column_style_Camping', headerClassName: 'custom-header_Camping' },
    { field: "internshipTitle", headerName: "Offre", width: 250, cellClassName: 'Column_style_Camping', headerClassName: 'custom-header_Camping' },
    { field: "status", headerName: "Statut", width: 150, cellClassName: 'Column_style_Camping', headerClassName: 'custom-header_Camping' },
    { field: "scoreIA", headerName: "Score IA", width: 120,cellClassName: 'Column_style_Camping', headerClassName: 'custom-header_Camping',renderCell: (params) => params.value ?? "—"},
    { field: "CV", headerName: "CV", width: 100, cellClassName: 'Column_style_Camping', headerClassName: 'custom-header_Camping', renderCell: (params) => (params.row.cvUrl ? <a href={params.row.cvUrl} target="_blank" rel="noopener noreferrer">Voir CV</a> : "N/A") },
    { field: "submittedAt", headerName: "Date de candidature", width: 150, cellClassName: 'Column_style_Camping', headerClassName: 'custom-header_Camping',renderCell: (params) => new Date(params.value).toLocaleDateString("fr-FR")},
    {field: "actions",headerName: "Actions", width: 300, cellClassName: 'Column_style_Camping', headerClassName: 'custom-header_Camping',renderCell: (params) => renderActions(params.row)}
  ];

  const handleAccept = async (id, email) => {
    Swal.fire({
      title: "Accepter la candidature ?",
      text: "Un email de confirmation sera envoyé au candidat",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#4CAF50",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, accepter",
      cancelButtonText: "Annuler",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.patch(`/applications/${id}`, { status: 'Accepté' });
          
          await api.post(`/applications/accept/${id}`, { email });
          
          Swal.fire("Acceptée !", "La candidature a été acceptée et un email a été envoyé", "success");
          
          // Mettre à jour l'état local
          setApplications((prev) => 
            prev.map((app) => app._id === id ? { ...app, status: 'Accepté' } : app)
          );
        } catch (error) {
          console.error("Erreur:", error);
          Swal.fire("Erreur", error.response?.data || "Erreur lors de l'acceptation", "error");
        }
      }
    });
  };

  const handleReject = async (id, email) => {
    Swal.fire({
      title: "Refuser la candidature ?",
      text: "Un email de notification sera envoyé au candidat",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f44336",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, refuser",
      cancelButtonText: "Annuler",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.patch(`/applications/${id}`, { status: 'Refusé' });
          
          await api.post(`/applications/refuse/${id}`, { email });
          
          Swal.fire("Refusée !", "La candidature a été refusée et un email a été envoyé", "success");
          
          // Mettre à jour l'état local
          setApplications((prev) =>
            prev.map((app) => app._id === id ? { ...app, status: 'Refusé' } : app)
          );
        } catch (error) {
          console.error("Erreur:", error);
          Swal.fire("Erreur", error.response?.data || "Erreur lors du refus", "error");
        }
      }
    });
  };

  const renderActions = (row) => (
    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
      {row.status === 'En attente' && (
        <>
          <button 
            style={{
              border: 'none',
              backgroundColor: '#4CAF50',
              color: 'white',
              padding: '5px 10px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
            onClick={() => handleAccept(row.id, row.email)}
          >
            Accepter
          </button>
          <button 
            style={{
              border: 'none',
              backgroundColor: '#f44336',
              color: 'white',
              padding: '5px 10px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
            onClick={() => handleReject(row.id, row.email)}
          >
            Refuser
          </button>
        </>
      )}
      <VisibilityOutlinedIcon 
        className="ViewOfferIcon" 
        onClick={() => showApplicationDetails(row)}
        style={{ cursor: 'pointer' }}
      />
      <EditOutlinedIcon 
        className="EditOfferIcon" 
        onClick={() => navigate(`/company/applications/edit/${row.id}`)}
        style={{ cursor: 'pointer' }}
      />
      <CloseOutlinedIcon 
        className="RefuseCamping" 
        onClick={() => deleteApplication(row.id)}
        style={{ cursor: 'pointer' }}
      />
    </div>
  );

  const showApplicationDetails = (app) => {
    Swal.fire({
      title: app.studentName,
      html: `
        <div style="text-align:left">
          <p><b>Email :</b> ${app.email}</p>
          <p><b>Offre :</b> ${app.internshipTitle}</p>
          <p><b>Statut :</b> ${app.status}</p>
          <p><b>Score IA :</b> ${app.scoreIA ?? "—"}</p>
          <p><b>Date de candidature :</b> ${new Date(app.submittedAt).toLocaleDateString("fr-FR")}</p>
        </div>
      `,
      width: "650px",
      confirmButtonText: "Fermer",
    });
  };

  const deleteApplication = (id) => {
    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Cette action est irréversible !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/applications/${id}`);
          Swal.fire("Supprimé !", "Candidature supprimée", "success");
          setApplications((prev) => prev.filter((a) => a._id !== id));
        } catch (error) {
          Swal.fire("Erreur", "Erreur lors de la suppression", "error",error);
        }
      }
    });
  };

  const rows = applications.map((app) => ({
    id: app._id,
    studentName: app.userId?.name || "Étudiant non spécifié",
    email: app.email || app.userId?.email || "Email non spécifié",
    internshipTitle: app.internshipId?.title || "Offre non spécifiée",
    status: app.status,
    scoreIA: app.scoreIA,
    submittedAt: app.createdAt
  }));

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const companyRes = await api.get(`/users/company/user/${userId}`);
        const companyId = companyRes.data._id;
        
        const res = await api.get(`/applications/company/${companyId}`);
        console.log("Réponse API:", res.data);
        
        const applicationsData = res.data.data || res.data;
        setApplications(Array.isArray(applicationsData) ? applicationsData : []);
      } catch (error) {
        console.error("Erreur chargement candidatures", error);
        Swal.fire("Erreur", "Impossible de charger les candidatures", "error");
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [userId]);

  return (
    <div>
      <div className="CampingsDashboardAdmin_title header-with-button">
        <h1>Gestion des candidatures</h1>
        <Link to="/company/createApplication" className="add-offer-btn">
          + Ajouter une candidature
        </Link>
      </div>
      <div style={{ height: 700, width: '82%' }} className="Pourcentage_Campings_dashboardAdmin">
        {loading ? (
          <p>Chargement des candidatures...</p>
        ) : (
          <DataGrid
            className="Pourcentage_items_Campings"
            rows={rows}
            columns={columns}
            pageSize={50}
            pageSizeOptions={[10, 25, 50, 100]}
          />
        )}
      </div>
    </div>
  );
}

export default ApplicationManagement;