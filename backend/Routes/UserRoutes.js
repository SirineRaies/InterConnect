const routes = require('express').Router();
const {RegisterUser, LoginUser, UpdateUser, GetUserById, GetAllUsers, getCompanyByUser} = require('../Controllers/UserController');
const {protect , authorizeRole} = require('../Middlewares/AuthMiddleware');
const User = require('../Models/User');

routes.post('/register', RegisterUser);
routes.post('/login', LoginUser);
routes.patch('/:idUser', protect, authorizeRole('student','company','admin'), UpdateUser);
routes.get('/:idUser', protect, authorizeRole('student','company','admin'), GetUserById);
routes.get('/', protect, authorizeRole('admin'), GetAllUsers);
routes.delete('/:idUser', protect, authorizeRole('admin'), async (req, res) => {
    const {idUser} = req.params;

    try {
        const deletedUser = await User.findByIdAndDelete(idUser);
            if (!deletedUser) {
                return res.status(404).json({ message: 'Utilisateur non trouvé' });
            }
            res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erreur du serveur' });
        }
    });

routes.get('/company/user/:userId', protect, authorizeRole('company','admin'),getCompanyByUser);

module.exports = routes;