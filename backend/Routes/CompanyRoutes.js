const routes = require('express').Router();

const {CreateCompany, UpdateCompany, DeleteCompany, GetCompanyById, GetAllCompanies, upload, GetImageUrl} = require('../Controllers/CompanyController');
const { protect, authorizeRole } = require('../Middlewares/AuthMiddleware');

routes.post('/', protect, authorizeRole('company','admin'),upload.single("image"), CreateCompany);
routes.patch('/:idCompany', protect, authorizeRole('company','admin'),upload.single("image"), UpdateCompany);
routes.delete('/:idCompany', protect, authorizeRole('admin'), DeleteCompany);
routes.get('/:idCompany', protect, authorizeRole('company','student','admin'), GetCompanyById);
routes.get('/', protect, authorizeRole('admin','student'), GetAllCompanies);
routes.get('/image/:filename', protect, authorizeRole('company','student','admin'), GetImageUrl);
module.exports = routes;