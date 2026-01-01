import "../styles/Navbar.css";
import Logo from "./Logo";

const Navbar = () => {

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-left">
        <a href="/"><Logo /></a>
      </div>

      {/* Liens */}
      <ul className="navbar-center">
        <li><a href="/companiesList">Catalogue PFE Book</a></li>
        <li>À propos</li>
        <li>Contact</li>
      </ul>

    </nav>
  );
};

export default Navbar;
