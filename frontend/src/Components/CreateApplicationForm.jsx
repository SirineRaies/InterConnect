import React, { useState, useEffect } from "react";
import api from '../Api/AxiosConfig';
import "../styles/CreateApplicationForm.css";

const CreateApplicationForm = ({ internshipId, internshipTitle, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [cvFile, setCvFile] = useState(null);
  const [userData, setUserData] = useState(null);
  
  useEffect(() => {
    const storedUser = localStorage.getItem("user");    
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        console.log("User data from localStorage:", user); // Debug
        setUserData(user);
        
      } catch (err) {
        console.error("Erreur lors de la lecture des données utilisateur:", err);
        setError("Format des données utilisateur invalide");
      }
    } else {
      setError("Veuillez vous connecter pour postuler");
    }
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    userId: ""
  });

  useEffect(() => {
    if (userData) {
      console.log("Mise à jour formData avec userData:", userData);
      
      // Basé sur votre log, l'utilisateur a: {id: '...', role: 'student', token: '...', name: 'exemple'}
      // Note: pas d'email dans votre objet user!
      const userName = userData.name || "";
      const userEmail = userData.email || ""; // Ce sera vide car pas d'email dans votre objet
      const userId = userData.id || userData._id || ""; // Votre log montre 'id' pas '_id'
            
      console.log("Valeurs extraites:", { userName, userEmail, userId });
      
      setFormData(prev => ({
        ...prev,
        name: userName,
        email: userEmail,
        userId: userId
      }));
    }
  }, [userData]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCvFile(file);
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Debug: Afficher toutes les données
    console.log("Données à envoyer:", {
      name: formData.name,
      email: formData.email,
      userId: formData.userId,
      internshipId: internshipId,
      hasCV: !!cvFile
    });

    if (!cvFile) {
      setError("Veuillez sélectionner votre CV");
      setLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('userId', formData.userId);
      formDataToSend.append('internshipId', internshipId);
      formDataToSend.append('cv', cvFile);

      // Debug: Vérifier le FormData
      console.log("FormData créé. Contenu:");
      for (let [key, value] of formDataToSend.entries()) {
        console.log(`${key}:`, value);
      }

      const response = await api.post("/applications", formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log("Réponse du serveur:", response.data);
      setSuccess(true);
      setTimeout(() => {
        if (onClose) onClose();
      }, 3000);
    } catch (err) {
      console.error("Erreur complète:", err);
      console.error("Réponse d'erreur:", err.response?.data);
      
      const errorMessage = err.response?.data?.message ||"Erreur lors de la soumission de la candidature";
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="application-modal-overlay">
      <div className="application-modal">
        <div className="modal-header">
          <h2>Postuler à cette offre</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="internship-info">
          <h3>{internshipTitle}</h3>
          <p className="info-text">
            Soumettez votre candidature pour ce stage. Votre CV sera analysé
            et vous serez contacté par email.
          </p>
        </div>

        {success ? (
          <div className="success-message">
            <div className="success-icon">✓</div>
            <h3>Candidature envoyée avec succès !</h3>
            <p>Nous avons bien reçu votre candidature. Vous serez contacté par email.</p>
            <div className="success-actions">
              <button className="close-success-btn" onClick={onClose}>
                Fermer
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="application-form">
            <div className="form-group">
              <label htmlFor="name">Nom et prénom <span className="required">*</span></label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Votre nom complet"
                required
                className="form-input"
              />
              {!formData.name && (
                <p className="form-warning">
                  ⚠️ Veuillez saisir votre nom
                </p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email">Adresse email <span className="required">*</span></label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="votre@email.com"
                required
                className="form-input"
              />
              {!formData.email && (
                <p className="form-warning">
                  ⚠️ Veuillez saisir votre email
                </p>
              )}
            </div>

            <input
              type="hidden"
              id="userId"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
            />

            <div className="form-group">
              <label htmlFor="cv">Votre CV (PDF uniquement) <span className="required">*</span></label>
              
              <div className="file-upload-area">
                <input
                  type="file"
                  id="cv"
                  name="cv"
                  onChange={handleFileChange}
                  accept=".pdf,application/pdf"
                  required
                  className="file-input"
                />
                
                <div className="upload-placeholder">
                  {cvFile ? (
                    <div className="file-info">
                      <div className="file-icon">📄</div>
                      <div className="file-details">
                        <strong>{cvFile.name}</strong>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="upload-icon">📎</div>
                      <div className="upload-text">
                        <p>Cliquez pour sélectionner votre CV</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {error && (
              <div className="error-message">
                ⚠️ {error}
              </div>
            )}

            <div className="form-notes">
              <div className="note-item">
                <span className="note-icon">ℹ️</span>
                <p>Tous les champs sont obligatoires.</p>
              </div>
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                className="cancel-btn"
                onClick={onClose}
                disabled={loading}
              >
                Annuler
              </button>
              <button 
                type="submit" 
                className="submit-btn"
                disabled={loading || !cvFile}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Envoi en cours...
                  </>
                ) : (
                  "Soumettre ma candidature"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CreateApplicationForm;