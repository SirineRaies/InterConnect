import { useEffect, useState } from "react";
import "../../styles/StudentManagement.css";
import api from '../../Api/AxiosConfig';
import { DataGrid } from "@mui/x-data-grid";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import Swal from "sweetalert2";
import SidebarDashboardAdmin from "./SidebarDashboardAdmin";
import {Link , useNavigate  } from 'react-router-dom'
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

function AdminApplicationsManagement() {
  const [applications, setApplications] = useState([]);
  const navigate = useNavigate();

  const columns = [
    { field: "studentName", headerName: "Étudiant", width: 200, cellClassName: 'Column_style_Camping', headerClassName: 'custom-header_Camping' },
    { field: "email", headerName: "Email", width: 250, cellClassName: 'Column_style_Camping', headerClassName: 'custom-header_Camping' },
    { field: "internshipTitle", headerName: "Offre", width: 250, cellClassName: 'Column_style_Camping', headerClassName: 'custom-header_Camping' },
    { field: "status", headerName: "Statut", width: 150, cellClassName: 'Column_style_Camping', headerClassName: 'custom-header_Camping' },
    { field: "scoreIA", headerName: "Score IA", width: 120, cellClassName: 'Column_style_Camping', headerClassName: 'custom-header_Camping',
      renderCell: (params) => params.value ?? "—"
    },
    { field: "submittedAt", headerName: "Date de candidature", width: 150, cellClassName: 'Column_style_Camping', headerClassName: 'custom-header_Camping',
      renderCell: (params) => new Date(params.value).toLocaleDateString("fr-FR")
    },
    { field: "actions", headerName: "", width: 300, cellClassName: 'Column_style_Camping', headerClassName: 'custom-header_Camping',
      renderCell: (params) => renderActions(params.row)
    }
  ];

  const renderActions = (row) => (
    <div style={{ display: "flex", gap: "10px" }}>
      <button style={{border:'none',backgroundColor:'blue',cursor:'pointer'}} >Accepter </button>
      <button style={{border:'none',backgroundColor:'blue',cursor:'pointer'}}>Refuser </button>
      <VisibilityOutlinedIcon className="ViewOfferIcon" onClick={() => showApplicationDetails(row)} />
      <EditOutlinedIcon className="EditOfferIcon" onClick={() => navigate(`/admin/applications/edit/${row.id}`)}/>
      <CloseOutlinedIcon className="RefuseCamping" onClick={() => deleteApplication(row.id)} />
        
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
          setApplications((prev) => prev.filter((a) => a.id !== id));
        } catch (error) {
          Swal.fire("Erreur", "Erreur lors de la suppression", error);
        }
        setApplications((prev) => prev.filter((application) => application._id !== id));

      }
    });
  };

  const rows = applications.map((app) => ({
  id: app._id,
  studentName: app.userId?.name || "Étudiant non spécifié",
  email: app.userId?.email || "Email non spécifié",
  internshipTitle: app.internshipId?.title || "Offre non spécifiée",
  status: app.status,
  scoreIA: app.scoreIA,
  submittedAt: app.createdAt
}));

useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await api.get("/applications");
        console.log(res.data);
        setApplications(res.data);
      } catch (error) {
        console.error("Erreur chargement candidatures", error);
      }
    };
    fetchApplications();
}, []);

  return (
    <div>
      <SidebarDashboardAdmin />
      <div className="CampingsDashboardAdmin_title header-with-button">
        <h1>Gestion des candidatures</h1>
         <Link to="/admin/createApplication" className="add-offer-btn">
                + Ajouter une candidature
              </Link>
      </div>
      <div style={{ height: 700, width: '82%' }} className="Pourcentage_Campings_dashboardAdmin">
        <DataGrid
          className="Pourcentage_items_Campings"
          rows={rows}
          columns={columns}
          pageSize={50}
        />
      </div>
    </div>
  );
}

export default AdminApplicationsManagement;
