import React, { useState, useEffect } from "react";
import "../../styles/SidebarDashboard.css";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import FmdBadIcon from '@mui/icons-material/FmdBad';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { NavLink, useLocation, Link } from "react-router-dom";
import LogoutIcon from '@mui/icons-material/Logout';
import LogoText from '../../Components/LogoText';

const SidebarDashboard = () => {
  const location = useLocation();
  const [activePage, setActivePage] = useState("");
  const [hoveredItem, setHoveredItem] = useState(null);

  const handlelogout = () => {
    localStorage.removeItem("tokenAdmin");
  };

  useEffect(() => {
    setActivePage(location.pathname);
  }, [location]);

  const isPageActive = (path) => {
    return path === activePage ? "active" : "";
  };

  const menuItems = [
    { path: "/DashboardAdmin", icon: <HomeOutlinedIcon />, label: "Dashboard", iconClass: "iconSideBarDashboard" },
    { path: "/company/internships", icon: <PeopleOutlinedIcon />, label: "Offres", iconClass: "iconSideBarDashboardUtilisateurs" },
    { path: "/company/applications", icon: <ListAltIcon />, label: "Applications", iconClass: "iconSideBarDashboardGuides" },
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
                onClick={handlelogout}
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

export default SidebarDashboard;