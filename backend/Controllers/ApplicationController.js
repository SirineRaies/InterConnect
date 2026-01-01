const Application = require('../Models/Application');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { autoMatchApplication } = require('../Controllers/IAController');
const nodemailer = require('nodemailer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const fs = require('fs');
        const uploadDir = 'Uploads/cv/';
        
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Seuls les fichiers PDF sont acceptés'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
});

const CreateApplication = async (req, res) => {
    const { userId, name, email, internshipId } = req.body;
    const cvUrl = req.file ? `/Uploads/cv/${req.file.filename}` : null;

    if (!userId || !internshipId || !name || !email || !cvUrl) {
        // Supprimer le fichier uploadé si validation échoue
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error("Erreur suppression fichier:", err);
            });
        }
        
        return res.status(400).json({
            message: 'Veuillez remplir tous les champs obligatoires !' 
        });
    }

    try {
        // Vérifier si l'utilisateur a déjà postulé à cette offre
        const existingApplication = await Application.findOne({
            userId,
            internshipId
        });

        if (existingApplication) {
            // Supprimer le fichier uploadé
            if (req.file) {
                fs.unlink(req.file.path, (err) => {
                    if (err) console.error("Erreur suppression fichier:", err);
                });
            }
            
            return res.status(400).json({
                message: 'Vous avez déjà postulé à cette offre'
            });
        }

        const newApplication = new Application({
            userId,
            name,
            email,
            internshipId,
            status: 'En attente',
            scoreIA: null,
            cvUrl: cvUrl
        });

        await newApplication.save();
        
        autoMatchApplication(newApplication._id).catch(err => {
        console.error("Erreur matching automatique:", err);
    });
    
        res.status(201).json({ 
            message: 'Candidature créée avec succès', 
            application: newApplication 
        });
    } catch (error) {
        // Supprimer le fichier uploadé en cas d'erreur
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error("Erreur suppression fichier:", err);
            });
        }
        
        console.error("Erreur création candidature:", error);
        res.status(500).json({
            message: 'Erreur du serveur',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
const UpdateApplication = async (req, res) => {
    const { idApplication } = req.params;
    const updates = req.body;

    try {
        const updatedApplication = await Application.findByIdAndUpdate(idApplication, updates, { new: true })
            .populate('userId', 'name email profileCompleted')
            .populate('internshipId', 'title');

        if (!updatedApplication) return res.status(404).json({ message: 'Candidature non trouvée' });

        res.status(200).json({ message: 'Candidature mise à jour avec succès', updatedApplication });
    } catch (error) {
        res.status(500).json({ message: 'Erreur du serveur' });
    }
};

const DeleteApplication = async (req, res) => {
    const { idApplication } = req.params;

    try {
        const deletedApplication = await Application.findByIdAndDelete(idApplication);
        if (!deletedApplication) return res.status(404).json({ message: 'Candidature non trouvée' });

        res.status(200).json({ message: 'Candidature supprimée avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur du serveur' });
    }
};

const GetAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("userId", "name email")
      .populate("internshipId", "title")
      .sort({ createdAt: -1 });

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: "Erreur du serveur" });
  }
};

const GetApplicationById = async (req, res) => {
    const {idApplication} = req.params;

    try {
        const application = await Application.findById(idApplication);
        if(!application) {
            return res.status(404).json({message: 'Candidature non trouvée'});
        }
        res.status(200).json(application);
    } catch (error) {
        res.status(500).json({message: 'Erreur du serveur'});
    }
}

const GetApplicationsByCompany = async (req, res) => {
    const { idCompany } = req.params;

    try {
        const applications = await Application.find()
            .populate({
                path: 'internshipId',
                match: { companyId: idCompany },
                select: 'title companyId'
            })
            .populate('userId', 'name email niveau specialite skills');

        const filteredApplications = applications.filter(
            app => app.internshipId !== null
        );

        res.status(200).json({
            success: true,
            count: filteredApplications.length,
            data: filteredApplications
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des applications:', error);
        res.status(500).json({ 
            success: false,
            message: 'Erreur lors de la récupération des applications',
            error: error.message
        });
    }
};

const GetAllApplicationsByStudent = async (req, res) => {
  const { idStudent } = req.params;

  try {
    const applications = await Application.find({ userId: idStudent })
      .populate("internshipId", "title")
      .sort({ createdAt: -1 });

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: "Erreur du serveur" });
  }
};

const GetAllApplicationsByInternship = async (req, res) => {
    const {idInternship} = req.params;

    try {
        const applications = await Application.find({internshipId: idInternship});
        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({message: 'Erreur du serveur'});
    }
}

const AcceptApplication = async(req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ message: "Veuillez saisir votre adresse mail" });
        }
        
        const application = await Application.findOne({ email });
        
        if (!application) {
            return res.status(404).json({ message: "Ce compte Gmail ne correspond à aucune candidature" });
        }
        
        // Mettre à jour le statut de l'application
        application.status = 'Accepté';
        await application.save();
        
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
        });
        
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: "Votre candidature a été acceptée !",
            html: `Cher Candidat,
            <br/><br/>Nous avons le plaisir de vous informer que votre demande candidature a été acceptée avec succès. Félicitations pour cette étape importante dans votre parcours professionnel !
            <br/><br/>Nous vous invitons à vous connecter à votre compte sur notre plateforme pour consulter les détails de votre candidature acceptée et les prochaines étapes à suivre.
            <br/><br/>Merci de votre confiance et de votre soutien.
            <br/>Cordialement,`,
        };
        
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: "Erreur d'envoi de mail", error: error.message });
            } else {
                return res.status(200).json({ 
                    message: "Mail envoyé avec succès",
                    info: info.messageId 
                });
            }
        });
        
    } catch (error) {
        console.error("Erreur dans AcceptApplication:", error);
        return res.status(500).json({ message: "Erreur du serveur", error: error.message });
    }
};

const RefuseApplication = async(req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ message: "Veuillez saisir votre adresse mail" });
        }
        
        const application = await Application.findOne({ email });
        
        if (!application) {
            return res.status(404).json({ message: "Ce compte Gmail ne correspond à aucune candidature" });
        }
        
        // Mettre à jour le statut de l'application
        application.status = 'Refusé';
        await application.save();
        
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
        });
        
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: "Votre candidature a été refusée",
            html: `Cher Candidat,
            <br/><br/>Nous regrettons de vous informer que votre demande candidature a été refusée. Nous comprenons que cette nouvelle puisse être décevante, mais nous tenons à vous remercier pour l'intérêt que vous avez porté à notre organisation.
            <br/><br/>Nous vous encourageons à continuer à postuler à d'autres opportunités qui correspondent à vos compétences et à vos aspirations professionnelles.
            <br/><br/>Merci de votre compréhension.
            <br/>Cordialement,`,
        };
        
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: "Erreur d'envoi de mail", error: error.message });
            } else {
                return res.status(200).json({ 
                    message: "Mail envoyé avec succès",
                    info: info.messageId 
                });
            }
        });
        
    } catch (error) {
        console.error("Erreur dans RefuseApplication:", error);
        return res.status(500).json({ message: "Erreur du serveur", error: error.message });
    }
};

module.exports = {
    CreateApplication,
    UpdateApplication,
    DeleteApplication,
    GetApplicationById,
    GetAllApplications,
    GetAllApplicationsByStudent,
    GetAllApplicationsByInternship,
    upload,
    AcceptApplication,
    RefuseApplication,
    GetApplicationsByCompany
};
