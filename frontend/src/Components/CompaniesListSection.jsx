import "../styles/CompaniesList.css";
import { useEffect, useState } from "react";
import api from '../Api/AxiosConfig';
import logoCompany from '../assets/logoCompany.png';
import { useNavigate } from "react-router-dom";

const CompaniesListSection = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const naviagte = useNavigate();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await api.get("/companies");
        const companiesData = res.data;
        const companiesWithOffers = await Promise.all(
          companiesData.map(async (company) => {
            const internshipsRes = await api.get(`/internships/company/${company._id}`);
            return {
              ...company,
              offersCount: internshipsRes.data.length,
            };
          })
        );

        setCompanies(companiesWithOffers);
      } catch (error) {
        console.error("Erreur lors du chargement des entreprises", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  return (
    <section className="catalogue-section">
      <div className="catalogue-header">
        <div>
          <h1>
            Catalogue des <span>Entreprises</span>
          </h1>
          <p>
            Consultez les entreprises proposant des offres PFE,
            classées par domaine et accessibles en un clic.
          </p>
        </div>

        <div className="catalogue-info">
          <span className="badge">
            <img  src={logoCompany} alt="Companies Icon" className="icon" />
           <span> {companies.length} Entreprises actives</span>
          </span>
        </div>
      </div>

      {/* LISTE */}
      {loading ? (
        <p>Chargement des entreprises...</p>
      ) : (
        <div className="catalogue-grid">
         {companies.map((company) => (
            <div
              key={company._id}
              className="catalogue-card"
              style={{ borderLeftColor: company.themeColor || "#5b7cfa" }}
              onClick={() => naviagte(`/company/${company._id}/offres`)}
            >
              <div className="card-content">
                <h3>{company.idUser?.name}</h3>
                <span className="time">
                  📌 {company.offersCount || 0} offres disponibles
                </span>
              </div>

              <img
                src={`http://localhost:5000${company.image || "default.png"}`}
                alt={company.idUser?.name}
              />
            </div>
          ))}

        </div>
      )}
    </section>
  );
};

export default CompaniesListSection;
