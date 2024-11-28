const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const db = new sqlite3.Database(path.join(__dirname, '../data/talent.db'));

// Initialize database tables and sample data
db.serialize(() => {
  // Create tables
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT,
    role TEXT,
    skills TEXT,
    profilePicture TEXT,
    description TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    description TEXT,
    role TEXT,
    postedDate TEXT
  )`);

  // Check if sample data needs to be inserted
  db.get('SELECT COUNT(*) as count FROM users', [], (err, result) => {
    if (err) {
      console.error('Error checking users count:', err);
      return;
    }

    if (result.count === 0) {
      // Insert sample users
      const sampleUsers = [
        {
          name: 'John Doe',
          email: 'john@example.com',
          password: bcrypt.hashSync('password123', 10),
          role: 'Software Developer',
          skills: 'JavaScript,React,Node.js,TypeScript',
          description: 'Full-stack developer with 5 years of experience in web technologies.',
          profilePicture: '/uploads/default-1.jpg'
        },
        {
          name: 'Jane Smith',
          email: 'jane@example.com',
          password: bcrypt.hashSync('password123', 10),
          role: 'UI/UX Designer',
          skills: 'Figma,Adobe XD,User Research,Prototyping',
          description: 'Creative designer focused on creating intuitive user experiences.',
          profilePicture: '/uploads/default-2.jpg'
        },
        {
          name: 'Mike Johnson',
          email: 'mike@example.com',
          password: bcrypt.hashSync('password123', 10),
          role: 'Data Scientist',
          skills: 'Python,Machine Learning,SQL,Data Visualization',
          description: 'Data scientist specializing in machine learning and predictive analytics.',
          profilePicture: '/uploads/default-3.jpg'
        }
      ];

      sampleUsers.forEach(user => {
        db.run(`INSERT INTO users (name, email, password, role, skills, profilePicture, description) 
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [user.name, user.email, user.password, user.role, user.skills, user.profilePicture, user.description]
        );
      });

      console.log('Sample users inserted');
    }
  });

  // Check if sample jobs need to be inserted
  db.get('SELECT COUNT(*) as count FROM jobs', [], (err, result) => {
    if (err) {
      console.error('Error checking jobs count:', err);
      return;
    }

    if (result.count === 0) {
      // Insert sample jobs
      const sampleJobs = [
        {
          title: 'Senior Frontend Developer',
          description: 'Looking for an experienced frontend developer with React expertise and strong TypeScript skills.',
          role: 'Software Developer',
          postedDate: new Date().toISOString()
        },
        {
          title: 'UX Designer',
          description: 'Seeking a talented UX designer to join our product team. Experience with Figma and user research required.',
          role: 'UI/UX Designer',
          postedDate: new Date().toISOString()
        },
        {
          title: 'Machine Learning Engineer',
          description: 'Join our AI team to develop cutting-edge machine learning solutions. Python and TensorFlow experience required.',
          role: 'Data Scientist',
          postedDate: new Date().toISOString()
        }
      ];

      sampleJobs.forEach(job => {
        db.run(`INSERT INTO jobs (title, description, role, postedDate) 
                VALUES (?, ?, ?, ?)`,
          [job.title, job.description, job.role, job.postedDate]
        );
      });

      console.log('Sample jobs inserted');
    }
  });
});

module.exports = db;