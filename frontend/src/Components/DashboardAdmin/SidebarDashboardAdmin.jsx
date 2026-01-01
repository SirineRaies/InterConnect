import React, { useState, useEffect } from "react";
import "../../styles/sidebarDashboard.css";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import BusinessIcon from '@mui/icons-material/Business';
import SchoolIcon from '@mui/icons-material/School';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LogoutIcon from '@mui/icons-material/Logout';
import { NavLink, useLocation, Link } from "react-router-dom";
import LogoText from '../../Components/LogoText';

const SidebarDashboardAdmin = () => {
  const location = useLocation();
  const [activePage, setActivePage] = useState("");
  const [hoveredItem, setHoveredItem] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("tokenAdmin");
  };

  useEffect(() => {
    setActivePage(location.pathname);
  }, [location]);

  const isPageActive = (path) => {
    return path === activePage ? "active" : "";
  };

  // Menu items mis à jour
  const menuItems = [
    { path: "/DashboardAdmin", icon: <HomeOutlinedIcon />, label: "Dashboard" },
    { path: "/admin/Students", icon: <SchoolIcon />, label: "Étudiants" },
    { path: "/admin/Users", icon: <PeopleOutlinedIcon />, label: "Users" },
    { path: "/admin/Companies", icon: <BusinessIcon />, label: "Companies" },
    { path: "/admin/Internships", icon: <WorkOutlineIcon />, label: "Internships" },
    { path: "/admin/Applications", icon: <AssignmentIcon />, label: "Applications" },
  ];

  return (
    <div className="sidebarDashboard">
      <div className="topDashboardAdmin">
        <Link to="/"><LogoText /></Link>
      </div>

      <div className="centerDashboard">
        <ul className="ul_sidebarDashboard">
          {menuItems.map((item, index) => (
            <li
              key={index}
              className={`Item ${isPageActive(item.path)} ${hoveredItem === index ? 'hovered' : ''}`}
              onMouseEnter={() => setHoveredItem(index)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div className="icon-wrapper">
                {item.icon}
                <span className="icon-glow"></span>
              </div>
              <NavLink
                className={`nom_Dashboard ${isPageActive(item.path) ? 'active' : ''}`}
                to={item.path}
              >
                {item.label}
              </NavLink>
            </li>
          ))}

          <hr className="hrDashboard" />
          
          <div className="bottom_sidebarDashboard">
            <li
              className={`Item ${hoveredItem === 'logout' ? 'hovered' : ''}`}
              onMouseEnter={() => setHoveredItem('logout')}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div className="iconlogout">
                <LogoutIcon />
              </div>
              <NavLink
                onClick={handleLogout}
                className="nom_DashboardDeconnexion"
                to={'/login'}
              >
                Déconnexion
              </NavLink>
              <div className="active-indicator logout"></div>
            </li>
          </div>
        </ul>
      </div>
    </div>
  );
};

export default SidebarDashboardAdmin;
