const Internship = require('../Models/Internship');

// Créer une offre de stage
const CreateInternship = async (req, res) => {
    const { title, description, requiredSkills, companyId, supervisor, startDate, endDate } = req.body;

    if (!title || !description || !companyId || !supervisor || !startDate) {
        return res.status(400).json({ message: 'Veuillez remplir tous les champs obligatoires !' });
    }

    try {
        const newInternship = new Internship({
            title,
            description,
            requiredSkills: requiredSkills || [],
            companyId,
            supervisor,
            startDate,
            endDate: endDate || null,
        });

        await newInternship.save();
        res.status(201).json({ message: 'Offre de stage créée avec succès', newInternship });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur du serveur' });
    }
};

// Mettre à jour une offre de stage
const UpdateInternship = async (req, res) => {
    const { idInternship } = req.params;
    const updates = req.body;

    try {
        const updatedInternship = await Internship.findByIdAndUpdate(idInternship, updates, { new: true });
        if (!updatedInternship) {
            return res.status(404).json({ message: 'Offre de stage non trouvée' });
        }
        res.status(200).json({ message: 'Offre de stage mise à jour avec succès', updatedInternship });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur du serveur' });
    }
};

// Supprimer une offre de stage
const DeleteInternship = async (req, res) => {
    const { idInternship } = req.params;

    try {
        const deletedInternship = await Internship.findByIdAndDelete(idInternship);
        if (!deletedInternship) {
            return res.status(404).json({ message: 'Offre de stage non trouvée' });
        }
        res.status(200).json({ message: 'Offre de stage supprimée avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur du serveur' });
    }
};

const GetInternshipById = async (req, res) => {
    const { idInternship } = req.params;

    try {
        const internship = await Internship.findById(idInternship)
            .populate('studentsIds', 'userId niveau specialite skills cvUrl'); // infos étudiants
        if (!internship) {
            return res.status(404).json({ message: 'Offre de stage non trouvée' });
        }
        res.status(200).json(internship);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur du serveur' });
    }
};

// Récupérer toutes les offres de stage
const GetAllInternships = async (req, res) => {
    try {
        const internships = await Internship.find();
        res.status(200).json(internships);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur du serveur' });
    }
};

// Récupérer toutes les offres de stage d’une entreprise
const GetAllInternshipsByCompany = async (req, res) => {
    const { idCompany } = req.params;

    try {
        const internships = await Internship.find({ companyId: idCompany })
            .populate('studentsIds', 'userId niveau specialite skills cvUrl');
        res.status(200).json(internships);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur du serveur' });
    }
};

module.exports = {
    CreateInternship,
    UpdateInternship,
    DeleteInternship,
    GetInternshipById,
    GetAllInternships,
    GetAllInternshipsByCompany
};
