const routes = require('express').Router();
const {CreateApplication, UpdateApplication, DeleteApplication, GetApplicationById, GetAllApplications, GetAllApplicationsByStudent, GetAllApplicationsByInternship, upload , AcceptApplication, RefuseApplication, GetApplicationsByCompany} = require('../Controllers/ApplicationController');
const { protect, authorizeRole } = require('../Middlewares/AuthMiddleware');

routes.post('/', protect, authorizeRole('student','admin',"company"),upload.single('cv'), CreateApplication);
routes.patch('/:idApplication', protect, authorizeRole('student','admin',"company"), UpdateApplication);
routes.delete('/:idApplication', protect, authorizeRole('admin','company'), DeleteApplication);
routes.get('/:idApplication', protect, authorizeRole('student','admin',"company"), GetApplicationById);
routes.get('/', protect, authorizeRole('admin'), GetAllApplications);
routes.get('/company/:idCompany', protect, authorizeRole('company'), GetApplicationsByCompany);
routes.get('/student/:idStudent', protect, authorizeRole('student','admin'), GetAllApplicationsByStudent);
routes.get('/internship/:idInternship', protect, authorizeRole('company','admin'), GetAllApplicationsByInternship);
routes.post('/accept/:idApplication', protect, authorizeRole('company'), AcceptApplication);
routes.post('/refuse/:idApplication', protect, authorizeRole('company'), RefuseApplication);

module.exports = routes;