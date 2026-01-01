import CompaniesManagement from "../../Components/DashboardAdmin/CompaniesManagement.jsx";
import SidebarDashboardAdmin from "../../Components/DashboardAdmin/SidebarDashboardAdmin.jsx";

export default function DashboardCompanyPage() {
  return (
    <>
      <SidebarDashboardAdmin/>
      <CompaniesManagement/>
    </>
  );
}
