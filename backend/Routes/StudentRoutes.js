const routes = require('express').Router();

const {CreateStudent, UpdateStudent, DeleteStudent, GetStudentById, GetAllStudents} = require('../Controllers/StudentController');
const {protect , authorizeRole} = require('../Middlewares/AuthMiddleware');

routes.post('/', protect, authorizeRole('student','admin'), CreateStudent);
routes.patch('/:idStudent', protect, authorizeRole('student','admin'), UpdateStudent);
routes.delete('/:idStudent', protect, authorizeRole('admin'), DeleteStudent);
routes.get('/:idStudent', protect, authorizeRole('student','admin'), GetStudentById);
routes.get('/', protect, authorizeRole('admin',"company"), GetAllStudents);

module.exports = routes;