import AdminStudentsManagement from "../../Components/DashboardAdmin/AdminStudentsManagement.jsx";
import SidebarDashboardAdmin from "../../Components/DashboardAdmin/SidebarDashboardAdmin.jsx";

export default function DashboardAdminStudentsPage() {
  return (
    <>
      <SidebarDashboardAdmin/>
      <AdminStudentsManagement/>
    </>
  );
}
