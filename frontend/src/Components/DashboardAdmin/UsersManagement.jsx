import { useEffect, useState } from "react";
import '../../styles/StudentManagement.css'
import api from '../../Api/AxiosConfig';
import { DataGrid } from '@mui/x-data-grid';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import {Link , useNavigate } from 'react-router-dom'
import Swal from "sweetalert2";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import SidebarDashboardAdmin from "./SidebarDashboardAdmin";

function UsersManagement(){
    const [Users , setUsers]=useState([])
    const navigate = useNavigate();

    const columns = [
        { field: 'name', headerName: 'Nom et prénom',width:300,cellClassName: 'Column_style_Camping',headerClassName: 'custom-header_Camping'},
        { field: 'email', headerName: 'Email',width:290,cellClassName: 'Column_style_Camping' ,headerClassName: 'custom-header_Camping'},
        { field: 'role', headerName: 'Role ',cellClassName: 'Column_style_Camping' ,width:350,headerClassName: 'custom-header_Camping' },
        { field: "profileCompleted", headerName: "Profil complété", width: 160, cellClassName: 'Column_style_Camping', headerClassName: 'custom-header_Camping',
              renderCell: (params) => params.value ? "✅ Oui" : "❌ Non"
        },       
        { field:'e', headerName:'',width:150,cellClassName: 'Column_style_Camping',headerClassName: 'custom-header_Camping',
        renderCell:(params)=> renderAcceptButton(params.row)
        },
    ];

    const renderAcceptButton = (row) => {
  return (
    <div style={{ display: "flex", gap: "10px" }}>

      <EditOutlinedIcon
        className="EditOfferIcon"
        onClick={() => navigate(`/admin/users/edit/${row.id}`)}
      />

      <CloseOutlinedIcon
        className="RefuseCamping"
        onClick={() => DeleteRow(row.id)}
      />
    </div>
  );
};


   const DeleteRow = (idUser) => {
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
                const response = await api.delete(`/users/${idUser}`);
                console.log("✅ Réponse:", response.data);

                Swal.fire({
                    title: "Supprimé !",
                    text: "L'utilisateur a été supprimé avec succès.",
                    icon: "success",
                });

                setUsers((prev) => prev.filter((user) => user._id !== idUser));

            } catch (error) {
                console.error("❌ Erreur complète:", error);
                console.error("❌ Response:", error.response);
                
                Swal.fire({
                    title: "Erreur",
                    text: error.response?.data?.message || "Erreur lors de la suppression",
                    icon: "error",
                });
            }
        }
    });
};


    const rows =  Users.map((User) => {
        return{
        id: User._id,
        name: User.name,
        email: User.email,
        profileCompleted: User.profileCompleted,
        role: User.role,
        
    }});

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await api.get('/users');
            console.log(response.data)
            setUsers(response.data)
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
              <h1>Les utilisateurs</h1>

              <Link to="/admin/createUser" className="add-offer-btn">
                + Ajouter un utilisateur
              </Link>
            </div>
            <div style={{ height: 700, width: '82%' }} className="Pourcentage_Campings_dashboardAdmin">
                <DataGrid className="Pourcentage_items_Campings" rows={rows} columns={columns} pageSize={50} />
            </div>
        </div>
    )
}
export default UsersManagement;