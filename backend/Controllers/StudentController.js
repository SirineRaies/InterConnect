const Student = require('../Models/Student');
const User = require('../Models/User');

// Créer un étudiant
const CreateStudent = async (req, res) => {
    const {userId, niveau, specialite, skills, cvUrl} = req.body;

    if(!userId || !niveau ) {
        return res.status(400).json({message: 'Veuillez remplir tous les champs!'});
    }

    try {
        const existingStudent = await Student.findOne({userId});
        if(existingStudent) {
            return res.status(400).json({message: 'Ce profil étudiant existe déjà'});
        }

        const newStudent = new Student({
            userId,
            niveau,
            specialite,
            skills: skills || [],
            cvUrl: cvUrl || ''
        });

        await newStudent.save();
        res.status(201).json({message: 'Étudiant créé avec succès', newStudent});
    } catch (error) {
        res.status(500).json({message: 'Erreur du serveur'});
    }
}

// Mettre à jour un étudiant
const UpdateStudent = async (req, res) => {
    const {idStudent} = req.params;
    const updates = req.body;

    try {
        const updatedStudent = await Student.findByIdAndUpdate(idStudent, updates, {new: true});
        if(!updatedStudent) {
            return res.status(404).json({message: 'Étudiant non trouvé'});
        }
        res.status(200).json({message: 'Étudiant mis à jour avec succès', updatedStudent});
    } catch (error) {
        res.status(500).json({message: 'Erreur du serveur'});
    }
}

const DeleteStudent = async (req, res) => {
    const { idStudent } = req.params;

    try {
        const student = await Student.findById(idStudent);
        if (!student) {
            return res.status(404).json({ message: 'Étudiant non trouvé' });
        }

        await User.findByIdAndDelete(student.userId);

        await Student.findByIdAndDelete(idStudent);

        res.status(200).json({ message: 'Étudiant et utilisateur supprimés avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur du serveur' });
    }
}


const GetStudentById = async (req, res) => {
    const { idStudent } = req.params;

    try {
        const student = await Student.findById(idStudent)
            .populate('userId', 'name email role profileCompleted createdAt');

        if (!student) {
            return res.status(404).json({ message: 'Étudiant non trouvé' });
        }

        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({ message: 'Erreur du serveur' });
    }
};


const GetAllStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .populate({
        path: "userId",
        match: { role: "student" },
        select: "name email role profileCompleted createdAt"
      });

    const filteredStudents = students.filter(s => s.userId);

    res.status(200).json(filteredStudents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur du serveur" });
  }
};


module.exports = {
    CreateStudent,
    UpdateStudent,
    DeleteStudent,
    GetStudentById,
    GetAllStudents
};
