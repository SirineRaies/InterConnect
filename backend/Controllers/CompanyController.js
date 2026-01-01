const Company = require('../Models/Company');
const multer = require("multer");
const path = require("path");


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Uploads/Companies"); 
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `company-${Date.now()}${ext}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });

const CreateCompany = async (req, res) => {
  const { userId, secteur, description } = req.body;

  if (!userId || !secteur) {
    return res.status(400).json({
      message: "Veuillez remplir tous les champs obligatoires!",
    });
  }

  try {
    const existingCompany = await Company.findOne({ idUser: userId });
    if (existingCompany) {
      return res.status(400).json({
        message: "Cette entreprise existe déjà",
      });
    }

    const imagePath = req.file
      ? `/Uploads/companies/${req.file.filename}`
      : "";

    const newCompany = new Company({
      idUser: userId,
      secteur,
      description: description || "",
      image: imagePath,
    });

    await newCompany.save();

    res.status(201).json({
      message: "Entreprise créée avec succès",
      newCompany,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erreur du serveur",
    });
  }
};


const UpdateCompany = async (req, res) => {
  const { idCompany } = req.params;

  try {
    const updateData = {
      ...req.body,
    };

    if (req.file) {
      updateData.image = `/Uploads/companies/${req.file.filename}`;
    }

    const updatedCompany = await Company.findByIdAndUpdate(
      idCompany,
      updateData,
      { new: true }
    ).populate("idUser", "name email role profileCompleted");

    if (!updatedCompany) {
      return res.status(404).json({
        message: "Entreprise non trouvée",
      });
    }

    res.status(200).json({
      message: "Entreprise mise à jour avec succès",
      updatedCompany,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erreur du serveur",
    });
  }
};

const GetImageUrl = (req) => {
    if (req.file) {
      return `/Uploads/companies/${req.file.filename}`;
    }
    return null;
}

// Supprimer une entreprise
const mongoose = require("mongoose");

const DeleteCompany = async (req, res) => {
  const { idCompany } = req.params;

  try {
    const company = await Company.findById(idCompany);
    if (!company) {
      return res.status(404).json({ message: "Entreprise non trouvée" });
    }

    if (company.userId && mongoose.Types.ObjectId.isValid(company.userId)) {
      await User.findByIdAndDelete(company.userId);
    }

    await Company.findByIdAndDelete(idCompany);

    res.status(200).json({ message: "Entreprise supprimée avec succès" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur du serveur" });
  }
};


const GetCompanyById = async (req, res) => {
    const { idCompany } = req.params;

    try {
        const company = await Company.findById(idCompany)
            .populate("idUser", "name email role profileCompleted createdAt");

        if (!company) {
            return res.status(404).json({ message: "Entreprise non trouvée" });
        }

        res.status(200).json(company);
    } catch (error) {
        res.status(500).json({ message: "Erreur du serveur" });
    }
};


const GetAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find()
      .populate({
        path: "idUser",
        match: { role: "company" },
        select: "name email role profileCompleted createdAt"
      });

    const filteredCompanies = companies.filter(c => c.idUser);

    res.status(200).json(filteredCompanies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur du serveur" });
  }
};




module.exports = {
    CreateCompany,
    UpdateCompany,
    DeleteCompany,
    GetCompanyById,
    GetAllCompanies,
    upload,
    GetImageUrl
};
