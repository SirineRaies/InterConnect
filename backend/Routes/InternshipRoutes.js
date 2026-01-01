const routes = require('express').Router();
const {
    CreateInternship,
    UpdateInternship,
    DeleteInternship,
    GetInternshipById,
    GetAllInternships,
    GetAllInternshipsByCompany
} = require('../Controllers/InternshipController');

const { protect, authorizeRole } = require('../Middlewares/AuthMiddleware');

routes.post('/', protect, authorizeRole('company', 'admin'), CreateInternship);
routes.patch('/:idInternship', protect, authorizeRole('company', 'admin'), UpdateInternship);
routes.delete('/:idInternship', protect, authorizeRole('company', 'admin'), DeleteInternship);

routes.get('/:idInternship', protect, authorizeRole('student', 'company', 'admin'), GetInternshipById);
routes.get('/', protect, authorizeRole('student', 'company', 'admin'), GetAllInternships);

routes.get('/company/:idCompany', protect, authorizeRole('company', 'admin', 'student'), GetAllInternshipsByCompany);

module.exports = routes;
