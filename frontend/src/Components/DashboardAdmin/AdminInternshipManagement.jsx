import  { useEffect, useState } from "react";
import '../../styles/StudentManagement.css'
import api from '../../Api/AxiosConfig';
import { DataGrid } from '@mui/x-data-grid';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import {Link , useNavigate } from 'react-router-dom'
import Swal from "sweetalert2";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import SidebarDashboardAdmin from "./SidebarDashboardAdmin";

function AdminInternshipManagement(){
    const [Offres , setOffres]=useState([])
    const navigate = useNavigate();

    const columns = [
        { field: 'title', headerName: 'Offre',width:300,cellClassName: 'Column_style_Camping',headerClassName: 'custom-header_Camping'},
        { field: 'description', headerName: 'Description',width:290,cellClassName: 'Column_style_Camping' ,headerClassName: 'custom-header_Camping'},
        { field: 'requiredSkills', headerName: 'Compétences requises',cellClassName: 'Column_style_Camping' ,width:350,headerClassName: 'custom-header_Camping' },
        { field: 'supervisor',headerName: 'Superviseur',width:250,cellClassName: 'Column_style_Camping',headerClassName: 'custom-header_Camping' },
        {field: 'startDate',headerName: 'Date début',width: 150,cellClassName: 'Column_style_Camping',headerClassName: 'custom-header_Camping',renderCell: (params) => formatDate(params.value)},
        {field: 'endDate',headerName: 'Date fin',width: 150,cellClassName: 'Column_style_Camping',headerClassName: 'custom-header_Camping',renderCell: (params) => formatDate(params.value)},
        { field:'e', headerName:'',width:150,cellClassName: 'Column_style_Camping',headerClassName: 'custom-header_Camping',
        renderCell:(params)=> renderAcceptButton(params.row)
        },
    ];

    const renderAcceptButton = (row) => {
  return (
    <div style={{ display: "flex", gap: "10px" }}>
      <VisibilityOutlinedIcon
        className="ViewOfferIcon"
        onClick={() => showOfferDetails(row)}
      />

      <EditOutlinedIcon
        className="EditOfferIcon"
        onClick={() => navigate(`/admin/internships/edit/${row.id}`)}
      />

      <CloseOutlinedIcon
        className="RefuseCamping"
        onClick={() => DeleteRow(row.id)}
      />
    </div>
  );
};


    const formatDate = (date) => {
        if (!date) return "—";
        return new Date(date).toLocaleDateString("fr-FR");
    };

    const showOfferDetails = (offer) => {
        Swal.fire({
            title: offer.title,
            html: `
            <div style="text-align:left">
                <p><b>Description :</b><br/>${offer.description}</p>
                <p><b>Compétences requises :</b> ${offer.requiredSkills.join(", ")}</p>
                <p><b>Superviseur :</b> ${offer.supervisor}</p>
                <p><b>Date début :</b> ${new Date(offer.startDate).toLocaleDateString("fr-FR")}</p>
                <p><b>Date fin :</b> ${
                offer.endDate
                    ? new Date(offer.endDate).toLocaleDateString("fr-FR")
                    : "—"
                }</p>
            </div>
            `,
            width: "650px",
            confirmButtonText: "Fermer",
        });
    };


   const DeleteRow = (id) => {
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
        await api.delete(`internships/${id}`);

        Swal.fire({
          title: "Supprimé !",
          text: "L'offre a été supprimée avec succès.",
          icon: "success",
        });

        setOffres((prev) => prev.filter((offre) => offre._id !== id));

      } catch (error) {
        Swal.fire({
          title: "Erreur",
          text: "Erreur lors de la suppression",
          icon: "error",
        });
        console.error(error);
      }
    }
  });
};


    const rows =  Offres.map((Offre) => {
        return{
        id: Offre._id,
        title: Offre.title,
        description: Offre.description,
        requiredSkills: Offre.requiredSkills,
        supervisor: Offre.supervisor,
        startDate:Offre.startDate,
        endDate:Offre.endDate,
    }});

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await api.get('/internships');
            console.log(response.data)
            setOffres(response.data)
          } catch (error) {
            console.error('Erreur lors de chargement des données', error);
          }
        };
    
        fetchData();
      }, []);
    
    return(
        <div>
            <SidebarDashboardAdmin/>
            <div className="CampingsDashboardAdmin_title header-with-button">
              <h1>Les campings et les détails des offres publiés par les guides</h1>

              <Link to="/admin/createInternship" className="add-offer-btn">
                + Ajouter une offre
              </Link>
            </div>
            <div style={{ height: 700, width: '82%' }} className="Pourcentage_Campings_dashboardAdmin">
                <DataGrid className="Pourcentage_items_Campings" rows={rows} columns={columns} pageSize={50} />
            </div>
        </div>
    )
}
export default AdminInternshipManagement;