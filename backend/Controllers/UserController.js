const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Models/User');
require('dotenv').config();
const Student = require('../Models/Student');
const Company = require('../Models/Company');

const RegisterUser = async (req, res) => {
    const {name, email, password, role} = req.body;
    if(!name || !email || !password || !role) {
        return res.status(400).json({message: 'Veuillez remplir tous les champs!'});
    }
    try {
        const existingUser = await User.findOne({email});
        if(existingUser) {
            return res.status(400).json({message: 'Cet utilisateur existe déjà'});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({name, email, password: hashedPassword, role});
        await newUser.save();
        
        if(role === "student") {
        const newStudent = new Student({
          userId: newUser._id,
          niveau: "---À compléter",
          specialite: "",
          skills: [],
          cvUrl: ""
        });
        await newStudent.save();
        }

        if(role === "company") {
        const newCompany = new Company({
            idUser: newUser._id,
            secteur: "---À compléter",
            description: ""
        });
        await newCompany.save();
        }

        const token = jwt.sign({id: newUser._id, role: newUser.role}, process.env.JWT_SECRET, {expiresIn: '1h'});

        res.status(201).json({message: 'Utilisateur enregistré avec succès', newUser, token});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Erreur du serveur'});
    }
}

// Login User
const LoginUser = async (req, res) => {
    const {email, password} = req.body;
    if(!email || !password) {
        return res.status(400).json({message: 'Veuillez remplir tous les champs!'});
    }
    try {
        const user = await User.findOne({email});
        if(!user) {
            return res.status(400).json({message: 'Email ou mot de passe incorrect'});
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid) {
            return res.status(400).json({message: 'Email ou mot de passe incorrect'});
        }
        const token = jwt.sign({id: user._id, role: user.role}, process.env.JWT_SECRET, {expiresIn: '1h'});
        res.status(200).json({token, user, message: 'Connexion réussie'});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Erreur du serveur'});
    }
}

// Update User
const UpdateUser = async (req, res) => {
    const {idUser} = req.params;
    const updates = req.body;
    
    try {
        if(updates.password) {
            updates.password = await bcrypt.hash(updates.password, 10);
        }
        const updatedUser = await User.findByIdAndUpdate(idUser, updates, {new: true});
        if(!updatedUser) {
            return res.status(404).json({message: 'Utilisateur non trouvé'});
        }
        res.status(200).json({message: 'Utilisateur mis à jour avec succès', updatedUser});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Erreur du serveur'});
    }
}

// Get User By Id
const GetUserById = async (req, res) => {
    const {idUser} = req.params; 
    
    try {
        const user = await User.findById(idUser).select('-password');
        if(!user) {
            return res.status(404).json({message: 'Utilisateur non trouvé'});
        }
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Erreur du serveur'});
    }
}

// Get All Users
const GetAllUsers = async (req, res) => {
  try {
    const { role } = req.query;

    const filter = role ? { role } : {};

    const users = await User.find(filter).select(
      "name email role profileCompleted createdAt"
    );

    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur du serveur" });
  }
};

const getCompanyByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const company = await Company.findOne({ idUser : userId });

    if (!company) {
      return res.status(404).json({ message: "Entreprise introuvable" });
    }

    res.status(200).json(company);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = {
    RegisterUser,
    LoginUser,
    UpdateUser,
    GetUserById,
    GetAllUsers,
    getCompanyByUser
};