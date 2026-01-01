import './App.css'
import HomePage from './Pages/HomePage';
import LoginPage from './Pages/LoginPage'
import RegisterPage from './Pages/RegisterPage'
import OffresListPage from './Pages/OffresListPage'
import CompaniesListPage from './Pages/CompaniesListPage';
import { Routes, Route  } from 'react-router-dom';
import DashboardCompanyPage from './Pages/DashboardCompany/DashboardCompanyPage';
import CreateInternshipPage from './Pages/DashboardCompany/CreateInternshipPage.jsx'
import DashboardUsersPage from './Pages/DashboardAdmin/DashboardUsersPage.jsx'
import CreateUserPage from './Pages/DashboardAdmin/CreateUserPage.jsx'
import CreateAdminInternshipPage from './Pages/DashboardAdmin/CreateAdminInternshipPage.jsx';
import DashboardAdminInternshipsPage from './Pages/DashboardAdmin/DashboardAdminInternshipsPage.jsx';
import DashboardCompaniesPage from './Pages/DashboardAdmin/DashboardCompaniesPage.jsx'
import CreateCompanyPage from './Pages/DashboardAdmin/CreateCompanyPage.jsx';
import DashboardAdminStudentsPage from './Pages/DashboardAdmin/DashboardAdminStudentsPage.jsx';
import CreateAdminStudentPage from './Pages/DashboardAdmin/CreateAdminStudentPage.jsx';
import CreateAdminApplicationPage from './Pages/DashboardAdmin/CreateAdminApplicationPage.jsx';
import DashboardAdminApplicationsPage from './Pages/DashboardAdmin/DashboardAdminApplicationsPage.jsx';
import ProtectedRoute from './Components/ProtectRoutes.jsx';
import ApplicationsManagementPage from './Pages/DashboardCompany/ApplicationsManagementPage.jsx';
import CreateApplicationPage from './Pages/DashboardCompany/CreateApplicationPage.jsx';
import ProfileForm from './Components/DashboardCompany/ProfileForm.jsx';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<HomePage/>} />
        <Route path='/companiesList' element={<CompaniesListPage/>}/>
        <Route path='/company/:idCompany/offres' element={<OffresListPage/>}/>
        <Route path='/modify-profile' element={ <ProfileForm/> } />

        <Route path='/company/internships' element={
            <ProtectedRoute allowedRoles={["company"]}>
              <DashboardCompanyPage />
            </ProtectedRoute>
        } />
        <Route path='/company/createInternship' element={
          <ProtectedRoute allowedRoles={["company"]}>
              <CreateInternshipPage />
            </ProtectedRoute>
        } />
        <Route path="/company/internships/edit/:id" element={
          <ProtectedRoute allowedRoles={["company"]}>
              <CreateInternshipPage />
            </ProtectedRoute>
        } />

        <Route path="/company/applications" element={
          <ProtectedRoute allowedRoles={["company"]}>
              <ApplicationsManagementPage />
            </ProtectedRoute>
        } />

        <Route path="/company/createApplication/" element={
          <ProtectedRoute allowedRoles={["company"]}>
              <CreateApplicationPage />
            </ProtectedRoute>
        } />

        <Route path="/company/applications/edit/:id" element={
          <ProtectedRoute allowedRoles={["company"]}>
              <CreateApplicationPage />
            </ProtectedRoute>
        } />

        <Route path="/admin/users" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <DashboardUsersPage />
            </ProtectedRoute>
        }  />
        <Route path='/admin/createUser' element={
           <ProtectedRoute allowedRoles={["admin"]}>
              <CreateUserPage />
            </ProtectedRoute>
        }  />
        <Route path="/admin/users/edit/:id" element={
          <ProtectedRoute allowedRoles={["admin"]}>
              <CreateUserPage />
            </ProtectedRoute>
        }  />
        <Route path="/admin/internships" element={
           <ProtectedRoute allowedRoles={["admin"]}>
              <DashboardAdminInternshipsPage />
            </ProtectedRoute>
        }  />
        <Route path='/admin/createInternship' element={
          <ProtectedRoute allowedRoles={["admin"]}>
              <CreateAdminInternshipPage />
            </ProtectedRoute>
        }  />
        <Route path="/admin/internships/edit/:id" element={
          <ProtectedRoute allowedRoles={["admin"]}>
              <CreateAdminInternshipPage />
            </ProtectedRoute>
        }  />
        <Route path="/admin/companies" element={
           <ProtectedRoute allowedRoles={["admin"]}>
              <DashboardCompaniesPage />
            </ProtectedRoute>
        }  />
        <Route path='/admin/createCompany' element={
           <ProtectedRoute allowedRoles={["admin"]}>
              <CreateCompanyPage />
            </ProtectedRoute>
        }  />
        <Route path="/admin/companies/edit/:id" element={
           <ProtectedRoute allowedRoles={["admin"]}>
              <CreateCompanyPage />
            </ProtectedRoute>
        }  />
        <Route path="/admin/students" element={
          <ProtectedRoute allowedRoles={["admin"]}>
              <DashboardAdminStudentsPage />
            </ProtectedRoute>
        }  />
        <Route path='/admin/createStudent' element={
          <ProtectedRoute allowedRoles={["admin"]}>
              <CreateAdminStudentPage />
            </ProtectedRoute>
        }  />
        <Route path="/admin/students/edit/:id" element={
          <ProtectedRoute allowedRoles={["admin"]}>
              <CreateAdminStudentPage />
            </ProtectedRoute>
        }  />
        <Route path="/admin/applications" element={
          <ProtectedRoute allowedRoles={["admin"]}>
              <DashboardAdminApplicationsPage />
            </ProtectedRoute>
        }  />
        <Route path='/admin/createApplication' element={
          <ProtectedRoute allowedRoles={["admin"]}>
              <CreateAdminApplicationPage />
            </ProtectedRoute>
        }  />
        <Route path="/admin/applications/edit/:id" element={
          <ProtectedRoute allowedRoles={["admin"]}>
              <CreateAdminApplicationPage />
            </ProtectedRoute>
        }  />
      </Routes>
    </div>
  )
}

export default App
