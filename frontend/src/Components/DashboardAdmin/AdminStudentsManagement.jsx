import { useEffect, useState } from "react";
import "../../styles/StudentManagement.css";
import api from '../../Api/AxiosConfig';
import { DataGrid } from "@mui/x-data-grid";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import Swal from "sweetalert2";
import { Link , useNavigate } from "react-router-dom";
import SidebarDashboardAdmin from "./SidebarDashboardAdmin";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

function AdminStudentsManagement() {
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  const columns = [
    { field: "name", headerName: "Nom", width: 200, cellClassName: 'Column_style_Camping', headerClassName: 'custom-header_Camping' },
    { field: "email", headerName: "Email", width: 250, cellClassName: 'Column_style_Camping', headerClassName: 'custom-header_Camping' },
    { field: "niveau", headerName: "Niveau", width: 180, cellClassName: 'Column_style_Camping', headerClassName: 'custom-header_Camping' },
    { field: "specialite", headerName: "Spécialité", width: 180, cellClassName: 'Column_style_Camping', headerClassName: 'custom-header_Camping' },
    { field: "skills", headerName: "Compétences", width: 250, cellClassName: 'Column_style_Camping', headerClassName: 'custom-header_Camping',
      renderCell: (params) => params.value?.length ? params.value.join(", ") : "—"
    },
    { field: "profileCompleted", headerName: "Profil complété", width: 160, cellClassName: 'Column_style_Camping', headerClassName: 'custom-header_Camping',
      renderCell: (params) => params.value ? "✅ Oui" : "❌ Non"
    },
    { field: "createdAt", headerName: "Inscription", width: 150, cellClassName: 'Column_style_Camping', headerClassName: 'custom-header_Camping',
      renderCell: (params) => new Date(params.value).toLocaleDateString("fr-FR")
    },
    { field: "actions", headerName: "", width: 150, cellClassName: 'Column_style_Camping', headerClassName: 'custom-header_Camping',
      renderCell: (params) => renderActions(params.row)
    }
  ];

  const renderActions = (row) => (
    <div style={{ display: "flex", gap: "10px" }}>
      <VisibilityOutlinedIcon
        className="ViewOfferIcon"
        onClick={() => showStudentDetails(row)}
      />

       <EditOutlinedIcon
        className="EditOfferIcon"
        onClick={() => navigate(`/admin/students/edit/${row.id}`)}
      />

      <CloseOutlinedIcon
        className="RefuseCamping"
        onClick={() => deleteStudent(row.id)}
      />
    </div>
  );

  const showStudentDetails = (student) => {
    Swal.fire({
      title: student.name,
      html: `
        <div style="text-align:left">
          <p><b>Email :</b> ${student.email}</p>
          <p><b>Niveau :</b> ${student.niveau}</p>
          <p><b>Spécialité :</b> ${student.specialite || "—"}</p>
          <p><b>Compétences :</b> ${student.skills?.length ? student.skills.join(", ") : "—"}</p>
          <p><b>Profil complété :</b> ${student.profileCompleted ? "Oui" : "Non"}</p>
          <p><b>CV :</b> ${student.cvUrl ? `<a href="${student.cvUrl}" target="_blank">Voir CV</a>` : "—"}</p>
        </div>
      `,
      width: "650px",
      confirmButtonText: "Fermer",
    });
  };

  const deleteStudent = (id) => {
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
          await api.delete(`/students/${id}`);
          Swal.fire("Supprimé !", "Étudiant supprimé", "success");
          setStudents((prev) => prev.filter((s) => s.id !== id));
        } catch (error) {
          Swal.fire("Erreur", "Erreur lors de la suppression", error);
        }
        setStudents((prev) => prev.filter((student) => student._id !== id));

      }
    });
  };

  const rows = students.map((student) => ({
    id: student._id,
    name: student.userId?.name,
    email: student.userId?.email,
    niveau: student.niveau,
    specialite: student.specialite,
    skills: student.skills,
    profileCompleted: student.userId?.profileCompleted,
    createdAt: student.userId?.createdAt,
    cvUrl: student.cvUrl
  }));

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await api.get("/students");
        setStudents(res.data);
      } catch (error) {
        console.error("Erreur chargement étudiants", error);
      }
    };
    fetchStudents();
  }, []);

  return (
    <div>
      <SidebarDashboardAdmin />
      <div className="CampingsDashboardAdmin_title header-with-button">
        <h1>Gestion des étudiants</h1>
        <Link to="/admin/createStudent" className="add-offer-btn">
          + Ajouter un étudiant
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

export default AdminStudentsManagement;
