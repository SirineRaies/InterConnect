import "../styles/HeroSection.css";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <div>
    <section className="hero">
      {/* Cercles animés */}
        <span className="circle circle-blue"></span>
        <span className="circle circle-pink"></span>
        <span className="circle circle-light"></span>
        <span className="circle circle-purple"></span>
        <span className="circle circle-teal"></span>
        <span className="circle circle-coral"></span>
        <span className="circle circle-yellow"></span>
        <span className="circle circle-lavender"></span>

      <div className="hero-content">
        <h1>
          Un seul endroit pour tous les <br />
          <span className="gradient-text">PFE Books</span>
        </h1>

        <p>
          Découvrez les PFE Book 2026 proposés par différentes entreprises.
          <br />
          Trouvez le Stage idéal pour vous.
        </p>

        <button onClick={() => navigate("/companiesList")} className="cta-btn">
          Catalogue PFE →
        </button>
      </div>
    </section>
    </div>
  );
};

export default HeroSection;
