const dotenv = require('dotenv');
dotenv.config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs').promises;
const path = require('path');
const Application = require('../Models/Application');
const Internship = require('../Models/Internship');
const pdfParse = require('pdf-parse');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


const extractTextFromPDF = async (pdfPath) => {
    try {
        const dataBuffer = await fs.readFile(pdfPath);
        const data = await pdfParse(dataBuffer);
        return data.text;
    } catch (error) {
        console.error("Erreur extraction PDF:", error);
        throw new Error("Impossible d'extraire le texte du CV");
    }
};


const calculateMatchingScore = async (cvText, internshipDetails) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `Tu es un expert en recrutement. Analyse la correspondance entre ce CV et cette offre de stage.
            **CV du candidat:**${cvText}
            **Offre de stage:**
                - Titre: ${internshipDetails.title || 'N/A'}
                - Description: ${internshipDetails.description || 'N/A'}
                - Compétences requises: ${internshipDetails.requiredSkills?.join(', ') || 'N/A'}
                - Niveau d'études: ${internshipDetails.educationLevel || 'N/A'}
                - Durée: ${internshipDetails.duration || 'N/A'}
            **Instructions:**
                Évalue la correspondance entre le CV et l'offre sur une échelle de 0 à 100.
                Critères d'évaluation:
                    - Compétences techniques (30%) 
                    - Expérience pertinente (25%)
                    - Formation académique (20%)
                    - Motivation apparente (15%)
                    - Adéquation globale (10%)
            Réponds UNIQUEMENT avec un nombre entier entre 0 et 100, sans aucun autre texte, explication ou formatage.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text().trim();

        // Extraire uniquement le nombre
        const scoreMatch = text.match(/\d+/);
        if (!scoreMatch) {
            throw new Error('Aucun score numérique trouvé dans la réponse');
        }

        const score = parseInt(scoreMatch[0]);

        if (isNaN(score) || score < 0 || score > 100) {
            throw new Error('Score invalide retourné par Gemini');
        }

        return score;
    } catch (error) {
        console.error("Erreur calcul matching:", error);
        throw new Error("Erreur lors de l'analyse du CV avec Gemini");
    }
};

const matchApplicationWithOffer = async (req, res) => {
    const { applicationId } = req.params;

    try {
        const application = await Application.findById(applicationId)
            .populate('internshipId');

        if (!application) {
            return res.status(404).json({
                message: 'Candidature introuvable'
            });
        }

        if (!application.cvUrl) {
            return res.status(400).json({
                message: 'Aucun CV associé à cette candidature'
            });
        }

        // Vérifier si le matching a déjà été effectué
        if (application.scoreIA !== null && application.scoreIA !== undefined) {
            return res.status(200).json({
                message: 'Matching déjà effectué',
                scoreIA: application.scoreIA
            });
        }

        const cvPath = path.join(__dirname, '..', application.cvUrl);

        try {
            await fs.access(cvPath);
        } catch {
            return res.status(404).json({
                message: 'Fichier CV introuvable sur le serveur'
            });
        }

        // Extraire le texte du CV
        const cvText = await extractTextFromPDF(cvPath);

        if (!cvText || cvText.trim().length < 50) {
            return res.status(400).json({
                message: 'Le CV ne contient pas assez de texte exploitable'
            });
        }

        // Préparer les détails de l'offre
        const internshipDetails = {
            title: application.internshipId.title,
            description: application.internshipId.description,
            skills: application.internshipId.requiredSkills,
            educationLevel: application.internshipId.educationLevel,
            duration: application.internshipId.duration
        };

        // Calculer le score avec Gemini
        const score = await calculateMatchingScore(cvText, internshipDetails);

        // Mettre à jour la candidature
        application.scoreIA = score;
        await application.save();

        res.status(200).json({
            message: 'Matching effectué avec succès',
            scoreIA: score
        });

    } catch (error) {
        console.error("Erreur matching:", error);
        res.status(500).json({
            message: 'Erreur lors du matching',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * Controller pour déclencher le matching automatiquement après création
 */
const autoMatchApplication = async (applicationId) => {
    try {
        const application = await Application.findById(applicationId)
            .populate('internshipId');

        if (!application || !application.cvUrl) {
            return;
        }

        const cvPath = path.join(__dirname, '..', application.cvUrl);
        const cvText = await extractTextFromPDF(cvPath);

        const internshipDetails = {
            title: application.internshipId.title,
            description: application.internshipId.description,
            skills: application.internshipId.skills,
            educationLevel: application.internshipId.educationLevel,
            duration: application.internshipId.duration
        };

        const score = await calculateMatchingScore(cvText, internshipDetails);

        application.scoreIA = score;
        await application.save();

        console.log(`Matching automatique effectué pour la candidature ${applicationId}: ${score}%`);
    } catch (error) {
        console.error("Erreur auto-matching:", error);
    }
};

module.exports = {
    matchApplicationWithOffer,
    autoMatchApplication,
    calculateMatchingScore
};