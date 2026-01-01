const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");

const Company = require("./Models/Company");
const Student = require("./Models/Student");
const Internship = require("./Models/Internship");
const Application = require("./Models/Application");
const User = require("./Models/User");

require('dotenv').config();

// Connexion MongoDB
mongoose.connect(process.env.MONGODB_DATABASE_URI);

async function seed() {
  await mongoose.connection.dropDatabase();

  // 1️⃣ Users
  const companyUsers = [];
  for (let i = 0; i < 10; i++) {
    const user = new User({
      name: faker.company.name(),
      email: faker.internet.email(),
      password: "password123",
      role: "company",
      profileCompleted: true,
    });
    companyUsers.push(await user.save());
  }

  const studentUsers = [];
  for (let i = 0; i < 50; i++) {
    const user = new User({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: "password123",
      role: "student",
      profileCompleted: true,
    });
    studentUsers.push(await user.save());
  }

  // 2️⃣ Companies
  const companies = [];
  const secteurs = ["Informatique", "Finance", "Marketing", "Industrie"];
  for (let i = 0; i < companyUsers.length; i++) {
    const company = new Company({
      idUser: companyUsers[i]._id,
      secteur: secteurs[Math.floor(Math.random() * secteurs.length)],
      description: faker.company.catchPhrase(),
      image: "",
    });
    companies.push(await company.save());
  }

  // 3️⃣ Students
  const students = [];
  const niveaux = ["Licence", "Master", "Ingénieur"];
  const specialites = ["Informatique", "Finance", "Marketing", "Industrie"];
  for (let i = 0; i < studentUsers.length; i++) {
    const student = new Student({
      userId: studentUsers[i]._id,
      niveau: niveaux[Math.floor(Math.random() * niveaux.length)],
      specialite: specialites[Math.floor(Math.random() * specialites.length)],
      skills: [faker.hacker.verb(), faker.hacker.noun()],
      cvUrl: faker.internet.url(),
    });
    students.push(await student.save());
  }

  // 4️⃣ Internships et Applications
  const statuses = ["En attente", "Accepté", "Refusé"];
  for (let i = 0; i < companies.length; i++) {
    const nbInternships = Math.floor(Math.random() * 5) + 2; // 2 à 6 stages par company
    for (let j = 0; j < nbInternships; j++) {
     const internship = new Internship({
  companyId: companies[i]._id,
  title: faker.person.jobTitle(),
  type: faker.helpers.arrayElement([
    "Stage technique", "Stage marketing", "Stage financier",
    "Stage en développement", "Stage en data", "Stage en IA",
    "Stage en cybersécurité", "Stage en réseaux", "Stage en cloud",
    "Stage PFE"
  ]),
  startDate: faker.date.future({ years: 1 }), // date de début aléatoire
  supervisor: faker.person.fullName(),        // nom du superviseur
  description: faker.lorem.paragraph(),       // description de l'offre
});

      const savedInternship = await internship.save();

      // Générer des candidatures pour ce stage
      const nbApplications = Math.floor(Math.random() * 5) + 3; // 3 à 7 candidatures
      for (let k = 0; k < nbApplications; k++) {
        const student = students[Math.floor(Math.random() * students.length)];
        const studentUser = studentUsers.find(u => u._id.equals(student.userId));

        await new Application({
          userId: student.userId,
          name: studentUser.name,
          email: studentUser.email,
          internshipId: savedInternship._id,
          cvUrl: student.cvUrl,
          scoreIA: Math.floor(Math.random() * 101),
          status: faker.helpers.arrayElement(statuses),
        }).save();
      }
    }
  }

  console.log("Données générées avec succès !");
  mongoose.disconnect();
}

seed();
