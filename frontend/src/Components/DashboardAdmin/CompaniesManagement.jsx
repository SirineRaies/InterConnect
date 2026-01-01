import { useEffect, useState } from "react";
import "../../styles/StudentManagement.css";
import api from '../../Api/AxiosConfig';
import { DataGrid } from "@mui/x-data-grid";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import SidebarDashboardAdmin from "./SidebarDashboardAdmin";

function CompaniesManagement() {
  const [companies, setCompanies] = useState([]);
  const navigate = useNavigate();

  const columns = [
    {
      field: "name",
      headerName: "Nom de l'entreprise",
      width: 260,
      cellClassName: "Column_style_Camping",
      headerClassName: "custom-header_Camping",
    },
    {
      field: "email",
      headerName: "Email",
      width: 280,
      cellClassName: "Column_style_Camping",
      headerClassName: "custom-header_Camping",
    },
    {
      field: "secteur",
      headerName: "Secteur",
      width: 220,
      cellClassName: "Column_style_Camping",
      headerClassName: "custom-header_Camping",
    },
    {
      field: "description",
      headerName: "Description",
      width: 300,
      cellClassName: "Column_style_Camping",
      headerClassName: "custom-header_Camping",
    },
    {
      field: "profileCompleted",
      headerName: "Profil complété",
      width: 180,
      cellClassName: "Column_style_Camping",
      headerClassName: "custom-header_Camping",
    },
    {
      field: "actions",
      headerName: "",
      width: 140,
      renderCell: (params) => renderActions(params.row),
    },
  ];

  const renderActions = (row) => (
    <div style={{ display: "flex", gap: "10px" }}>
      <EditOutlinedIcon
        className="EditOfferIcon"
        onClick={() => navigate(`/admin/companies/edit/${row.companyId}`)}
      />
      <CloseOutlinedIcon
        className="RefuseCamping"
        onClick={() => deleteCompany(row.companyId, row.userId)}
      />
    </div>
  );

 const deleteCompany = (id, userId) => {
  Swal.fire({
    title: "Êtes-vous sûr ?",
    text: "Cette action supprimera l’entreprise et son compte utilisateur",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Oui, supprimer",
    cancelButtonText: "Annuler",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        // Supprimer d'abord la Company
        await api.delete(`/companies/${id}`);

        // Supprimer le User associé
        if (userId) {
          await api.delete(`/users/${userId}`);
        }

        Swal.fire(
          "Supprimé",
          "Entreprise supprimée avec succès",
          "success"
        );

        setCompanies((prev) => prev.filter((c) => c._id !== id));
      } catch (error) {
        Swal.fire(
          "Erreur",
          error.response?.data?.message || error.message,
          "error"
        );
      }
    }
  });
};


const rows = companies.map((company) => ({
  id: company._id,
  companyId: company._id,
  userId: company.idUser?._id,
  name: company.idUser?.name || "Utilisateur supprimé",
  email: company.idUser?.email || "—",
  secteur: company.secteur,
  description: company.description,
  profileCompleted: company.idUser?.profileCompleted ? "Oui" : "Non",
}));



  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await api.get("/companies");
        setCompanies(res.data);
      } catch (error) {
        console.error("Erreur chargement entreprises", error);
      }
    };

    fetchCompanies();
  }, []);

  return (
    <div>
      <SidebarDashboardAdmin />

      <div className="CampingsDashboardAdmin_title header-with-button">
        <h1>Gestion des entreprises</h1>

        <Link to="/admin/createCompany" className="add-offer-btn">
          + Ajouter une entreprise
        </Link>
      </div>

      <div
        style={{ height: 700, width: "82%" }}
        className="Pourcentage_Campings_dashboardAdmin"
      >
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          disableRowSelectionOnClick
        />
      </div>
    </div>
  );
}

export default CompaniesManagement;
