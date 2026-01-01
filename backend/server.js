const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT;
const cors = require('cors');
const connectToDatabase = require('./Config/ConnectToDatabase');
const UserRoutes = require('./Routes/UserRoutes');
const StudentRoutes = require('./Routes/StudentRoutes');
const ApplicationRoutes = require('./Routes/ApplicationRoutes');
const InternshipRoutes = require('./Routes/InternshipRoutes');
const CompanyRoutes = require('./Routes/CompanyRoutes');
const IARoutes = require('./Routes/IARoutes');
const path = require('path');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectToDatabase();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use('/api/users',UserRoutes);
app.use('/api/students', StudentRoutes);
app.use('/api/companies',CompanyRoutes);
app.use('/api/internships',InternshipRoutes);
app.use('/api/applications',ApplicationRoutes);
app.use('/api/ia', IARoutes);
app.use('/Uploads', express.static(path.join(__dirname, 'Uploads')));

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});