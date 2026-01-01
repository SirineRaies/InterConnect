import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from '../Api/AxiosConfig';
import "../styles/OffreList.css";
import CreateApplicationForm from "./CreateApplicationForm.jsx";

const OffresListSection = () => {
  const { idCompany } = useParams();
  const [companyName, setCompanyName] = useState("");
  const [companyLogo, setCompanyLogo] = useState("");
  const [companyDescription, setCompanyDescription] = useState("");
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInternship, setSelectedInternship] = useState(null);

  useEffect(() => {
    const fetchCompanyInternships = async () => {
      try {
        const internshipsRes = await api.get(`/internships/company/${idCompany}`);
        const internships = internshipsRes.data;

        const companyRes = await api.get(`/companies/${idCompany}`);
        const company = companyRes.data;

        setCompanyName(company.idUser?.name || "Entreprise");
        setCompanyLogo(company.logo || "/default.png");
        setCompanyDescription(company.description || "");

        const formattedOffers = internships.map((internship) => ({
          id: internship._id || Math.random(),
          title: internship.title || "Titre non précisé",
          description: internship.description || "",
          requiredSkills: internship.requiredSkills || [],
          supervisor: internship.supervisor || "",
          startDate: internship.startDate || null,
          endDate: internship.endDate || null,
        }));

        setOffers(formattedOffers);
      } catch (error) {
        console.error("Erreur lors du chargement des stages", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyInternships();
  }, [idCompany]);

  if (loading) {
    return (
      <div className="offres-section">
        <p className="loading-text">Chargement des offres...</p>
      </div>
    );
  }

  return (
    <section className="offres-section">
      <div className="offres-header">
        <div>
          <h1>
            Offres de <span>{companyName}</span>
          </h1>
          <p>
            Découvrez toutes les opportunités de stage proposées par cette entreprise.
          </p>
        </div>

        <div className="offres-info">
          <span className="badge">
            <span>📋 {offers.length} Offres disponibles</span>
          </span>
        </div>
      </div>

      <div className="company-profile">
        <div className="company-logo-container">
          <img
            src={companyLogo.startsWith('http') ? companyLogo : `http://localhost:5000/uploads/${companyLogo}`} 
            alt={`Logo ${companyName}`}
            className="company-profile-logo"
          />
          <h2>{companyName}</h2>
        </div>
        {companyDescription && (
          <div className="company-description">
            <h3>À propos de l'entreprise</h3>
            <p>{companyDescription}</p>
          </div>
        )}
      </div>

      <div className="offres-grid">
        {offers.length === 0 ? (
          <div className="no-offers">
            <p>Aucune offre disponible pour cette entreprise actuellement.</p>
          </div>
        ) : (
          offers.map((offer) => (
            <div 
              key={offer.id} 
              className="offre-card"
              style={{ borderLeftColor: "#5b7cfa" }}
            >
              <div className="card-content">
                <h3>{offer.title}</h3>
                
                {offer.description && (
                  <p className="offer-description">
                    {offer.description.length > 150 
                      ? `${offer.description.substring(0, 150)}...` 
                      : offer.description}
                  </p>
                )}
                
                <div className="offer-details">
                  {offer.requiredSkills.length > 0 && (
                    <div className="detail-item">
                      <span className="detail-label">🛠️ Compétences:</span>
                      <div className="skills-container">
                        {offer.requiredSkills.slice(0, 3).map((skill, idx) => (
                          <span key={idx} className="skill-tag">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {offer.supervisor && (
                    <div className="detail-item">
                      <span className="detail-label">👨‍🏫 Encadrant:</span>
                      <span>{offer.supervisor}</span>
                    </div>
                  )}
                  
                  {(offer.startDate || offer.endDate) && (
                    <div className="detail-item">
                      <span className="detail-label">📅 Période:</span>
                      <span>
                        {offer.startDate ? new Date(offer.startDate).toLocaleDateString("fr-FR") : "Non spécifiée"}
                        {" → "}
                        {offer.endDate ? new Date(offer.endDate).toLocaleDateString("fr-FR") : "Non spécifiée"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="card-actions">
                <button className="apply-button" onClick={() => setSelectedInternship(offer)}>
                  Postuler
                </button>
              </div>
            </div>
          ))
        )}
      </div>
       {selectedInternship && (
        <CreateApplicationForm
          internshipId={selectedInternship.id}
          internshipTitle={selectedInternship.title}
          onClose={() => setSelectedInternship(null)}
        />
      )}
    </section>
  );
};

export default OffresListSection;