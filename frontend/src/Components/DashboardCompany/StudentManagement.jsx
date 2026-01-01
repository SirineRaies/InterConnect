import React, { useEffect, useState } from "react";
import SideBarDashboard from "./SidebarDashboard";
import NavbarDashboard from "./NavbarDashboard";
import '../../styles/StudentManagement.css'
import api from '../../Api/AxiosConfig';
import { DataGrid } from '@mui/x-data-grid';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import DownloadIcon from '@mui/icons-material/Download';
import { Link } from 'react-router-dom'
import { CircularProgress, Alert, Snackbar, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

function StudentManagement(){
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null, name: '' });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const handleDownloadCV = (cvUrl, studentName) => {
      if (cvUrl) {
        const link = document.createElement('a');
        link.href = cvUrl;
        link.download = `CV_${studentName.replace(/\s+/g, '_')}.pdf`;
        link.target = '_blank';
        link.click();
      } else {
        setSnackbar({
          open: true,
          message: 'CV non disponible',
          severity: 'warning'
        });
      }
    };

    const columns = [
        { 
          field: 'name', 
          headerName: 'Étudiant', 
          width: 180,
          cellClassName: 'Column_style_Camping',
          headerClassName: 'custom-header_Camping',
          renderCell: (params) => (
            <div style={{ fontWeight: 500 }}>
              {params.value}
            </div>
          )
        },
        { 
          field: 'email', 
          headerName: 'Email', 
          width: 220,
          cellClassName: 'Column_style_Camping',
          headerClassName: 'custom-header_Camping',
          renderCell: (params) => (
            <a href={`mailto:${params.value}`} style={{ color: '#4F46E5', textDecoration: 'none' }}>
              {params.value}
            </a>
          )
        },
        { 
          field: 'niveau', 
          headerName: 'Niveau',
          width: 140,
          cellClassName: 'Column_style_Camping',
          headerClassName: 'custom-header_Camping',
          renderCell: (params) => (
            <div style={{ 
              backgroundColor: '#f0f0ff',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '0.85rem',
              fontWeight: 500,
              color: '#4F46E5'
            }}>
              {params.value}
            </div>
          )
        },
        {
          field: 'specialite',
          headerName: 'Spécialité',
          width: 180,
          cellClassName: 'Column_style_Camping',
          headerClassName: 'custom-header_Camping'
        },
        {
          field: 'skills',
          headerName: 'Compétences',
          width: 220,
          cellClassName: 'Column_style_Camping',
          headerClassName: 'custom-header_Camping',
          renderCell: (params) => (
            <div style={{ fontSize: '0.9rem' }}>
              {params.value?.slice(0, 3).join(', ')}
              {params.value?.length > 3 && '...'}
            </div>
          )
        },
        {
          field: 'cvUrl',
          headerName: 'CV',
          width: 120,
          cellClassName: 'Column_style_Camping',
          headerClassName: 'custom-header_Camping',
          renderCell: (params) => (
            <Button
              variant="outlined"
              size="small"
              startIcon={<DownloadIcon />}
              onClick={() => handleDownloadCV(params.value, params.row.name)}
              disabled={!params.value}
              sx={{
                borderColor: '#4F46E5',
                color: '#4F46E5',
                '&:hover': {
                  backgroundColor: '#f5f5ff',
                  borderColor: '#4336F0'
                }
              }}
            >
              Télécharger
            </Button>
          )
        },
        {
          field: 'actions',
          headerName: 'Actions',
          width: 150,
          cellClassName: 'Column_style_Camping',
          headerClassName: 'custom-header_Camping',
          renderCell: (params) => (
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <Link to={`/student-details/${params.row.id}`} title="Voir détails">
                <RemoveRedEyeOutlinedIcon 
                  sx={{ 
                    color: '#4F46E5',
                    cursor: 'pointer',
                    '&:hover': { color: '#4336F0' }
                  }} 
                />
              </Link>
              <CloseOutlinedIcon 
                sx={{ 
                  color: '#ef4444',
                  cursor: 'pointer',
                  '&:hover': { color: '#dc2626' }
                }}
                onClick={() => handleOpenDeleteDialog(params.row.id, params.row.name)}
                title="Supprimer"
              />
            </div>
          )
        }
    ];

    const handleOpenDeleteDialog = (id, name) => {
      setDeleteDialog({ open: true, id, name });
    };

    const handleCloseDeleteDialog = () => {
      setDeleteDialog({ open: false, id: null, name: '' });
    };

    const handleConfirmDelete = async () => {
      try {
        await api.delete(`/students/${deleteDialog.id}`);
        setStudents(prev => prev.filter(student => student._id !== deleteDialog.id));
        setSnackbar({
          open: true,
          message: 'Étudiant supprimé avec succès',
          severity: 'success'
        });
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        setSnackbar({
          open: true,
          message: 'Erreur lors de la suppression',
          severity: 'error'
        });
      } finally {
        handleCloseDeleteDialog();
      }
    };

    const rows = students.map((student) => ({
        id: student._id,
        name: student.name || `${student.firstName} ${student.lastName}`,
        niveau: student.niveau || 'Non spécifié',
        specialite: student.specialite || 'Non spécifié',
        skills: student.skills || [],
        cvUrl: student.cvUrl,
        email: student.email,
    }));

    useEffect(() => {
        const fetchData = async () => {
          try {
            setLoading(true);
            const response = await api.get('/students');
            console.log('Données reçues:', response.data);
            if (Array.isArray(response.data)) {
              setStudents(response.data);
            } else {
              setError('Format de données invalide');
            }
          } catch (error) {
            console.error('Erreur lors de la récupération des étudiants:', error);
            setError('Impossible de charger les données');
          } finally {
            setLoading(false);
          }
        };
    
        fetchData();
      }, []);
    
    return(
        <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
            <NavbarDashboard/>
            <SideBarDashboard/>
            
            <div className="main-content" style={{ 
              marginLeft: '280px', 
              padding: '30px',
              paddingTop: '100px'
            }}>
              <div className="page-header" style={{ 
                marginBottom: '30px',
                paddingBottom: '20px',
                borderBottom: '1px solid #e5e7eb'
              }}>
                <h1 style={{ 
                  fontSize: '28px', 
                  fontWeight: 700, 
                  color: '#1f2937',
                  margin: 0 
                }}>
                  Gestion des Étudiants
                </h1>
                <p style={{ 
                  color: '#6b7280',
                  marginTop: '8px',
                  fontSize: '16px'
                }}>
                  Visualisez et gérez les profils étudiants
                </p>
              </div>

              {loading ? (
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  height: '400px' 
                }}>
                  <CircularProgress sx={{ color: '#4F46E5' }} />
                </div>
              ) : error ? (
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 3,
                    borderRadius: '12px'
                  }}
                >
                  {error}
                  <Button 
                    onClick={() => window.location.reload()}
                    sx={{ ml: 2 }}
                    variant="outlined"
                    size="small"
                  >
                    Réessayer
                  </Button>
                </Alert>
              ) : (
                <div style={{ 
                  backgroundColor: 'white',
                  borderRadius: '16px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  padding: '20px',
                  height: '600px',
                  width: '100%'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '20px' 
                  }}>
                    <div>
                      <h2 style={{ 
                        fontSize: '18px', 
                        fontWeight: 600, 
                        color: '#374151',
                        margin: 0 
                      }}>
                        Liste des étudiants
                      </h2>
                      <p style={{ 
                        color: '#9ca3af',
                        fontSize: '14px',
                        marginTop: '4px'
                      }}>
                        {students.length} étudiant{students.length !== 1 ? 's' : ''} trouvé{students.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <input
                        placeholder="Rechercher un étudiant..."
                        style={{
                          padding: '10px 16px',
                          borderRadius: '8px',
                          border: '1px solid #e5e7eb',
                          fontSize: '14px',
                          width: '250px'
                        }}
                      />
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: '#4F46E5',
                          '&:hover': { backgroundColor: '#4336F0' }
                        }}
                      >
                        Exporter
                      </Button>
                    </div>
                  </div>
                  
                  <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10, 25, 50]}
                    checkboxSelection
                    disableSelectionOnClick
                    sx={{
                      border: 'none',
                      '& .MuiDataGrid-cell': {
                        borderBottom: '1px solid #f3f4f6',
                      },
                      '& .MuiDataGrid-columnHeaders': {
                        backgroundColor: '#f9fafb',
                        borderBottom: '2px solid #e5e7eb',
                      },
                      '& .MuiDataGrid-footerContainer': {
                        borderTop: '1px solid #e5e7eb',
                        backgroundColor: '#f9fafb',
                      },
                      '& .MuiDataGrid-row:hover': {
                        backgroundColor: '#f8fafc',
                      }
                    }}
                  />
                </div>
              )}
            </div>

            {/* Dialog de confirmation de suppression */}
            <Dialog
              open={deleteDialog.open}
              onClose={handleCloseDeleteDialog}
              PaperProps={{
                sx: { borderRadius: '12px', padding: '8px' }
              }}
            >
              <DialogTitle sx={{ fontWeight: 600, color: '#1f2937' }}>
                Confirmer la suppression
              </DialogTitle>
              <DialogContent>
                Êtes-vous sûr de vouloir supprimer l'étudiant "{deleteDialog.name}" ?
                Cette action est irréversible.
              </DialogContent>
              <DialogActions sx={{ padding: '16px 24px' }}>
                <Button 
                  onClick={handleCloseDeleteDialog}
                  sx={{ color: '#6b7280' }}
                >
                  Annuler
                </Button>
                <Button 
                  onClick={handleConfirmDelete}
                  variant="contained"
                  sx={{ 
                    backgroundColor: '#ef4444',
                    '&:hover': { backgroundColor: '#dc2626' }
                  }}
                >
                  Supprimer
                </Button>
              </DialogActions>
            </Dialog>

            {/* Snackbar pour les notifications */}
            <Snackbar
              open={snackbar.open}
              autoHideDuration={4000}
              onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
              <Alert 
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
                severity={snackbar.severity}
                sx={{ borderRadius: '8px' }}
              >
                {snackbar.message}
              </Alert>
            </Snackbar>
        </div>
    );
}

export default StudentManagement;